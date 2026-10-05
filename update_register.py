import codecs

content = codecs.open(r'C:\majustwe_portal\frontend\src\pages\Register.tsx', 'r', 'utf-8').read()

target = """        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-majustwe-blue">
            Join MAJUSTWE
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Fill in your details to apply for membership.
          </p>
        </div>"""

replacement = """        <div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <img src="/logo.png" alt="MAJUSTWE Logo" className="h-20 w-auto drop-shadow-md rounded-full" />
            <h2 className="text-center text-3xl font-extrabold text-majustwe-blue">
              Join MAJUSTWE
            </h2>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600">
            Fill in your details to apply for membership.
          </p>
          <div className="mt-4 flex justify-center hidden sm:flex flex-col items-center">
             <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://majustwe-portal-mu.vercel.app/" alt="Scan QR Code" className="rounded-lg shadow-sm mb-1" />
             <p className="text-xs text-gray-500">Scan to view on mobile</p>
          </div>
        </div>"""

content = content.replace(target, replacement)
codecs.open(r'C:\majustwe_portal\frontend\src\pages\Register.tsx', 'w', 'utf-8').write(content)
print("Updated Register.tsx")
