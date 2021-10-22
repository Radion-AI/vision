from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
from models.models import MobileNet
import os, base64
from math import floor

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = 'uploads'

model = MobileNet()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/infer', methods=['POST'])
def success():
    if request.method == 'POST':
        file_val = request.files['file']
    if request.method == 'POST':
        print('hello')
        # f = request.data['images']
        name = request.form['imagels']
        print(name)
        saveLocation = f.filename
        print(saveLocation)
        f.save(saveLocation)
        inference, confidence = model.infer(saveLocation)
        # make a percentage with 2 decimal points
        confidence = floor(confidence * 10000) / 100
        # delete file after making an inference
        os.remove(saveLocation)
        # respond with the inference
        return render_template('inference.html', name=inference, confidence=confidence)

@app.route('/background_process_test', methods=['POST'])
def background_process_test():
    files = request.files.getlist('files[]')
    outputs = []
    for file in files:
        filename = secure_filename(file.filename)
        inference, confidence = model.infer(file)
        print("This is :", round(confidence*100, 2))
        output = {'filename' : filename, 'inference' : inference, 'confidence' : round(confidence*100, 2)}
        outputs.append(output)
        print(inference, confidence)
    print ("Hello")
    return jsonify(outputs)

@app.route('/team')
def about_team():
    return render_template('team.html')

if __name__ == '__main__':
    # app.debug = True
    app.run(debug=True)
    # port = int(os.environ.get("PORT", 80))
    # app.run(host='0.0.0.0', port=port)

