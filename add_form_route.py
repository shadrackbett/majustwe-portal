import codecs
content = codecs.open('frontend/src/App.tsx', 'r', 'utf-8').read()

content = content.replace('import Brochure from \'./pages/Brochure\';', 'import Brochure from \'./pages/Brochure\';\nimport MembershipForm from \'./pages/MembershipForm\';')

content = content.replace('<Route path="/join-us" element={<Brochure />} />', '<Route path="/join-us" element={<Brochure />} />\n                <Route path="/membership-form" element={<MembershipForm />} />')

codecs.open('frontend/src/App.tsx', 'w', 'utf-8').write(content)
