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
  let [verification,setVerification]=useState(false)
  useEffect(()=>{
    getimages("student_card",setStudentCard);
    getimages("face",setface);
    getStudentSetting();
  },[]);
  
  async function getStudentSetting(){

    let response = await fetch(baseUrl+`/tests/`+testId+'/students/'+studentId+'/submissions/status',{
			method: 'GET',
			credentials : 'include',
		  })
      .then((res) => res.json())
		  .then((result) => {
        console.log("response:", result)
        setVerification(result.verified)
		  })
      .catch(error => {console.error('Error:', error)});
  }
 
  async function getimages(target,setImagepath){
    testId=String(testId).padStart(5,"0")
    
    await axios
      .get(baseUrl+'/s3-download-url?objectKey=test/'+testId+'/submission/'+studentNum+'/'+target+'.jpg',{withCredentials : true})
      .then((result)=>{
        setImagepath(result.data)
      })
      .catch(()=>{ console.log("실패") })
  
  }

  let verificationOption={
    "PENDING" : "보류",
    "REJECTED" : "거절",
    "SUCCESS" : "성공",
  }

  return(
    <div className="m-5 p-5"> 
      <div className="row">
          <img src={studentCard} style={{width:"18%", height:"28vh",marginLeft:"30%"}} alt="studentCard" />
          <img src={face} style={{width:"18%", height:"28vh",marginLeft:"5%"}} alt="face"/>
      </div>
      <div className="row m-5 d-flex justify-content-center">
        <div className="col-md-4">
          <Button className="" variant="dark" onClick={()=>{
            Identification(testId, studentId,setIdentificationResult,getStudentSetting)
          }} >본인인증신청</Button>
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="col-md-4" style={{backgroundColor:"#FFD8D8", fontSize:"17px", textAlign:"center", padding:"4px",margin:"10px", borderRadius:"5px", fontWeight:"bold"}}>
          학생증,본인얼굴 일치 여부는 "{verificationOption[verification]}" 입니다.
          {/* <Button className="col-md-2" variant="secondary" onClick={()=>{
            getStudentSetting()
          }} >본인인증 새로고침</Button> */}
        </div>
      </div>
    </div>
  )
}
async function Identification(testId,studentId,setIdentificationResult,getStudentSetting){
  let response = await fetch(baseUrl+'/tests/'+testId+'/students/'+studentId+'/verification',{
    method : 'POST',
    credentials : 'include',
  })
  .then((res)=>res.text())
    .then((result)=>{
      setIdentificationResult(result);
      getStudentSetting();
      console.log(result)
    })
    .catch(()=>{ console.log("실패") })
}


export default TestStudentIdentification