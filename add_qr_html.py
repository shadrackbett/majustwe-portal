import codecs

content = codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'r', 'utf-8').read()

cover_target = """        <div class="date">
            Prepared for the Executive Committee and Members<br/>
            Current as of 2026
        </div>
    </div>"""

cover_replace = """        <div class="date">
            Prepared for the Executive Committee and Members<br/>
            Current as of 2026
        </div>
        <div style="margin-top: 50px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://majustwe-portal-mu.vercel.app/" alt="Scan to visit the Portal" style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
            <p style="font-size: 0.9em; color: #666; margin-top: 10px;">Scan to access the MAJUSTWE Member Portal</p>
        </div>
    </div>"""

content = content.replace(cover_target, cover_replace)
codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'w', 'utf-8').write(content)
print("Updated HTML Handbook with QR code")
