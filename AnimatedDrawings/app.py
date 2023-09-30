import os
from flask import Flask, flash, request, redirect, url_for
from animated_drawings import render

UPLOAD_FOLDER = '../SharedVolume'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    if file and allowed_file(file.filename):
        filename = 'input' + os.path.splitext('my_file.txt')[1]
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return 'OK', 200
    return 'Unsupported file', 400

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=1025)

render.start('./examples/config/mvc/export_gif_example.yaml')