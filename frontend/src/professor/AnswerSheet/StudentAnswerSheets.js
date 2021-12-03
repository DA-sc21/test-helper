import React, { useEffect, useState } from 'react';
import { Button, Card, Badge, InputGroup, FormControl, Modal, Spinner } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';
import ScoringTests from './ScoringTests';
import './StudentAnswerSheets.css';


function StudentAnswerSheets(props){
  let history = useHistory();
  let path = props.path;
  const [state, setState] = useState([]);
  const [allStudents, setAllstudents] = useState([]);
  const [students, setStudents] = useState([]);

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
        <span style={{marginLeft:"5.7%"}}>학번</span>
        <span style={{marginLeft:"6%"}}>이름</span>
        <span style={{marginRight:"2.5%", float:"right"}}>채점 여부</span>
      </div>
      {students.map((data,idx)=>{
      return <StudentList key={idx} student={data.student} submitted={data.submitted} path={path}/>; })}
    </div>
  )
}

function StudentList(props){
  console.log(props)
  let path = props.path;
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {setShow(true);getAnswerSheet();}
  const [imageUrl, setImageUrl] = useState("");
  const [submissionId, setSubmissionId] = useState("");
  let scoring_status={
    "PENDING" : "제출 전",
    "MARKED" : "제출 완료",
    "DONE" : "채점 완료",
  }
  let scoring_status_css={
    "PENDING" : "secondary",
    "MARKED" : "success",
    "DONE" : "primary",
  }
  async function getAnswerSheet(){
    await axios
    .get(baseUrl+path+`/students/${props.student.id}/submissions?includeCapture=false`,{ //학생 전체 조회
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      setSubmissionId(result.data.id);
      setImageUrl(result.data.answerSheetDownloadUrl);
      setLoading(true);
    })
    .catch(()=>{ console.log("실패") })
  }

  return(
    <div>
      <Card className="studentListCard">
          <Card.Body>
            <button className="scoringBt" onClick={handleShow}>
            <span className="studentNumber">{props.student.studentNumber}</span> 
            <span className="studentName">{props.student.name}</span>
            <Badge className="scoringStatus" bg={scoring_status_css[props.submitted]}>{scoring_status[props.submitted]}</Badge>
            </button>
          </Card.Body>
        </Card>

        <Modal show={show} fullscreen={true} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>답안지 채점 <span style={{fontSize:"21px"}}>({props.student.studentNumber}-{props.student.name})</span></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading?
            <ScoringTests path={path} answerSheetUrl={imageUrl} submissionId={submissionId}></ScoringTests>
            :
            <div style={{textAlign:"center"}}>
              <h3 style={{paddingTop:"5%", marginBottom:"2%"}}>정보를 불러오는 중입니다.</h3>
              <Spinner style={{width:"40px", height:"40px"}} animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              채점 완료
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
  )
}

export default StudentAnswerSheets;