import React ,{useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import {baseUrl} from "../component/baseUrl"

function TestStudentIdentification(props){
  let {testId, studentId} =useParams();
  let [studentCard,setStudentCard]= useState("");
  let [face,setface]= useState("");
  let [identificationResult, setIdentificationResult]=useState("");
  let studentNum=props.student.studentNumber
  
  useEffect(()=>{
    getimages("student_card",setStudentCard);
    getimages("face",setface);
  },[]);
  
  async function getimages(target,setImagepath){
    testId=String(testId).padStart(5,"0")
    
    await axios
      .get(baseUrl+'/s3-download-url?objectKey=test/'+testId+'/submission/'+studentNum+'/'+target+'.jpg',{withCredentials : true})
      .then((result)=>{
        setImagepath(result.data)
      })
      .catch(()=>{ console.log("실패") })
  
  }
  return(
    <div className="m-5 p-5"> 
      <div className="row">
          <img src={studentCard} style={{width:"18%", height:"28vh",marginLeft:"30%"}} alt="studentCard" />
          <img src={face} style={{width:"18%", height:"28vh",marginLeft:"5%"}} alt="face"/>
      </div>
      <div className="row m-5">
        <Button className="" variant="info" onClick={()=>{
          Identification(testId, studentId,setIdentificationResult)
        }} >본인인증신청</Button>
      </div>
      <div className="row">
        <h3>
          학생증,본인얼굴 일치 여부 : {identificationResult}
        </h3>
      </div>
    </div>
  )
}
async function Identification(testId,studentId,setIdentificationResult){
  let response = await fetch(baseUrl+'/tests/'+testId+'/students/'+studentId+'/verification',{
    method : 'POST',
    credentials : 'include',
  })
  .then((res)=>res.text())
    .then((result)=>{
      setIdentificationResult(result);
      console.log(result)
    })
    .catch(()=>{ console.log("실패") })
}


export default TestStudentIdentification