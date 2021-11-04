import unittest
import os
import warnings

import sys
sys.path.extend(["./","../","../../","./src","../src","../../src"])
sys.path.extend(["./AI/src","./AI"])
from student_identification.compareFace import compare_faces
from student_identification.detectText import detect_text
import s3path
    
class UnitTest(unittest.TestCase):
    def setUp(self):
        self.bucket = s3path.S3_BUCKET
        self.real_student_num = s3path.S3_TEMP_STUDENT_NUM
        self.fake_student_num = '20220000a'
        self.src_real_path = s3path.S3_ROOT + s3path.S3_TEMP_TEST_ID + s3path.S3_STUDENT_FOLDER \
                            + s3path.S3_TEMP_STUDENT_NUM+ s3path.S3_STUDENT_CARD
        self.tar_real_path = s3path.S3_ROOT + s3path.S3_TEMP_TEST_ID + s3path.S3_STUDENT_FOLDER \
                            + s3path.S3_TEMP_STUDENT_NUM+ s3path.S3_FACE
        self.tar_fake_path = s3path.S3_ROOT + s3path.S3_TEMP_TEST_ID + s3path.S3_STUDENT_FOLDER \
                            + s3path.S3_TEMP_STUDENT_NUM+ "/fake_face.jpg"
        warnings.filterwarnings("ignore", category=ResourceWarning, message="unclosed.*<ssl.SSLSocket.*>") 
       
    
    def test_wrong_face(self):
        self.assertEqual(False,compare_faces(self.bucket,self.src_real_path,self.tar_fake_path))

    def test_right_face(self):
        self.assertEqual(True,compare_faces(self.bucket,self.src_real_path,self.tar_real_path))
  
    def test_wrong_card(self):
        self.assertEqual(False,detect_text(self.bucket,self.src_real_path,self.fake_student_num))

    def test_right_card(self):
        self.assertEqual(True,detect_text(self.bucket,self.src_real_path,self.real_student_num))


if __name__ == '__main__':
    unittest.main()