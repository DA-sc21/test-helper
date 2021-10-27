import boto3
import json
import os
from dotenv import load_dotenv
load_dotenv()


def compare_faces(bucket,src_path,tar_path):
    SIMILARITY_THRESHOLD = 75
    src_img = {'S3Object':{'Bucket':bucket,'Name': src_path}}
    tar_img = {'S3Object':{'Bucket':bucket,'Name': tar_path}}
    answer = True
    try :
        client=boto3.client('rekognition')
        response = client.compare_faces(SimilarityThreshold=SIMILARITY_THRESHOLD, SourceImage=src_img, TargetImage=tar_img)
        if len(response['FaceMatches'])==0 :
            answer=False
        # print(json.dumps(response, indent=4, sort_keys=True))
    except :
        print("AWS 에 접근 시 오류가 발생하였습니다! ")
        return False
        
    return answer
    
def main():
    import sys
    sys.path.append('../')
    import s3path    
    bucket= s3path.S3_BUCKET
    src_path = s3path.S3_ROOT + os.environ['S3_TEMP_TEST'] + s3path.S3_STUDENT_FOLDER+ os.environ['S3_TEMP_STUDENT'] + s3path.S3_STUDENT_CARD
    tar_path = s3path.S3_ROOT + os.environ['S3_TEMP_TEST'] + s3path.S3_STUDENT_FOLDER + os.environ['S3_TEMP_STUDENT'] + s3path.S3_FACE
    # tar_path = os.environ['S3_ROOT'] + os.environ['S3_TEMP_TEST'] + "/student/" + os.environ['S3_TEMP_STUDENT'] + "/fake_face.jpg"
    response =compare_faces(bucket,src_path,tar_path)
    if response :
        print("Result : True")
    else :
        print("Result : False")


if __name__ == "__main__":
    main()

