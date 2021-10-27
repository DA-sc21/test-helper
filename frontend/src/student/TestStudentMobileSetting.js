import React ,{useState} from 'react';
import html2canvas from "html2canvas";
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';

function TestStudentMobileSetting(){
  let {testId, studentId} =useParams();
  let [studentCard,setStudentCard]= useState("");
  
  return(
    <div className="m-5 p-5"> 
      <h4 >모바일 세팅페이지입니다.</h4>
      {/* <div>{studentCard}</div> */}
      <div className="row">
        <Button className="col-md-4" variant="primary" onClick={()=>screenCapture(setStudentCard)}>얼굴사진등록</Button>
        <div className="col-md-4"/>
        <Button className="col-md-4" variant="info" onClick={()=>UploadImageToS3(testId,studentId,studentCard)}>AWS업로드</Button>
        <div className="capture col-md-1">캡쳐할사진</div>
        <img src={studentCard} className="col-md-1"></img>
      </div>
    </div>
  )
}
function screenCapture(setStudentCard){
  html2canvas(document.querySelector(".capture")).then(canvas => {
    setStudentCard(canvas.toDataURL())
  });
}
async function UploadImageToS3(testId,studentId,studentCard){
  let preSignedUrl="";
  await axios
    .get('/s3-upload-url?objectKey=test/'+testId+'/submission/'+studentId+'/sin.jpg')
    .then((result)=>{
      console.log(studentCard)
      console.log(result.data)
      preSignedUrl=result.data;
      console.log(preSignedUrl)
      
    })
    .catch(()=>{ console.log("실패") })

  await axios
    .put(preSignedUrl ,studentCard)
    .then((result)=>{
      console.log(studentCard)
      console.log(result.data)
    })
    .catch(()=>{ console.log("실패") })

  
}

export default TestStudentMobileSetting