import React ,{useEffect, useState} from 'react';
import SetViewer from "../kinesisVideo/SetViewer"
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';


function TestStudentIdentification(props){
  let baseUrl ="http://api.testhelper.com"
  let {testId, studentId} =useParams();
  let [studentCard,setStudentCard]= useState("");
  let [face,setface]= useState("");
  let [identificationResult, setIdentificationResult]=useState("false");

  useEffect(()=>{
    getimages();
  },[]);

  async function getimages(){
    await axios
      .get(baseUrl+'/s3-download-url?objectKey=test/00002/submission/201820742/student_card.jpg')
      .then((result)=>{
        setStudentCard(result.data)
        
      })
      .catch(()=>{ console.log("실패") })
    await axios
    .get(baseUrl+'/s3-download-url?objectKey=test/00002/submission/201820742/face.jpg')
    .then((result)=>{
      setface(result.data)
      
    })
    .catch(()=>{ console.log("실패") })
  
  
  }
  return(
    <div className="m-5 p-5"> 
      <div className="row">
        <div className="col-md-3">
          <img src={studentCard} style={{ width: 100}}/>
        </div>
        <div className="col-md-3">
          <img src={face} style={{ width: 100}}/>
        </div>
      </div>
      <div className="row">
        <Button className="col-md-6" variant="info" onClick={()=>{
          postIdentification(testId, studentId,setIdentificationResult)
        }} >본인인증신청</Button>
      </div>
      <div className="row">
        본인인증 여부:{identificationResult}
      </div>
    </div>
  )
}
async function postIdentification(testId,studentId,setIdentificationResult){
  let baseUrl ="http://api.testhelper.com"
  testId="00002"
  studentId="201820742"
  await axios
    .post(baseUrl+'/tests/'+testId+'/students/'+studentId+'/verification')
    .then((result)=>{
      setIdentificationResult(result.data);
      console.log(result.data)
    })
    .catch(()=>{ console.log("실패") })
}


export default TestStudentIdentification