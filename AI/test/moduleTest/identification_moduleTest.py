import unittest
import os
import warnings
from dotenv import load_dotenv
load_dotenv()

import sys
sys.path.extend(["./","../","../../","./src","../src","../../src"])

from student_identification.compareFace import compare_faces
from student_identification.detectText import detect_text
import s3path
    
class UnitTest(unittest.TestCase):
    def setUp(self):
        self.bucket = s3path.S3_BUCKET
        self.real_studentID = s3path.S3_TEMP_STUDENT_ID
        self.fake_studentID = '20220000a'
        self.src_real_path = s3path.S3_ROOT + s3path.S3_TEMP_TEST_ID + s3path.S3_STUDENT_FOLDER \
                            + s3path.S3_TEMP_STUDENT_ID+ s3path.S3_STUDENT_CARD
        self.tar_real_path = s3path.S3_ROOT + s3path.S3_TEMP_TEST_ID + s3path.S3_STUDENT_FOLDER \
                            + s3path.S3_TEMP_STUDENT_ID+ s3path.S3_FACE
        self.tar_fake_path = s3path.S3_ROOT + s3path.S3_TEMP_TEST_ID + s3path.S3_STUDENT_FOLDER \
                            + s3path.S3_TEMP_STUDENT_ID+ "/fake_face.jpg"
        warnings.filterwarnings("ignore", category=ResourceWarning, message="unclosed.*<ssl.SSLSocket.*>") 
       
    
    def test_wrong_face(self):
        self.assertEqual(False,compare_faces(self.bucket,self.src_real_path,self.tar_fake_path))

    def test_right_face(self):
        self.assertEqual(True,compare_faces(self.bucket,self.src_real_path,self.tar_real_path))
  
    def test_wrong_card(self):
        self.assertEqual(False,detect_text(self.bucket,self.src_real_path,self.fake_studentID))

    def test_right_card(self):
        self.assertEqual(True,detect_text(self.bucket,self.src_real_path,self.real_studentID))


if __name__ == '__main__':
    unittest.main()