import codecs
content = codecs.open('frontend/src/App.tsx', 'r', 'utf-8').read()

content = content.replace('px-3 py-2\">Constitution</Link>', 'px-3 py-2\">Constitution</Link>\n                  <Link to=\"/faq\" className=\"text-sm font-bold text-gray-700 hover:text-majustwe-blue transition-colors px-3 py-2\">FAQ</Link>')

content = content.replace('hover:text-majustwe-blue hover:bg-gray-50">Constitution</Link>', 'hover:text-majustwe-blue hover:bg-gray-50">Constitution</Link>\n                  <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 hover:text-majustwe-blue hover:bg-gray-50">FAQ</Link>')

content = content.replace('<Route path="/constitution" element={<Constitution />} />', '<Route path="/constitution" element={<Constitution />} />\n                <Route path="/faq" element={<FAQ />} />')

content = content.replace('import Constitution from \'./pages/Constitution\';', 'import Constitution from \'./pages/Constitution\';\nimport FAQ from \'./pages/FAQ\';')

codecs.open('frontend/src/App.tsx', 'w', 'utf-8').write(content)
