import codecs
content = codecs.open('frontend/src/App.tsx', 'r', 'utf-8').read()

# Desktop nav links
content = content.replace('<Link to="/faq" className="text-sm font-bold text-gray-700 hover:text-majustwe-blue transition-colors px-3 py-2">FAQ</Link>\n                  <Link to="/join-us" className="text-sm font-bold text-gray-700 hover:text-majustwe-blue transition-colors px-3 py-2">Brochure</Link>', '')

# Mobile nav links (they might not be there or might have different spacing, but earlier I did `replace`)
import re
content = re.sub(r'<Link to="/faq".*?FAQ</Link>\s*<Link to="/join-us".*?Brochure</Link>', '', content)

codecs.open('frontend/src/App.tsx', 'w', 'utf-8').write(content)
