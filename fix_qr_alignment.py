import codecs

content = codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'r', 'utf-8').read()

target = """    <div style="float: right; text-align: center; margin: 0 0 20px 20px; border: 1px solid #ddd; padding: 10px; border-radius: 8px; background: #f8fafc;">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://majustwe-portal-mu.vercel.app/" alt="Scan to visit the Portal" />
        <p style="font-size: 0.8em; color: #666; margin: 5px 0 0 0; font-weight: bold;">Member Portal</p>
    </div>
    <h2 id="article1" style="margin-top: 0;">1. Name & Objectives</h2>"""

replace = """    <div style="text-align: right; margin-bottom: 10px;">
        <div style="display: inline-block; text-align: center; border: 1px solid #ddd; padding: 10px; border-radius: 8px; background: #f8fafc;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://majustwe-portal-mu.vercel.app/" alt="Scan to visit the Portal" />
            <p style="font-size: 0.8em; color: #666; margin: 5px 0 0 0; font-weight: bold;">Member Portal</p>
        </div>
    </div>
    <h2 id="article1" style="margin-top: 0;">1. Name & Objectives</h2>"""

content = content.replace(target, replace)

codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'w', 'utf-8').write(content)
print("Fixed QR code alignment in HTML Handbook")
