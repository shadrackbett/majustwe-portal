import codecs
content = codecs.open('frontend/src/App.tsx', 'r', 'utf-8').read()

content = content.replace('hover:text-majustwe-blue hover:bg-gray-50">Home</Link>', 'hover:text-majustwe-blue hover:bg-gray-50">Home</Link>\n                  <Link to="/constitution" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 hover:text-majustwe-blue hover:bg-gray-50">Constitution</Link>')

codecs.open('frontend/src/App.tsx', 'w', 'utf-8').write(content)
