"""Shared helpers for the stack tools: read stack.yml, run git.

stack.yml is read by a small parser, not a YAML library, so keep it in its
current shape: top-level `key: value` lines, and under `stack:` one entry per
line as `- { key: value, key: [a, b], ... }`. Comments (#) are allowed.
"""
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
STACK_FILE = os.path.join(HERE, 'stack.yml')
REPO = os.environ.get('AFFINE_REPO', '/workspace/AFFiNE')
COMMITTER = {
    'GIT_COMMITTER_NAME': 'Jasper Aorangi',
    'GIT_COMMITTER_EMAIL': '3222409+spmp@users.noreply.github.com',
}


def _strip_comment(line):
    out, quote = [], None
    for ch in line:
        if quote:
            if ch == quote:
                quote = None
        elif ch in '"\'':
            quote = ch
        elif ch == '#':
            break
        out.append(ch)
    return ''.join(out).rstrip()


def _value(v):
    v = v.strip()
    if v.startswith('[') and v.endswith(']'):
        return [x.strip() for x in v[1:-1].split(',') if x.strip()]
    if len(v) >= 2 and v[0] == v[-1] and v[0] in '"\'':
        return v[1:-1]
    return v


def _flow_map(text):
    body = text.strip()
    assert body.startswith('{') and body.endswith('}'), text
    body = body[1:-1]
    parts, depth, cur = [], 0, ''
    for ch in body:
        if ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
        if ch == ',' and depth == 0:
            parts.append(cur)
            cur = ''
        else:
            cur += ch
    if cur.strip():
        parts.append(cur)
    entry = {}
    for p in parts:
        k, _, v = p.partition(':')
        entry[k.strip()] = _value(v)
    return entry


def load_stack(path=STACK_FILE):
    top, stack, in_stack = {}, [], False
    for raw in open(path):
        line = _strip_comment(raw)
        if not line.strip():
            continue
        if line.startswith('stack:'):
            in_stack = True
            continue
        if in_stack and line.lstrip().startswith('- '):
            stack.append(_flow_map(line.lstrip()[2:]))
            continue
        if not line.startswith(' '):
            in_stack = False
            k, _, v = line.partition(':')
            top[k.strip()] = _value(v)
    top['stack'] = stack
    return top


def git(*args, env=None, input=None, check=True, repo=None):
    e = dict(os.environ)
    e.update(env or {})
    r = subprocess.run(['git', '-C', repo or REPO, *args], capture_output=True,
                       text=True, env=e, input=input)
    if check and r.returncode != 0:
        sys.exit(f'git {" ".join(args)} failed:\n{r.stdout}{r.stderr}')
    return r.stdout.strip()


def rev(x, repo=None):
    return git('rev-parse', '--verify', '--quiet', x + '^{commit}', check=False, repo=repo) or None


def merge_tree(base, ours, theirs):
    """Three-way merge in memory. Returns (tree, conflicted_files)."""
    r = subprocess.run(['git', '-C', REPO, 'merge-tree', '--write-tree', '--name-only',
                        f'--merge-base={base}', ours, theirs], capture_output=True, text=True)
    lines = r.stdout.split('\n')
    if r.returncode == 0:
        return lines[0], []
    if r.returncode == 1:
        files = []
        for l in lines[1:]:
            if not l.strip():
                break
            files.append(l.strip())
        return lines[0], files
    sys.exit(f'merge-tree failed: {r.stderr}')


def working_parent(stack, i, upstream_ref):
    return stack[i - 1]['working'] if i > 0 else upstream_ref
