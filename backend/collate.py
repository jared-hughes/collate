#!/usr/bin/python3
from PyPDF2 import PdfFileWriter, PdfFileReader, PdfFileMerger
import os

def collate(bundles, outfolder):
    # TODO: do this properly instead of __file__
    stripePath = os.path.join(os.path.dirname(__file__), 'stripe.pdf')
    wpdf = PdfFileReader(open(stripePath, "rb"))
    endmark = wpdf.getPage(0)

    output = PdfFileMerger()
    for bundle in bundles:
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
        subpdfPath = os.path.join(outfolder, ".subpdf.pdf")
        with open(subpdfPath, 'wb') as f:
            subpdf.write(f)
        subpdf = PdfFileReader(open(subpdfPath, "rb"));
        length = subpdf.getNumPages()
        for i in range(bundle["copies"]):
            output.append(subpdf)
        os.remove(subpdfPath)
    outfilePath = os.path.join(outfolder, "outfile.pdf");
    output.write(outfilePath)
    return outfilePath
