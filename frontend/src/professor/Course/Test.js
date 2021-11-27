import React, { useEffect, useState } from 'react';
import { Button, Modal, InputGroup, FormControl, Form , Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';
import './Test.css';

function Test(props){
  const courseName = props.courseName;
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [state, setState] = useState([]);
  const [testList, setTestList] = useState([]);
  const [midterm, setMidterm] = useState([]);
  const [final, setFinal] = useState([]);
  const [quiz, setQuiz] = useState([]); 
  let test_status_options={
    "CREATE" : "시험 생성 완료",
    "IN_PROGRESS" : "시험 진행중",
    "ENDED" : "시험 종료",
    "MARK" : "시험 채점중",
    "GRADED" : "점수 전송 완료",
  }

  useEffect(()=>{
    console.log(props)
    getTest();
  },[])
  function onChangehandler(e){
    let { name , value} = e.target;
    setState({
      ...state,
      [name]: value,
    });
    console.log(state);
  }
  async function getTest(){
    await axios
    .get(baseUrl+'/tests',{
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      sortTest(result.data);   
    })
    .catch(()=>{ console.log("실패") })
  }
  function sortTest(data){
    console.log(data)
    let mid = [];
    let final = [];
    let quiz = [];
    for(let i=0; i<data.length; i++){
      if(data[i].name === courseName){
        if(data[i].test_type === "MID"){
          mid.push(data[i]);
        }
        else if(data[i].test_type === "FINAL"){
          final.push(data[i]);
        }
        else{
          quiz.push(data[i]);
        }
      }
    }
    console.log(mid,final,quiz);
    setMidterm(mid);
    setFinal(final)
    setQuiz(quiz);
    setLoading(true);
  }
  async function submitForm(e){
    
  }
  if(!loading)return(<Loading></Loading>)
  return(
    <div style={{marginLeft:"7%", marginTop:"2%", width:"70%"}}>
      <Button variant="secondary" style={{float:"right", marginRight:"15%"}} onClick={handleShow}>시험 생성</Button>
      <h4 style={{marginBottom:"3%", textAlign:"left"}}>시험 정보</h4>
      <div style={{width:"85%", height:"75vh", borderRadius:"10px", overflow: "auto", textAlign:"center"}}>
        <div style={{textAlign:"left", marginLeft:"2%", fontSize:"19px"}}>중간고사</div>
        {midterm.length !=0 ? midterm.map((data,idx)=>(
          <Card key={idx} className="testCard">
            <Card.Body>
              <div className="testName">
                {data.name} 중간고사
              </div>
            </Card.Body>
          </Card>
        )):
        <Card className="noTestCard">
          <Card.Body>
            <div className="noTest">
              시험이 존재하지 않습니다
            </div>
          </Card.Body>
        </Card>}
        <div style={{textAlign:"left", marginLeft:"2%", fontSize:"19px"}}>기말고사</div>
        {final.length != 0 ? final.map((data,idx)=>(
          <Card key={idx} className="testCard">
            <Card.Body>
              <div className="testName">
                {data.name} 기말고사
              </div>
            </Card.Body>
          </Card>
        )):
        <Card className="noTestCard">
          <Card.Body>
            <div className="noTest">
              시험이 존재하지 않습니다
            </div>
          </Card.Body>
        </Card>}
        <div style={{textAlign:"left", marginLeft:"2%", fontSize:"19px"}}>퀴즈</div>
        {quiz.length !=0 ? quiz.map((data,idx)=>(
          <Card key={idx} className="testCard">
            <Card.Body>
              <div className="testName">
                {data.name} 퀴즈{idx+1}
              </div>
            </Card.Body>
          </Card>
        )):
        <Card className="noTestCard">
          <Card.Body>
            <div className="noTest">
              시험이 존재하지 않습니다
            </div>
          </Card.Body>
        </Card>}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>시험 생성</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{height:"380px"}}>
            시험 생성
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={(e)=>submitForm(e)}>
            등록
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Test;