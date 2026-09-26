import codecs
content = codecs.open('frontend/src/App.tsx', 'r', 'utf-8').read()

content = content.replace('px-3 py-2\">Home</Link>', 'px-3 py-2\">Home</Link>\n                  <Link to=\"/constitution\" className=\"text-sm font-bold text-gray-700 hover:text-majustwe-blue transition-colors px-3 py-2\">Constitution</Link>')

content = content.replace('<Route path="/register" element={<Register />} />', '<Route path="/register" element={<Register />} />\n                <Route path="/constitution" element={<Constitution />} />')

content = content.replace('import Register from \'./pages/Register\';', 'import Register from \'./pages/Register\';\nimport Constitution from \'./pages/Constitution\';')

codecs.open('frontend/src/App.tsx', 'w', 'utf-8').write(content)
