import codecs
content = codecs.open('frontend/src/App.tsx', 'r', 'utf-8').read()

content = content.replace(
    '<div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">',
    '<div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 print:p-0 print:m-0 print:max-w-none">'
)

codecs.open('frontend/src/App.tsx', 'w', 'utf-8').write(content)
