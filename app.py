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
    return app.send_static_file("index.html")

@app.route("/gimmejson")
def gimmejson():
    print("giving arbitrary json")
    return jsonify(
        name="John Doe",
        id="42",
        universe="everything"
    )
    
def get_profile_location(profileID):
    return f"backend/profiles/{profileID}/"
    
def get_file_location(profileID, fileID):
    return os.path.join(get_profile_location(profileID), fileID)

# create a new profile; get ID (random, nonconsecutive)
# return {"profile":profile uri}
@app.route("/profiles", methods=["POST"])
def create_profile():
    # TODO: databasify
    while True:
        # perhaps collision detection isn"t necessary because very low collision rate
        try:
            profileID = uuid.uuid4().hex
            os.mkdir(get_profile_location(profileID))
            break;
        except:
            print("new profile collision")
    # 201 created
    return jsonify({"profileID": profileID}), 201
    
@app.route("/profiles/<string:profileID>/<string:fileID>/preview.jpg")
def get_preview(profileID, fileID):
    return send_from_directory(get_file_location(profileID, fileID), "preview.jpg")

@app.route("/profiles/<string:profileID>/<string:fileID>/file.pdf")
def get_file(profileID, fileID):
    return send_from_directory(get_file_location(profileID, fileID), "file.pdf")

@app.route("/profiles/<string:profileID>", methods=["POST"])
def upload_pdf(profileID):
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
        fileID = uuid.uuid4().hex;
        folder = get_file_location(profileID, fileID)
        try:
            print("trying to make", folder)
            os.mkdir(folder)
        except:
            return jsonify({"error": "File Exists"}), 490
        fileloc = os.path.join(folder, "file.pdf")
        file.save(fileloc)
        pages = pdf2image.convert_from_path(fileloc, size=200)
        pages[0].save(os.path.join(folder, "preview.jpg"), "JPEG")
        return jsonify({
            "fileID": fileID
        }), 201

@app.route("/profiles/<string:profileID>/<string:fileID>", methods=["DELETE"])
def delete_pdf(profileID, fileID):
    folder = get_file_location(profileID, fileID)
    rmtree(folder)
    return '', 200
    
@app.route("/profiles/<string:profileID>/collate", methods=["POST"])
def get_collated(profileID):
    bundles = request.json["bundles"]
    bundles = map(lambda bundle: {
        "copies": bundle["quantity"],
        "files": [os.path.join(get_file_location(profileID, fileID), "file.pdf") for fileID in bundle["files"]]
    }, bundles)
    outfilePath = collate(bundles, get_profile_location(profileID))
    return send_file(outfilePath)

# TODO: edit existing file
# # replaces FILE_A
# PUT /profiles/1/File_A

if __name__ == "__main__":
    app.run(debug=True)