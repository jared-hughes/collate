from flask import Flask, render_template, jsonify, url_for, send_from_directory, request, flash, redirect, send_file
import pdf2image
from werkzeug.utils import secure_filename
import json
import io
from backend.collate import collate
from tempfile import TemporaryFile
from config import app

@app.route("/")
def index():
    return app.send_static_file("index.html")
    
@app.route("/get_preview", methods=["POST"])
def get_preview():
    file = request.files["file"]
    pages = pdf2image.convert_from_bytes(file.read(), size = 200)
    outfile = TemporaryFile()
    pages[0].save(outfile, "JPEG")
    outfile.seek(0)
    return send_file(
        io.BytesIO(outfile.read()),
        attachment_filename="preview.jpg",
        mimetype="image/jpg"
    )
    
@app.route("/collate", methods=["POST"])
def get_collated():
    content = request.form.get("bundles")
    bundles = json.loads(content)
    files = request.files.getlist("files")
    fileMap = {}
    for file in files:
        fileMap[file.filename] = file
    bundles = map(lambda bundle: {
        "copies": bundle["quantity"],
        "files": [fileMap[fileID] for fileID in bundle["files"]]
    }, bundles)
    with collate(bundles) as outfile:
        return send_file(
            io.BytesIO(outfile.read()),
            attachment_filename="merged.pdf",
            mimetype="application/pdf",
            as_attachment=True
        )
    
if __name__ == "__main__":
    app.run(debug=True)