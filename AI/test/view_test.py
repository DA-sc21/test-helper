from flask import Flask, redirect, url_for, request, render_template
from flask_cors import CORS

import sys
sys.path.extend(["./","../","./src","../src"])

from student_identification.detectText import detect_text
from student_identification.compareFace import compare_faces
import s3path

app = Flask(__name__)
CORS(app)

@app.route('/',methods=['GET'])
def index_test():
    return render_template('index.html')

@app.route('/identification',methods=['POST'])
def identification_test():
    test_id = request.form['test_id']
    student_id = request.form['student_id']
    idcard_path= s3path.S3_ROOT+ test_id + s3path.S3_STUDENT_FOLDER+ student_id + s3path.S3_STUDENT_CARD
    face_path = s3path.S3_ROOT+ test_id + s3path.S3_STUDENT_FOLDER+ student_id + s3path.S3_FACE
    bucket=s3path.S3_BUCKET

    if not test_id or not student_id :
        return render_template(
            'result_id.html',
            result = False,
    )

    result_text = detect_text(bucket, idcard_path,student_id)
    
    if not result_text :
        return render_template(
            'result_id.html',
            result = result_text,
    )
    
    result_face = compare_faces(bucket,idcard_path,face_path)
    return render_template(
            'result_id.html',
            result = result_face,
    )



@app.route('/hand-detection',methods=['POST'])
def temp_detection_test():
    pass

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,threaded=True, debug=True)
    #app.run(host='0.0.0.0',port=5000,debug=True)