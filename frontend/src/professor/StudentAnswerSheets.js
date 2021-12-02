import React, { useEffect, useState } from 'react';
import { Button, Card, Badge, InputGroup, FormControl } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {baseUrl} from "../component/baseUrl";
import Loading from '../component/Loading';
import './StudentAnswerSheets.css';

function StudentAnswerSheets(props){
  let history = useHistory();
  let path = props.path;
  const [state, setState] = useState([]);
  const [allStudents, setAllstudents] = useState([]);
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
    setAllstudents(props.students);
    setStudents(props.students);
  },[]);

  function onChangehandler(e){
    let { name , value} = e.target;
    setState({
      ...state,
      [name]: value,
    });
    console.log(state);
  }

  let searchStudentNumber = (e) => {
    if(state.studentNumber.length>0){
      const filterList = allStudents.filter((data) => {
        return data.student.studentNumber.toLowerCase().includes(state.studentNumber);
      });
      console.log(filterList);
      setStudents(filterList);
    }
    else{
      setStudents(allStudents);
    }
  }

  function checkAllStudentList(){
    setStudents(allStudents);
  }

  return(
    <div style={{marginLeft:"7%", marginTop:"1%", width:"70%"}}>
      <Button variant="light" style={{marginRight:"10%", float:"right", color:"black", borderColor:"gray"}} onClick={(e)=>searchStudentNumber(e)}>검색</Button>
      <InputGroup style={{width:"30%", float:"right"}}>
        <InputGroup.Text>학번</InputGroup.Text>
        <FormControl
          name="studentNumber" 
          onChange={(e)=>onChangehandler(e)}
        />
      </InputGroup>
      <Button style={{marginRight:"2.5%", float:"right", backgroundColor:"#3d4657", borderColor:"#3d4657"}} onClick={(e)=>checkAllStudentList(e)}>전체 목록</Button>
      <div style={{marginTop:"5%", marginBottom:"0.2%", width:"90%", fontSize:"19px", textAlign:"left"}}>
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