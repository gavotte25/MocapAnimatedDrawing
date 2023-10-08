
from flask import Flask, request, jsonify
import os
import subprocess
 
TEMP_FOLDER = '../SharedVolume/Temp'
app = Flask(__name__)
 
@app.route("/extract-bvh", methods=['POST'])
def extractBvh():
    name = request.form['name']
    if not name:
        return 'Name missing', 500
    filename = os.path.join(TEMP_FOLDER, name)
    if not os.path.exists(filename):
        return 'Input file does not exist', 500
    process = subprocess.Popen(['sudo','sh', 'convert.sh', name], stderr=subprocess.PIPE, stdout=subprocess.PIPE)
    stdout, stderr = process.communicate()
    exit_code = process.wait()
    if (exit_code == 0):
        return 'OK', 200
    return 'Error', 400
 
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=1024)