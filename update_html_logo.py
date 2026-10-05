import codecs

content = codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'r', 'utf-8').read()

# 1. Add Logo to Cover Page
cover_target = """    <!-- Cover Page -->
    <div class="cover-page">
        <h1>MAJUSTWE</h1>"""
cover_replace = """    <!-- Cover Page -->
    <div class="cover-page">
        <img src="frontend/public/logo.png" alt="MAJUSTWE Logo" style="max-width: 200px; margin-bottom: 20px; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
        <h1>MAJUSTWE</h1>"""
content = content.replace(cover_target, cover_replace)

# 2. Change styling and wording of the bylaws
old_bylaw_style = """    <div style="border: 2px solid #dc2626; padding: 20px; background-color: #fef2f2; margin-top: 40px; border-radius: 8px;">
        <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; margin-top: 0;" id="bylaws">APPENDIX: OFFICIALS' BYLAWS (RESTRICTED USE)</h2>
        <p style="font-weight: bold; color: #dc2626;">The following bylaws are strictly for use and enforcement by the MAJUSTWE Executive Committee and Officials.</p>

        <h3 style="color: #991b1b; margin-top: 20px;">1. Meeting Schedule</h3>"""
new_bylaw_style = """    <div style="border: 2px solid var(--primary); padding: 20px; background-color: #f8fafc; margin-top: 40px; border-radius: 8px;">
        <h2 style="color: var(--primary); border-bottom: 2px solid var(--primary); margin-top: 0;" id="bylaws">APPENDIX: OFFICIALS' BYLAWS (FOR OFFICIAL USE)</h2>
        <p style="font-weight: bold; color: var(--primary);">The following bylaws provide operational guidelines for use by the MAJUSTWE Executive Committee and Officials.</p>

        <h3 style="color: var(--primary); margin-top: 20px;">1. Meeting Schedule</h3>"""
content = content.replace(old_bylaw_style, new_bylaw_style)

# 3. Fix colors for the rest of the bylaws headers
content = content.replace('<h3 style="color: #991b1b; margin-top: 20px;">2.', '<h3 style="color: var(--primary); margin-top: 20px;">2.')
content = content.replace('<h3 style="color: #991b1b; margin-top: 20px;">3.', '<h3 style="color: var(--primary); margin-top: 20px;">3.')
content = content.replace('<h3 style="color: #991b1b; margin-top: 20px;">4.', '<h3 style="color: var(--primary); margin-top: 20px;">4.')

# 4. Fix Table of Contents wording
toc_old = """<li><a href="#bylaws" style="color: #dc2626;">Appendix: Officials' Bylaws (Restricted)</a></li>"""
toc_new = """<li><a href="#bylaws" style="color: var(--primary); font-weight: bold;">Appendix: Officials' Bylaws (For Official Use)</a></li>"""
content = content.replace(toc_old, toc_new)


codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'w', 'utf-8').write(content)
print("Updated HTML with logo and new bylaws wording")
