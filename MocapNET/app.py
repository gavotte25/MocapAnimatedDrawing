from flask import Flask
import subprocess

app = Flask(__name__)
 
@app.route("/")
def hello_world():
    process = subprocess.Popen(['sh', 'convert.sh'], stderr=subprocess.PIPE, stdout=subprocess.PIPE)
    stdout, stderr = process.communicate()
    exit_code = process.wait()
    print(stdout, stderr, exit_code)
    return "<p>Hello, World!</p>"
 
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=1024)