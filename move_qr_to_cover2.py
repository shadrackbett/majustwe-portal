import codecs

content = codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'r', 'utf-8').read()

# Put back on Cover Page
target_cover = """        <div class="date">
            Prepared by <strong>Shadrack Bett</strong><br/>
            For the Executive Committee and Members<br/>
            Current as of 01 October 2026
        </div>

    </div>"""

replace_cover = """        <div class="date">
            Prepared by <strong>Shadrack Bett</strong><br/>
            For the Executive Committee and Members<br/>
            Current as of 01 October 2026
        </div>
        <div style="margin-top: 50px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://majustwe-portal-mu.vercel.app/" alt="Scan to visit the Portal" style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
            <p style="font-size: 0.9em; color: #666; margin-top: 10px;">Scan to access the MAJUSTWE Member Portal</p>
        </div>
    </div>"""

# I will use a more robust replacement just in case
import re
content = re.sub(
    r'<div class="date">.*?Current as of 01 October 2026.*?</div>\s*</div>', 
    r"""<div class="date">
            Prepared by <strong>Shadrack Bett</strong><br/>
            For the Executive Committee and Members<br/>
            Current as of 01 October 2026
        </div>
        <div style="margin-top: 50px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://majustwe-portal-mu.vercel.app/" alt="Scan to visit the Portal" style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
            <p style="font-size: 0.9em; color: #666; margin-top: 10px;">Scan to access the MAJUSTWE Member Portal</p>
        </div>
    </div>""",
    content, 
    flags=re.DOTALL
)

codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'w', 'utf-8').write(content)
print("Moved QR code back to Cover Page using regex")
