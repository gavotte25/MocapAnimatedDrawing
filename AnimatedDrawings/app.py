import os
from flask import Flask, flash, request, redirect, url_for
from flask_cors import CORS
from animated_drawings import render
from examples.image_to_annotations import image_to_annotations

ANNOTATION_FOLDER = '../SharedVolume/Annotation'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
CORS(app)
app.config['ANNOTATION_FOLDER'] = ANNOTATION_FOLDER
TORCH_SERVE_BASE_URL = 'http://172.18.0.3:8080'

@app.route('/create_annotation', methods=['POST'])
def create_annotation():
    response_text, code = upload_file(request, app.config['ANNOTATION_FOLDER'])
    if code == 200:
        image_to_annotations(response_text, ANNOTATION_FOLDER, TORCH_SERVE_BASE_URL)
        return response_text, 200
    else:
        return response_text, code

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_file(request, dest):
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    if file and allowed_file(file.filename):
        filename = 'input' + os.path.splitext(file.filename)[1]
        filename = os.path.join(dest, filename)
        if not os.path.exists(dest):
            os.makedirs(dest)
        file.save(filename)
        return filename, 200
    return 'Unsupported file', 400

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=1025)

# render.start('./examples/config/mvc/export_gif_example.yaml')