from flask import Flask, render_template, jsonify, url_for, send_from_directory, request, flash, redirect, send_file
import pdf2image
from werkzeug.utils import secure_filename
import os
import uuid
from shutil import rmtree
from backend.collate import collate
from config import app

@app.route("/")
def index():
    print("index")
    return app.send_static_file("index.html")

@app.route("/gimmejson")
def gimmejson():
    print("giving arbitrary json")
    return jsonify(
        name="John Doe",
        id="42",
        universe="everything"
    )
    
def get_profile_location(profile_id):
    return f"backend/profiles/{profile_id}/"
    
def get_file_location(profile_id, file_id):
    return os.path.join(get_profile_location(profile_id), file_id)

# create a new profile; get ID (random, nonconsecutive)
# return {"profile":profile uri}
@app.route("/profiles", methods=["POST"])
def create_profile():
    # TODO: databasify
    while True:
        # perhaps collision detection isn"t necessary because very low collision rate
        try:
            profile_id = uuid.uuid4().hex
            os.mkdir(get_profile_location(profile_id))
            break;
        except:
            print("new profile collision")
    # 201 created
    return jsonify({"profile_id": profile_id}), 201
    
@app.route("/profiles/<string:profile_id>/<string:file_id>/preview.jpg")
def get_preview(profile_id, file_id):
    return send_from_directory(get_file_location(profile_id, file_id), "preview.jpg")

@app.route("/profiles/<string:profile_id>/<string:file_id>/file.pdf")
def get_file(profile_id, file_id):
    return send_from_directory(get_file_location(profile_id, file_id), "file.pdf")

@app.route("/profiles/<string:profile_id>", methods=["POST"])
def upload_pdf(profile_id):
    app.logger.info(request)
    if "file" not in request.files:
        flash("No file part")
        return redirect(request.url)
    file = request.files["file"]
    if file.filename == "":
        flash("No selected file")
        return redirect(request.url)
    if file:
        # filename = secure_filename(file.filename)
        file_id = uuid.uuid4().hex;
        folder = get_file_location(profile_id, file_id)
        try:
            os.mkdir(folder)
        except:
            return jsonify({"error": "File Exists"})
        fileloc = os.path.join(folder, "file.pdf")
        file.save(fileloc)
        pages = pdf2image.convert_from_path(fileloc, 300)
        pages[0].save(os.path.join(folder, "preview.jpg"), "JPEG")
        return jsonify({
            "file_id": file_id
        }), 201

@app.route("/profiles/<string:profile_id>/<string:file_id>", methods=["DELETE"])
def delete_pdf(profile_id, file_id):
    folder = get_file_location(profile_id, file_id)
    rmtree(folder)
    return '', 200
    
@app.route("/profiles/<string:profile_id>/collate", methods=["POST"])
def get_collated(profile_id):
    bundles = request.json["bundles"]
    bundles = map(lambda bundle: {
        "copies": bundle["quantity"],
        "files": [os.path.join(get_file_location(profile_id, file_id), "file.pdf") for file_id in bundle["files"]]
    }, bundles)
    outfilePath = collate(bundles, get_profile_location(profile_id))
    return send_file(outfilePath)

# TODO: edit existing file
# # replaces FILE_A
# PUT /profiles/1/File_A

if __name__ == "__main__":
    app.run(debug=True)