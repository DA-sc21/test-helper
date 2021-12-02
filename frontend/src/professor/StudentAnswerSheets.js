import React, { useEffect, useState } from 'react';
import { Button, Card, Badge } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {baseUrl} from "../component/baseUrl";
import Loading from '../component/Loading';
import './StudentAnswerSheets.css';

function StudentAnswerSheets(props){
  let history = useHistory();
  let path = props.path;
  const [students, setStudents] = useState([]);
  let scoring_status={
    "PENDING" : "미채점",
    "MARKED" : "채점중",
    "DONE" : "채점 완료",
  }
  let scoring_status_css={
    "PENDING" : "secondary",
    "MARKED" : "success",
    "DONE" : "primary",
  }

  useEffect(()=>{
    console.log(props);
    setStudents(props.students);
  },[]);

  return(
    <div style={{marginLeft:"7%", marginTop:"2%", width:"70%"}}>
      <div style={{marginTop:"3%", marginBottom:"0.2%", width:"90%", fontSize:"19px", textAlign:"left"}}>
        <span style={{marginLeft:"5%"}}>학번</span>
        <span style={{marginLeft:"6%"}}>이름</span>
        <span style={{marginRight:"1.7%", float:"right"}}>채점 여부</span>
      </div>
      {students.map((data,idx)=>(
        <Card className="studentListCard">
          <Card.Body>
            <span className="studentNumber">{data.student.studentNumber}</span> 
            <span className="studentName">{data.student.name}</span>
            <Badge className="scoringStatus" bg={scoring_status_css[data.submitted]}>{scoring_status[data.submitted]}</Badge>
          </Card.Body>
        </Card>
      ))}
    </div>
  )
}

export default StudentAnswerSheets;