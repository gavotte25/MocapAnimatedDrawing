import os
from flask import Flask, flash, request, redirect, url_for, jsonify
from flask_cors import CORS
from animated_drawings import render
from examples.image_to_annotations import image_to_annotations
from examples.annotations_to_animation import annotations_to_animation

ANNOTATION_FOLDER = '../SharedVolume/Annotation'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MOTION_FOLDER = 'examples/config/motion'

BUILTIN_RETARGET_CONFIG = {
    'jumping_jacks': 'examples/config/retarget/cmu1_pfp.yaml',
    'dab': 'examples/config/retarget/fair1_ppf.yaml',
    'jumping': 'examples/config/retarget/fair1_ppf.yaml',
    'wave_hello': 'examples/config/retarget/fair1_ppf.yaml',
    'zombie': 'examples/config/retarget/fair1_ppf.yaml',
    'jesse_dance': 'examples/config/retarget/mixamo_fff.yaml'
}

app = Flask(__name__)
CORS(app)
TORCH_SERVE_BASE_URL = 'http://172.18.0.3:8080'

@app.route('/create-annotation', methods=['POST'])
def create_annotation():
    response_text, code = upload_file(request, ANNOTATION_FOLDER)
    print(code)
    if code == 200:
        image_to_annotations(response_text, ANNOTATION_FOLDER, TORCH_SERVE_BASE_URL)
        return 'OK', 200
    else:
        return response_text, code

@app.route('/')
def check_existing_annotation():
    return jsonify(exists=os.path.isfile(ANNOTATION_FOLDER + '/char_cfg.yaml')), 200

@app.route('/motions', methods=['GET'])
def get_motions():
    motions = []
    for filename in os.listdir(MOTION_FOLDER):
        if filename.endswith('.yaml'):
            motion = filename.replace('.yaml','')
            motions.append(motion)
    else:
        return jsonify(motions=motions)

@app.route('/process-img', methods=['POST'])
def process_image():
    if 'motion' not in request.form:
        return 'Invalid request', 400
    motion = request.form['motion']
    annotations_to_animation(ANNOTATION_FOLDER, get_motion_config(motion), get_retarget_config(motion))
    return 'OK', 200

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

def get_retarget_config(motion):
    if motion in BUILTIN_RETARGET_CONFIG:
        return BUILTIN_RETARGET_CONFIG[motion]
    return 'examples/config/retarget/mocap_retarget.yaml'

def get_motion_config(motion):
    return 'examples/config/motion/{}.yaml'.format(motion)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=1025)

# render.start('./examples/config/mvc/export_gif_example.yaml')