import codecs
content = codecs.open('frontend/src/App.tsx', 'r', 'utf-8').read()

content = content.replace('px-3 py-2\">FAQ</Link>', 'px-3 py-2\">FAQ</Link>\n                  <Link to=\"/join-us\" className=\"text-sm font-bold text-gray-700 hover:text-majustwe-blue transition-colors px-3 py-2\">Brochure</Link>')

content = content.replace('hover:text-majustwe-blue hover:bg-gray-50">FAQ</Link>', 'hover:text-majustwe-blue hover:bg-gray-50">FAQ</Link>\n                  <Link to="/join-us" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 hover:text-majustwe-blue hover:bg-gray-50">Brochure</Link>')

content = content.replace('<Route path="/faq" element={<FAQ />} />', '<Route path="/faq" element={<FAQ />} />\n                <Route path="/join-us" element={<Brochure />} />')

content = content.replace('import FAQ from \'./pages/FAQ\';', 'import FAQ from \'./pages/FAQ\';\nimport Brochure from \'./pages/Brochure\';')

codecs.open('frontend/src/App.tsx', 'w', 'utf-8').write(content)
