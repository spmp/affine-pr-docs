# Only needed to preview the site locally: bundle install && bundle exec jekyll serve
source "https://rubygems.org"
# Pinned so Bundler fails loudly rather than silently falling back to an ancient
# release (github-pages 232 needs Ruby < 4.0, via commonmarker 0.23).
gem "github-pages", "~> 232", group: :jekyll_plugins

# Ruby 3.4+/4.0 no longer bundles these; github-pages (Jekyll 3.10) still needs them.
# Local preview only: GitHub Pages builds with its own gem set and ignores this file.
gem "base64"
gem "bigdecimal"
gem "csv"
# Jekyll 3.10's logger subclass skips super(); logger 1.6+ then crashes on @level_override.
gem "logger", "< 1.6"
gem "ostruct"
gem "rexml"
gem "webrick"
