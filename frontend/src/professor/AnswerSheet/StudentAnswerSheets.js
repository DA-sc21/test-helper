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
  const [loading, setLoading] = useState(false);
  const [allStudents, setAllstudents] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(()=>{
    console.log(props);
    getStudentList();
    // setAllstudents(props.students);
    // setStudents(props.students);
  },[]);

  function onChangehandler(e){
    let { name , value} = e.target;
    setState({
      ...state,
      [name]: value,
    });
    console.log(state);
  }

  async function getStudentList(){
    await axios
    .get(baseUrl+path+'/submissions?studentNumber=2',{ //학생 전체 조회
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      setAllstudents(result.data);
      setStudents(result.data);
      setLoading(true);
    })
    .catch(()=>{ console.log("실패") })
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

  async function sendScoringTest(){
    let response = await fetch(baseUrl+path+'/grade',{
      method: 'POST',
      credentials : 'include',
    })
    .then((res) => res.json())
    .then((res) => {
      if(res.result === true){
        alert("채점 결과가 전송되었습니다.");
      }
      else{
        alert(res.errorMessage);
      }
      console.log("response:", res);
    })
    .catch(error => {console.error('Error:', error)});
  }

  if(!loading)return(<Loading></Loading>)
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
      <Button style={{float:"left", backgroundColor:"#467fca", borderColor:"#467fca"}} onClick={(e)=>sendScoringTest(e)}>채점 결과 전송</Button>
      <div style={{marginTop:"6%", marginBottom:"0.2%", width:"90%", fontSize:"19px", textAlign:"left"}}>
        <span style={{marginLeft:"5.7%"}}>학번</span>
        <span style={{marginLeft:"6%"}}>이름</span>
        <span style={{marginRight:"0%", float:"right"}}>제출/채점 여부</span>
      </div>
      {students.map((data,idx)=>{
      return <StudentList key={idx} student={data.student} submitted={data.submitted} path={path}/>; })}
    </div>
  )
}

function StudentList(props){
  console.log(props)
  let history = useHistory();
  let path = props.path;
  let studentId = props.student.id;
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {setShow(true);}
  let scoring_status={
    "PENDING" : "미제출",
    "DONE" : "제출 완료",
    "MARKED" : "채점 완료",
  }
  let scoring_status_css={
    "PENDING" : "#b4b4b4",
    "DONE" : "#a7ce9d",
    "MARKED" : "#b096d3",
  }

  async function completeScoring(){
    let response = await fetch(baseUrl+path+'/students/'+studentId+'/submissions/marked',{
      method: 'POST',
      credentials : 'include',
    })
    .then((res) => res.json())
    .then((res) => {
      if(res.result === true){
        alert("채점이 완료되었습니다.");
        history.push(path+'/unscored');
        handleClose();
      }
      else{
        alert(res.errorMessage);
      }
      console.log("response:", res);
    })
    .catch(error => {console.error('Error:', error)});
  }

  return(
    <div>
      <Card className="studentListCard">
          <Card.Body>
            <button className="scoringBt" onClick={handleShow}>
            <span className="studentNumber">{props.student.studentNumber}</span> 
            <span className="studentName">{props.student.name}</span>
            {/* <Badge className="scoringStatus" bg={scoring_status_css[props.submitted]}>{scoring_status[props.submitted]}</Badge> */}
            <div className="scoringStatus" style={{backgroundColor: scoring_status_css[props.submitted]}}>{scoring_status[props.submitted]}</div>
            </button>
            <RecordView student={props.student} ></RecordView>
          </Card.Body>
        </Card>

        <Modal show={show} fullscreen={true} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>답안지 채점 <span style={{fontSize:"21px"}}>({props.student.studentNumber}/{props.student.name})</span></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ScoringTests path={path} studentId={props.student.id}></ScoringTests>
          </Modal.Body>
          <Modal.Footer>
            <Button style={{backgroundColor:"#333c50", borderColor:"333c50"}} onClick={(e)=>completeScoring(e)}>
              채점 완료
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
  )
}

function RecordView(props){
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return(
    <>
      <Button onClick={handleShow}>녹화영상확인</Button>
      <Modal show={show} fullscreen={true} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>녹화영상확인 <span style={{fontSize:"21px"}}>({props.student.studentNumber}/{props.student.name})</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div style={{backgroundColor:"#ffc0cb", textAlign:"center", padding:"4px",margin:"10px", borderRadius:"5px", fontWeight:"bold"}}>PC화면녹화본</div>
              <video controls className="w-100">
                <source src="/media/cc0-videos/flower.mp4"
                        type="video/mp4" />
                Sorry, your browser doesn't support embedded videos.
              </video>
            </div>
            <div className="col-md-6">
              <div style={{backgroundColor:"#59a5fc", textAlign:"center", padding:"4px", margin:"10px", borderRadius:"5px", fontWeight:"bold"}}>시험환경녹화본</div>
              <video controls className="w-100">
                <source src="/media/cc0-videos/flower.mp4"
                        type="video/mp4" />
                Sorry, your browser doesn't support embedded videos.
              </video>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{backgroundColor:"#333c50", borderColor:"333c50"}} onClick={handleClose}> 닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default StudentAnswerSheets;