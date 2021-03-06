import React ,{useState} from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { BrowserView,MobileView } from 'react-device-detect';
import Viewer from '../kinesisVideo/Viewer';
import {baseUrl} from "../component/baseUrl"
import { useInterval } from 'react-use';
import moment from 'moment';
import 'moment/locale/ko';

function TestStudentMobileSetting(props){
  moment.locale('ko')

  let {testId, studentId} =useParams();
  let [studentCard,setStudentCard]= useState("");
  let [face,setFace]= useState("");

  let credentials=props.credentials;
  let room=props.room;
  let studentNum=props.student.studentNumber;
  let video=props.video;
  let audio=props.audio;
  let id=props.room.device+props.student.id;
  let [capture_1,setCapture_1]= useState("");
  let [ended,setEnded]=useState(false)
  let [submitted,setSubmitted]=useState(false)
  let startTime=props.test.startTime;
  let endTime=props.test.endTime;
  const [isTestEnded, setIsTestEnded] = useState(false);


  useInterval(() => {
    let currentTime = moment();
    // let testStartTime = moment("2021 10 31 18:07");//테스트용
    let testStartTime = moment(props.test.startTime);
    // let testEndTime = moment("2021 11 16 23:11");//테스트용
    let testEndTime = moment(props.test.endTime);
    let durationEndTime = moment.duration(testEndTime.diff(currentTime));
    durationEndTime < 0 ? setEnded(true) :setEnded(false) 
  }, 1000);

  const data={
    "submitted": "DONE"
  }
  async function putSubmitted(){
    setIsTestEnded(true);
    let response = await fetch(baseUrl+ "/tests/"+testId+'/students/'+studentId+'/submissions/submitted',{
      method:"PUT",
      credentials : 'include',
      body: JSON.stringify(data),
      headers:{
        "content-type" :"application/json"
      }
    })
    .then((res)=>{
      if(res.status === 200){
        setSubmitted(true);
      }
    })
    .catch(()=>{ console.log("실패") })
  }

  return(
    <div className="m-4"> 
      <BrowserView>
      <div className="p-5"> 
        <Card className="mt-0 m-5">
          <Card.Body>
            <h5>안내사항</h5>
            <hr></hr>
            <Card.Text style={{textAlign:"left", marginLeft:"5%"}}>
              <h4 className="mb-3">
                1. 모바일 기기에서 시험 링크에 접속해주세요.
              </h4>
              <h4 className="mb-3">
                2. 모바일 기기에서 본인인증을 위한 학생증 사진과 얼굴 사진을 등록해주세요.
                <br />
              </h4>
              <h4 className="mb-3">
                3. 모바일 기기를 두 손을 비출 수 있도록 각도 조정해주세요. 
                <br />
              </h4>
              <h4 className="mb-3">
                4. PC의 본인인증 페이지로 이동해주세요.
              </h4>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      </BrowserView>
      <MobileView>
        { submitted?
          <div style={{marginTop: '20%', marginLeft:'3%', marginRight: '3%'}}>
            <p style={{marginBottom: '1%', fontSize: '20px', fontWeight: 'bold'}}>수고하셨습니다.</p>
            <p style={{marginBottom: '20%', fontSize: '20px', fontWeight: 'bold'}}>시험이 종료되었습니다.</p>
          </div>
          :
        <div>
        <Viewer 
          testId ={testId}
          studentId={studentId}
          startTime={startTime}
          endTime={endTime}
          sendVideo={video}
          sendAudio={audio}
          region= "us-east-2" 
          accessKey= {credentials.accessKeyId} 
          secretAccessKey= {credentials.secretAccessKey}  
          channelName = {room.id}
          clientId = {id} 
          sessionToken = {credentials.sessionToken} 
          isEnded = {isTestEnded}/>
        <div className="container">
          {!ended?
          <div className="row">
          {/* <Button 
            className="col-5" 
            variant="primary" 
            onClick =
              {(e) => capture(e,testId,studentNum,setStudentCard,"student_card")
              }>학생증사진등록
          </Button> */}
          <h5 className="mb-5" >아래의 버튼을 클릭하면 학생증과 본인얼굴이 캡쳐됩니다.</h5>
         
          <Button 
            className="col-5" 
            variant="primary" 
            onClick =
              {(e) => {
               
                let camera=document.querySelector("#camera")
                let frame=document.querySelector("#frame")
                camera.addEventListener("change",function(e){
                  let file=e.target.files[0];
                  UploadImageToS3(testId,studentNum,file,"student_card")
                  frame.src=URL.createObjectURL(file)})
                camera.click();
                }
                
              }>학생증 등록
          </Button>
          <div className="col-2">
            <input type="file" accept="image/*" capture="camera" id="camera" className="d-none" />
          </div>
          {/* <div className="col-2"></div> */}
          <Button 
            className="col-5" 
            variant="danger" 
            onClick =
              {(e) => capture(e,testId,studentNum,setFace,"face")
              }>얼굴사진등록
          </Button>
        </div>
        :
        <div className="row">
          <h4 className="mb-5">답안지 사진이 제대로 인식되지 않으면 채점에 불이익이 있을 수 있습니다.</h4>
          <Button 
            className="col-5" 
            variant="warning" 
            onClick =
              {(e) => capture(e,testId,studentNum,setCapture_1,"capture_1")
              }>답안지전면캡쳐
          </Button>
          <div className="col-2">
            <input type="file" accept="image/*" capture="camera" id="camera" className="d-none" />
          </div>
          <Button 
            className="col-5" 
            variant="success" 
            onClick =
              {(e) => {
               
                let camera=document.querySelector("#camera")
                let frame=document.querySelector("#frame")
                camera.addEventListener("change",function(e){
                  let file=e.target.files[0];
                  UploadImageToS3(testId,studentNum,file,"answer_1")
                  frame.src=URL.createObjectURL(file)})
                camera.click();
                }
                
              }>답안지후면카메라사진
          </Button>

          
          
        </div>
        }
          
        </div>
        {!ended?
        <div className="row mt-5">
          <div>사진 재등록을 원하신다면 버튼을 다시 누르시면 됩니다.</div>
          {/* <img src={studentCard} className="image col-5" alt="studentCard"></img> */}
          <img id="frame" className=" col-5" alt="camera"></img>
          <div className="col-2"></div>
          <img src={face} className=" col-5" alt="face"></img>
        </div>
        :
         <div className="row mt-5">
          <div>사진 재등록을 원하신다면 버튼을 다시 누르시면 됩니다.</div>
          <img src={capture_1} className=" col-5" alt="capture_1"></img>
          <div className="col-2"></div>
          <img id="frame" className=" col-5" alt="camera"></img>
        </div>
        }
        {!ended?
        null
        :
        <Button 
            className="col-5 mt-2" 
            variant="danger" 
            onClick =
              {(e) => {
                putSubmitted()
                }
                
              }>제출완료
          </Button>
        }
        </div>
      }
      </MobileView>
    </div>
  )
}
function capture(e,testId,studentId,setTarget,target){ //학생증&본인얼굴 사진 캡쳐

  navigator.mediaDevices.getUserMedia({ video: true })
  .then(mediaStream => {
      const track = mediaStream.getVideoTracks()[0];
      let imageCapture = new ImageCapture(track);
      const photoSettings = {
        imageHeight : 480,
        imageWidth : 640,
      }
      imageCapture.takePhoto(photoSettings)
      .then(blob => {console.log(blob); 
        //blob = 캡쳐 이미지
        setTarget(URL.createObjectURL(blob))
        console.log("이미지 캡쳐 완료")
        UploadImageToS3(testId,studentId,blob,target)
      })
      .catch(error => console.log(error));
  })
}

async function UploadImageToS3(testId,studentId,img,target){

  let preSignedUrl="";
  testId=String(testId).padStart(5,"0")

  let response = await fetch(baseUrl+'/s3-upload-url?objectKey=test/'+testId+'/submission/'+studentId+'/'+target+'.jpg',{
    method: "GET",
    credentials: "include"
  })
  .then(res => res.text())
  .then((res)=>{
    preSignedUrl=res;
    console.log(res)
    // console.log(preSignedUrl);
  })
  .catch((error)=> {console.log(error)})

  // await axios
  //   .get(baseUrl+'/s3-upload-url?objectKey=test/'+testId+'/submission/'+studentId+'/'+target+'.jpg')
  //   .then((result)=>{
  //     preSignedUrl=result.data;
  //   })
  //   .catch(()=>{ console.log("실패") })
    // console.log("presigned-url is",preSignedUrl)
   console.log(preSignedUrl);

  
  await axios
    .put(preSignedUrl,img)
    .then((result)=>{
      console.log("put성공")
    })
    .catch(()=>{ console.log("실패") })
  
}

export default TestStudentMobileSetting