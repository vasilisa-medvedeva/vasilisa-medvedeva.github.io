#!/usr/bin/env python3
"""Local preview server that never lets the browser cache a page.

`python3 -m http.server` sends no Cache-Control at all, so browsers are free to
serve the HTML from disk without revalidating. The ?v= query strings on the
stylesheets do not help there — they live INSIDE the document, so a stale
document keeps asking for the stale theme. That is how the case pages kept
rendering the dark theme after the sage rollout had already landed on disk.
"""
import functools, http.server, socketserver, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8777


# Markup and code must never be served stale — that is the whole point of this
# server. Media must NOT be included in that: a case page carries ~17MB of
# screenshots, and forbidding their cache re-downloaded every megabyte on every
# reload, which showed up as phone frames rendering empty mid-load.
CACHEABLE = ('.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg',
             '.mp4', '.webm', '.woff', '.woff2', '.ttf', '.json')


class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        if self.path.split('?')[0].lower().endswith(CACHEABLE):
            self.send_header('Cache-Control', 'public, max-age=3600')
        else:
            self.send_header('Cache-Control', 'no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('', PORT), NoCache) as httpd:
    print('preview on http://localhost:%d (no-store)' % PORT)
    httpd.serve_forever()
