import unittest
import os
import warnings
import json

from dotenv import load_dotenv
load_dotenv()

import sys
sys.path.extend(["./","../","../../","./src","../src","../../src"])

import app
import s3path

class UnitTest(unittest.TestCase):
    def setUp(self):
        self.app = app.app.test_client()
        self.studentID = s3path.S3_TEMP_STUDENT_ID
        self.testID = s3path.S3_TEMP_TEST_ID
        self.fakestudentID = '0000000a'
        self.faketestID = '00000a'
        self.right_parameter = {
            'test_id' : self.testID,
            'student_id' : self.studentID
        }
        self.wrong_parameter_testID = {
            'test_id' : self.faketestID,
            'student_id' : self.studentID
        }
        self.wrong_parameter_studentID= {
            'test_id' : self.testID,
            'student_id' : self.fakestudentID
        }
        self.no_parameter_studentID={
            'test_id' : self.testID
        }
        self.no_parameter_testID = {
            'student_id' : self.studentID
        }
        warnings.filterwarnings("ignore", category=ResourceWarning, message="unclosed.*<ssl.SSLSocket.*>") 

    def test_right_parameter(self):
        response = self.app.post('/identification', data=self.right_parameter)
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(True, data['result'])

    def test_wrong_test_parameter(self):
        response = self.app.post("/identification",data=self.wrong_parameter_testID)
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(False,data['result'])

    def test_wrong_studentID_parameter(self):
        response = self.app.post("/identification",data=self.wrong_parameter_studentID)
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(False,data['result'])

    def test_no_test_parameter(self):
        response = self.app.post("/identification",data=self.no_parameter_testID)
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(False,data['result'])

    def test_no_studentID_parameter(self):
        response = self.app.post("/identification",data=self.no_parameter_studentID)
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(False,data['result'])

if __name__ == "__main__":
    unittest.main()