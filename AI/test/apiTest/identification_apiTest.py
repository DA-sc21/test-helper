import unittest
import warnings
import json


import sys
sys.path.extend(["./","../","../../","./src","../src","../../src"])
sys.path.extend(["./AI/src","./AI"])
import app
import s3path

class UnitTest(unittest.TestCase):
    def setUp(self):
        self.app = app.app.test_client()
        self.student_num = s3path.S3_TEMP_STUDENT_NUM
        self.test_id = s3path.S3_TEMP_TEST_ID
        self.fakestudent_num = '0000000a'
        self.faketest_id = '00000a'
        self.right_parameter = {
            'test_id' : self.test_id,
            'student_num' : self.student_num
        }
        self.wrong_parameter_test_id = {
            'test_id' : self.faketest_id,
            'student_num' : self.student_num
        }
        self.wrong_parameter_student_num= {
            'test_id' : self.test_id,
            'student_num' : self.fakestudent_num
        }
        self.no_parameter_student_num={
            'test_id' : self.test_id
        }
        self.no_parameter_test_id = {
            'student_num' : self.student_num
        }
        warnings.filterwarnings("ignore", category=ResourceWarning, message="unclosed.*<ssl.SSLSocket.*>") 

    def test_right_parameter(self):
        response = self.app.post('/identification', data=self.right_parameter)
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(True, data['result'])

    def test_wrong_test_parameter(self):
        response = self.app.post("/identification",data=self.wrong_parameter_test_id)
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(False,data['result'])

    def test_wrong_studentID_parameter(self):
        response = self.app.post("/identification",data=self.wrong_parameter_student_num)
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(False,data['result'])

    def test_no_test_parameter(self):
        response = self.app.post("/identification",data=self.no_parameter_test_id)
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(False,data['result'])

    def test_no_studentID_parameter(self):
        response = self.app.post("/identification",data=self.no_parameter_student_num)
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(False,data['result'])

if __name__ == "__main__":
    unittest.main()