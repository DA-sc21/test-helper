import React ,{useState} from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
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


  useInterval(() => {
    let currentTime = moment();
    // let testStartTime = moment("2021 10 31 18:07");//테스트용
    let testStartTime = moment(props.test.startTime);
    // let testEndTime = moment("2021 11 16 23:11");//테스트용
    let testEndTime = moment(props.test.endTime);
    let durationEndTime = moment.duration(testEndTime.diff(currentTime));
    durationEndTime < 0 ? setEnded(true) :setEnded(false) 
  }, 1000);

  async function putSubmitted(){
    await axios
    .put(baseUrl+ "/tests/"+testId+'/students/'+studentId+'/submissions/submitted',{
      "submitted": "DONE"
    })
    .then((result)=>{ 
      console.log(result)
      setSubmitted(true)
    })
    .catch(()=>{ console.log("실패") })
  }

  return(
    <div className="m-4"> 
      <BrowserView>
        <h4 >모바일 기기에서 세팅 완료 후 본인인증 페이지로 넘어가시면 됩니다.
        </h4>
      </BrowserView>
      <MobileView>
        { submitted?
          <div style={{marginTop: '20%', marginLeft:'3%', marginRight: '3%'}}>
            <p style={{marginBottom: '1%', fontSize: '20px', fontWeight: 'bold'}}>수고하셨습니다.</p>
            <p style={{marginBottom: '20%', fontSize: '20px', fontWeight: 'bold'}}>시험이 종료되었습니다.</p>
          </div>
          :
        <div>
        <h5>아래의 버튼을 클릭하면 학생증과 본인얼굴이 캡쳐됩니다.</h5>
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
          sessionToken = {credentials.sessionToken} />
        <div className="container">
          {!ended?
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
        :
        <div className="row">
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
          <img src={studentCard} className="image col-5" alt="studentCard"></img>
          <div className="col-2"></div>
          <img src={face} className="image col-5" alt="face"></img>
        </div>
        :
         <div className="row mt-5">
          <div>사진 재등록을 원하신다면 버튼을 다시 누르시면 됩니다.</div>
          <img src={capture_1} className="image col-5" alt="capture_1"></img>
          <div className="col-2"></div>
          <img id="frame" className="image col-5" alt="camera"></img>
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