#!/usr/bin/python3
from PyPDF2 import PdfFileWriter, PdfFileReader, PdfFileMerger
import os
from tempfile import TemporaryFile

def collate(bundles):
    # TODO: do this properly instead of __file__
    stripePath = os.path.join(os.path.dirname(__file__), 'stripe.pdf')
    wpdf = PdfFileReader(open(stripePath, "rb"))
    endmark = wpdf.getPage(0)

    output = PdfFileMerger()
    for bundle in bundles:
        subpdf = PdfFileWriter()
        numLeft = len(bundle["files"])
        for fileToInsert in bundle["files"]:
            # fileToInsert is passed as a file-like object from Flask
            numLeft -= 1
            ipdf = PdfFileReader(fileToInsert)
            length = ipdf.getNumPages()
            for i in range(length):
                page = ipdf.getPage(i)
                if numLeft==0 and i == length-1:
                    page.mergePage(endmark)
                subpdf.addPage(page)
        # had trouble merging PdfFileMerger-s, so save this and reopen
        subpdfFile = TemporaryFile()
        subpdf.write(subpdfFile)
        subpdfFile.seek(0)
        subpdf = PdfFileReader(subpdfFile)
        length = subpdf.getNumPages()
        for i in range(bundle["copies"]):
            output.append(subpdf)
        subpdfFile.close()
    outfile = TemporaryFile()
    output.write(outfile)
    outfile.seek(0)
    return outfile
