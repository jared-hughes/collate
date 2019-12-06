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
    subpdf = PdfFileMerger()
    for fileToInsert in bundle["files"]:
        ipdf = PdfFileReader(open(fileToInsert, "rb"))
        subpdf.append(ipdf)
    # had trouble merging PdfFileMerger-s, so save this and reopen
    # TODO: possibility for concurrency issues -- store hash to circumvent?
    subpdfName = ".subpdf.pdf"
    subpdf.write(subpdfName)
    subpdf.close()
    subpdf = PdfFileReader(open(subpdfName, "rb"));
    length = subpdf.getNumPages()
    subpdf.getPage(1).mergePage(endmark)
    for i in range(bundle["copies"]):
        output.append(subpdf)
    
output.write("newfile.pdf")
