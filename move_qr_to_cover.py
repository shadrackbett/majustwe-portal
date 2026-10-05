import codecs

content = codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'r', 'utf-8').read()

# Remove from Page 1 (Article 1)
target_page1 = """    <div style="text-align: right; margin-bottom: 10px;">
        <div style="display: inline-block; text-align: center; border: 1px solid #ddd; padding: 10px; border-radius: 8px; background: #f8fafc;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://majustwe-portal-mu.vercel.app/" alt="Scan to visit the Portal" />
            <p style="font-size: 0.8em; color: #666; margin: 5px 0 0 0; font-weight: bold;">Member Portal</p>
        </div>
    </div>
    <h2 id="article1" style="margin-top: 0;">1. Name & Objectives</h2>"""
replace_page1 = """    <h2 id="article1" style="margin-top: 0;">1. Name & Objectives</h2>"""
content = content.replace(target_page1, replace_page1)

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
content = content.replace(target_cover, replace_cover)

codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'w', 'utf-8').write(content)
print("Moved QR code back to Cover Page")
