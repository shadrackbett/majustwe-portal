import codecs

content = codecs.open(r'C:\majustwe_portal\frontend\src\pages\MembershipForm.tsx', 'r', 'utf-8').read()

target = """      <div className="text-center mb-2 border-b-2 border-black pb-1">
        <h1 className="text-xl font-extrabold uppercase mb-1">Matuga Junior Schools Teachers' Welfare</h1>
        <h2 className="text-base font-bold uppercase tracking-widest">(MAJUSTWE)</h2>
        <p className="mt-1 text-xs font-semibold">"Empowering Teachers, Building a Stronger Community"</p>
      </div>"""

replacement = """      <div className="flex justify-between items-center mb-2 border-b-2 border-black pb-2">
        <div className="w-24">
          <img src="/logo.png" alt="MAJUSTWE Logo" className="w-full h-auto object-contain rounded-full" />
        </div>
        <div className="text-center flex-1 px-4">
          <h1 className="text-xl font-extrabold uppercase mb-1 text-black">Matuga Junior Schools Teachers' Welfare</h1>
          <h2 className="text-base font-bold uppercase tracking-widest text-black">(MAJUSTWE)</h2>
          <p className="mt-1 text-xs font-semibold text-black">"Empowering Teachers, Building a Stronger Community"</p>
        </div>
        <div className="w-24 flex flex-col items-center">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://majustwe-portal-mu.vercel.app/" alt="QR Code" className="w-16 h-16" />
          <span className="text-[8px] font-bold mt-1 text-black whitespace-nowrap">Visit Our Portal</span>
        </div>
      </div>"""

content = content.replace(target, replacement)
codecs.open(r'C:\majustwe_portal\frontend\src\pages\MembershipForm.tsx', 'w', 'utf-8').write(content)
print("Updated MembershipForm.tsx with logo and QR code")
