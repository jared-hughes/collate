#!/usr/bin/python3

from PyPDF2 import PdfFileWriter, PdfFileReader, PdfFileMerger

spec = [
    {
        "files": [
            "Test A.pdf",
            "Test B.pdf"
        ],
        "copies": 2
    },
    {
        "files": [
            "Test A.pdf",
            "Test C.pdf"
        ],
        "copies": 3
    }
]

wpdf = PdfFileReader(open("stripe.pdf", "rb"))
endmark = wpdf.getPage(0)

output = PdfFileMerger()
for bundle in spec:
    subpdf = PdfFileWriter()
    numLeft = len(bundle["files"])
    for fileToInsert in bundle["files"]:
        numLeft -= 1
        ipdf = PdfFileReader(open(fileToInsert, "rb"))
        length = ipdf.getNumPages()
        for i in range(length):
            page = ipdf.getPage(i)
            if numLeft==0 and i == length-1:
                page.mergePage(endmark)
            subpdf.addPage(page)
    # had trouble merging PdfFileMerger-s, so save this and reopen
    # TODO: possibility for concurrency issues -- store hash to circumvent?
    subpdfName = ".subpdf.pdf"
    with open(subpdfName, 'wb') as f:
        subpdf.write(f)
    subpdf = PdfFileReader(open(subpdfName, "rb"));
    length = subpdf.getNumPages()
    subpdf.getPage(1).mergePage(endmark)
    for i in range(bundle["copies"]):
        output.append(subpdf)
    
output.write("newfile.pdf")
