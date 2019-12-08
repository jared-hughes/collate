import os
from flask import Flask

SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("No SECRET_KEY set for Flask app")

app = Flask(__name__, static_url_path="", static_folder="web/build");
app.config.update(
    # max 4 mb for single file
    MAX_CONTENT_LENGTH = 4 * 1024 * 1024,
    SESSION_TYPE = "filesystem",
    SECRET_KEY = SECRET_KEY
)
