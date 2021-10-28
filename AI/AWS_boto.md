# AWS 연결하여 boto 사용하기

## boto ?
AWS 서비스를 파이썬에서 간편하게 활용할 수 있도록 제공해주는 SDK

#### 권한 부여 
Root 사용자로부터 IAM 사용자는 다음 권한을 받아야 한다. 

```
AmazonRekognitionFullAccess
AmazonS3FullAccess 
```


#### CLI 설치 및 CLI 계정 설정 

1.자신의 환경에 맞추어 설치한다.
[Click! AWS CLI 설치](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/install-cliv2.html)


<br />
2. cli가 설치되었는지 터미널에 명령어를 입력하여 확인한다.

`$ aws --version`
버전 정보가 뜬다면, aws cli가 정상적으로 설치된 것이다. 

<br />
3. aws configure를 설정한다.

`$ aws configure --profile {이름}`
  
IAM 사용자의 access key, secret key, region name을 입력한다. 

cf ) configure 확인하는 방법 
`$ aws configure list --profile {이름}`

<br />

##### 계정 스위칭하기 
(mac ver.)
1. ~/.zshrc에서 환경설정 변경 
```bash
$ vi ~/.zshrc
```
<br />

2. 다음 명령어 작성 
```bash
export AWS_DEFAULT_PROFILE={사용할 user }
```

<br />
3. 새로고침
```bash
$ source ~/.zshrc
```

#### 접근 가능한 S3 확인하기
AWS rekognition 수행 시 접근할 S3 bucket 정보가 뜬다면 AWS boto를 이용할 준비가 완료된 것이다 !  
`$ aws s3 ls`

<br />

#### boto3 설치 (requirements.txt를 설치하지 않은 경우, 꼭 boto3를 설치해야 한다. )
`$ pip install boto3`