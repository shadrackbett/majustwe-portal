import codecs
content = codecs.open('frontend/src/pages/MembershipForm.tsx', 'r', 'utf-8').read()

import re
# Find the exact button div block
end_block = """        <div className="mt-4 text-center">
          <button onClick={() => window.print()} className="print:hidden bg-majustwe-blue text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-blue-900 transition-colors">
            🖨️ Print Form
          </button>
      </div>
    </div>
    </>
  );
};

export default MembershipForm;"""

proper_end = """        <div className="mt-4 text-center">
          <button onClick={() => window.print()} className="print:hidden bg-majustwe-blue text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-blue-900 transition-colors">
            🖨️ Print Form
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default MembershipForm;"""

content = content.replace(end_block, proper_end)
# Wait, let me just replace everything after the button with the correct closing tags.
idx = content.find('<button onClick={() => window.print()}')
if idx != -1:
    button_start = content.rfind('<div className="mt-4 text-center">', 0, idx)
    if button_start != -1:
        content = content[:button_start] + """        <div className="mt-4 text-center">
          <button onClick={() => window.print()} className="print:hidden bg-majustwe-blue text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-blue-900 transition-colors">
            🖨️ Print Form
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default MembershipForm;
"""
        codecs.open('frontend/src/pages/MembershipForm.tsx', 'w', 'utf-8').write(content)
