import boto3
import json
import sys


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
    except :
        sys.stderr.write("AWS 에 접근 시 오류가 발생하였습니다! \n")
        return False
        
    return answer
    
def main():
    import sys
    sys.path.extend(['../','../../'])
    import s3path    
    bucket= s3path.S3_BUCKET
    src_path = s3path.S3_ROOT + s3path.S3_TEMP_TEST_ID + s3path.S3_STUDENT_FOLDER+ s3path.S3_TEMP_STUDENT_NUM + s3path.S3_STUDENT_CARD
    tar_path = s3path.S3_ROOT + s3path.S3_TEMP_TEST_ID  + s3path.S3_STUDENT_FOLDER + s3path.S3_TEMP_STUDENT_NUM + s3path.S3_FACE
   
    response =compare_faces(bucket,src_path,tar_path)
    if response :
        print("Result : True")
    else :
        print("Result : False")


if __name__ == "__main__":
    main()

