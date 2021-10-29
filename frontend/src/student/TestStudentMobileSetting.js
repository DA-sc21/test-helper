import React ,{useState} from 'react';
import html2canvas from "html2canvas";
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';

function TestStudentMobileSetting(){
  let {testId, studentId} =useParams();
  let [studentCard,setStudentCard]= useState("");
  
  return(
    <div className="capture m-5 p-5"> 
      <h4 >모바일 세팅페이지입니다.</h4>
      <div className="row">
        <Button className="col-md-4" variant="primary" onClick={()=>screenCapture(setStudentCard)}>얼굴사진등록</Button>
        <Button className="col-md-4" variant="info" onClick={()=>UploadImageToS3(testId,studentId,studentCard,setStudentCard)}>AWS업로드</Button>
        <Button className="col-md-4" variant="success" onClick={()=>DownloadImageFromS3(testId,studentId,studentCard,setStudentCard)}>AWS다운로드</Button>
        </div>
      <div className="row m-5 p-5">
        <img src={studentCard} className="image col-md-12"></img>
      </div>
    </div>
  )
}
function screenCapture(setStudentCard){
  html2canvas(document.querySelector(".capture")).then(canvas => {
    setStudentCard(canvas.toDataURL('image/jpg'))
  });
}
async function UploadImageToS3(testId,studentId,studentCard,setStudentCard){
  let preSignedUrl="";
  let baseUrl ="http://api.testhelper.com"
  console.log(Buffer.from(studentCard).toString());
  
  await axios
    .get(baseUrl+'/s3-upload-url?objectKey=test/'+testId+'/submission/'+studentId+'/student_card.jpg')
    .then((result)=>{
      preSignedUrl=result.data;
    })
    .catch(()=>{ console.log("실패") })
    console.log("presigned-url is",preSignedUrl)
  
    function dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
      else
          byteString = unescape(dataURI.split(',')[1]);
      // 마임타입 추출
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], {type:mimeString});
  }
  await axios
    .put(preSignedUrl, dataURItoBlob(studentCard),
      {
        onUploadProgress: progressEvent => console.log('file progress', progressEvent.loaded),
        headers: { 'Content-Type': 'image/jpg' }
      }
    )
    .then((result)=>{
      console.log("put성공")
      console.log(result.data)
      // setStudentCard(studentCard)
    })
    .catch(()=>{ console.log("실패") })
  
}

async function DownloadImageFromS3(testId,studentId,studentCard,setstudentCard){
  let baseUrl ="http://api.testhelper.com"
  await axios
    .get(baseUrl+'/s3-download-url?objectKey=test/'+testId+'/submission/'+studentId+'/student_card.jpg')
    .then((result)=>{
      console.log(result.data)
      // setstudentCard(result.data);
    })
    .catch(()=>{ console.log("실패") })
}

export default TestStudentMobileSetting