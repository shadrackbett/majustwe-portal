import codecs
content = codecs.open('frontend/src/App.tsx', 'r', 'utf-8').read()

import re

# We will just replace the whole Desktop Menu links area
desktop_links_start = content.find('<div className="hidden md:flex items-center space-x-4">')
desktop_links_end = content.find('{user ? (', desktop_links_start)

if desktop_links_start != -1 and desktop_links_end != -1:
    new_desktop_links = '''<div className="hidden md:flex items-center space-x-4">
                  <Link to="/" className="text-sm font-bold text-gray-700 hover:text-majustwe-blue transition-colors px-3 py-2">Home</Link>
                  <Link to="/faq" className="text-sm font-bold text-gray-700 hover:text-majustwe-blue transition-colors px-3 py-2">FAQ</Link>
                  {user && (
                    <Link to="/constitution" className="text-sm font-bold text-gray-700 hover:text-majustwe-blue transition-colors px-3 py-2">Constitution</Link>
                  )}
                  '''
    content = content[:desktop_links_start] + new_desktop_links + content[desktop_links_end:]

# Now Mobile Menu
mobile_links_start = content.find('<Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base')
mobile_links_end = content.find('{user ? (', mobile_links_start)

if mobile_links_start != -1 and mobile_links_end != -1:
    new_mobile_links = '''<Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 hover:bg-gray-100">Home</Link>
                <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 hover:bg-gray-100">FAQ</Link>
                {user && (
                  <Link to="/constitution" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 hover:bg-gray-100">Constitution</Link>
                )}
                '''
    content = content[:mobile_links_start] + new_mobile_links + content[mobile_links_end:]

# Now protect the /constitution route
old_route = '<Route path="/constitution" element={<Constitution />} />'
new_route = '<Route path="/constitution" element={user ? <Constitution /> : <Navigate to="/login" replace />} />'
content = content.replace(old_route, new_route)

codecs.open('frontend/src/App.tsx', 'w', 'utf-8').write(content)
