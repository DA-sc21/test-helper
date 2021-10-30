from student_identification.detectText import detect_text
from student_identification.compareFace import compare_faces

from flask import Flask, redirect, url_for, request, render_template
from flask_restful import reqparse
from flask_cors import CORS

import json
import s3path

app = Flask(__name__)

@app.route('/identification',methods=['POST'])
def identification():
    parser = reqparse.RequestParser()
    parser.add_argument('test_id')
    parser.add_argument('student_id')
    args = parser.parse_args()

    test_id = args['test_id']
    student_id = args['student_id']
    
    if not test_id or not student_id :
        print("no test_id or student_id")
        return json.dumps({'result' : False})

    idcard_path= s3path.S3_ROOT+ test_id + s3path.S3_STUDENT_FOLDER+ student_id + s3path.S3_STUDENT_CARD
    face_path = s3path.S3_ROOT+ test_id + s3path.S3_STUDENT_FOLDER+ student_id + s3path.S3_FACE
    bucket=s3path.S3_BUCKET


    result_text = detect_text(bucket, idcard_path,student_id)
    if not result_text :
        return json.dumps({'result': False})
    
    result_face = compare_faces(bucket,idcard_path,face_path)
    return json.dumps({'result' : result_face})



@app.route('/hand-detection',methods=['POST'])
def detection():
    pass


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,threaded=True,debug=True)