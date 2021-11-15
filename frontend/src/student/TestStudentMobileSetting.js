import React ,{useState} from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { BrowserView,MobileView } from 'react-device-detect';
import Viewer from '../kinesisVideo/Viewer';
import {baseUrl} from "../component/baseUrl"

function TestStudentMobileSetting(props){
  let {testId, studentId} =useParams();
  let [studentCard,setStudentCard]= useState("");
  let [face,setFace]= useState("");
  let credentials=props.credentials
  let room=props.room
  let studentNum=props.student.studentNumber
  let video=props.video
  let audio=props.audio
  let id=props.room.device+props.student.id
  console.log(props)
  return(
    <div className="m-4"> 
      <BrowserView>
        <h4 >모바일 기기에서 세팅 완료 후 본인인증 페이지로 넘어가시면 됩니다.
        </h4>
      </BrowserView>
      <MobileView>
        <h5>아래의 버튼을 클릭하면 학생증과 본인얼굴이 캡쳐됩니다.</h5>
        <Viewer 
          testId ={testId}
          studentId={studentId}
          sendVideo={video}
          sendAudio={audio}
          region= "us-east-2" 
          accessKey= {credentials.accessKeyId} 
          secretAccessKey= {credentials.secretAccessKey}  
          channelName = {room.id}
          clientId = {id} 
          sessionToken = {credentials.sessionToken} />
        <div className="container">
          <div className="row">
            <Button 
              className="col-5" 
              variant="primary" 
              onClick =
                {(e) => capture(e,testId,studentNum,setStudentCard,"student_card")
                }>학생증사진등록
            </Button>
            <div className="col-2"></div>
            <Button 
              className="col-5" 
              variant="danger" 
              onClick =
                {(e) => capture(e,testId,studentNum,setFace,"face")
                }>얼굴사진등록
            </Button>
          </div>
        </div>
        <div className="row mt-5">
          <div>사진 재등록을 원하신다면 버튼을 다시 누르시면 됩니다.</div>
          <img src={studentCard} className="image col-5" alt="studentCard"></img>
          <div className="col-2"></div>
          <img src={face} className="image col-5" alt="face"></img>
        </div>
      </MobileView>
    </div>
  )
}
function capture(e,testId,studentId,setTarget,target){ //학생증&본인얼굴 사진 캡쳐

  navigator.mediaDevices.getUserMedia({ video: true })
  .then(mediaStream => {
      const track = mediaStream.getVideoTracks()[0];
      let imageCapture = new ImageCapture(track);
     
      imageCapture.takePhoto()
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

  await axios
    .get(baseUrl+'/s3-upload-url?objectKey=test/'+testId+'/submission/'+studentId+'/'+target+'.jpg')
    .then((result)=>{
      preSignedUrl=result.data;
    })
    .catch(()=>{ console.log("실패") })
    // console.log("presigned-url is",preSignedUrl)
   
  await axios
    .put(preSignedUrl,img)
    .then((result)=>{
      console.log("put성공")
    })
    .catch(()=>{ console.log("실패") })
  
}

export default TestStudentMobileSetting