from flask import Flask, render_template, jsonify

app = Flask(__name__, static_url_path="", static_folder="web/build");

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/gimmejson')
def gimmejson():
    return jsonify(
        name="John Doe",
        id="42",
        universe="everything"
    )


if __name__ == '__main__':
    app.run(debug=True)