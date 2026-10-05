import codecs

content = codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'r', 'utf-8').read()

# 1. Update the date
content = content.replace("Current as of 2026", "Current as of 01 October 2026")

# 2. Move the QR code
# Remove it from cover page
qr_block = """        <div style="margin-top: 50px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://majustwe-portal-mu.vercel.app/" alt="Scan to visit the Portal" style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
            <p style="font-size: 0.9em; color: #666; margin-top: 10px;">Scan to access the MAJUSTWE Member Portal</p>
        </div>"""
content = content.replace(qr_block, "")

# Add it to the top of Page 1 (Article 1)
target_article1 = """    <h2 id="article1">1. Name & Objectives</h2>"""
replace_article1 = """    <div style="float: right; text-align: center; margin: 0 0 20px 20px; border: 1px solid #ddd; padding: 10px; border-radius: 8px; background: #f8fafc;">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://majustwe-portal-mu.vercel.app/" alt="Scan to visit the Portal" />
        <p style="font-size: 0.8em; color: #666; margin: 5px 0 0 0; font-weight: bold;">Member Portal</p>
    </div>
    <h2 id="article1" style="margin-top: 0;">1. Name & Objectives</h2>"""

content = content.replace(target_article1, replace_article1)

codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'w', 'utf-8').write(content)
print("Updated HTML Handbook with date and QR code position")
