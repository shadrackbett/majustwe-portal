import codecs

content = codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'r', 'utf-8').read()

new_section_html = """
    <div class="page-break"></div>

    <div style="border: 2px solid #dc2626; padding: 20px; background-color: #fef2f2; margin-top: 40px; border-radius: 8px;">
        <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; margin-top: 0;" id="bylaws">APPENDIX: OFFICIALS' BYLAWS (RESTRICTED USE)</h2>
        <p style="font-weight: bold; color: #dc2626;">The following bylaws are strictly for use and enforcement by the MAJUSTWE Executive Committee and Officials.</p>

        <h3 style="color: #991b1b; margin-top: 20px;">1. Meeting Schedule</h3>
        <p>General meetings shall be held strictly on the <strong>first Saturday of every term</strong>.</p>

        <h3 style="color: #991b1b; margin-top: 20px;">2. Benefit & Contribution Tiers</h3>
        <p>When a bereavement occurs, mandatory contributions are strictly categorized as follows:</p>
        <ul>
            <li><strong>Loss of a Parent/Guardian:</strong> Ksh 200 per member.</li>
            <li><strong>Loss of a Principal Member / Spouse:</strong> Ksh 500 per member.</li>
        </ul>

        <h3 style="color: #991b1b; margin-top: 20px;">3. Claim Verification & Payout</h3>
        <p>All bereavement claims must first be <strong>verified by the respective Zonal Representatives and the Secretary</strong> before any processing can occur.</p>
        <p>Once verified, the Treasurer is authorized to make an <strong>immediate 50% payout</strong> of the expected total to the bereaved member to assist with urgent logistics, prior to the collection of the remaining funds.</p>

        <h3 style="color: #991b1b; margin-top: 20px;">4. Discipline & Code of Conduct</h3>
        <ul>
            <li><strong>Absences:</strong> Fines will be strictly levied against members who are absent from scheduled meetings (the exact penalty structure is determined by the executive, e.g., a Ksh 1,000 fine for 3 consecutive absences without a valid apology).</li>
            <li><strong>Conduct:</strong> Any member found in a state of inebriation during official welfare meetings or functions faces <strong>immediate expulsion</strong> from the welfare.</li>
        </ul>
    </div>
"""

target = "</body>"
content = content.replace(target, new_section_html + "\n</body>")

# Also add to TOC
toc_target = "<li><a href=\"#article8\">Article Eight: Amendments & Legal Framework</a></li>"
toc_replace = toc_target + "\n            <li><a href=\"#bylaws\" style=\"color: #dc2626;\">Appendix: Officials' Bylaws (Restricted)</a></li>"
content = content.replace(toc_target, toc_replace)

codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'w', 'utf-8').write(content)
print("Updated HTML Handbook")
