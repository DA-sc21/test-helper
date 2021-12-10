import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Button, Col, Form, Modal, Row ,Card } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import { baseUrl } from '../component/baseUrl';

function CreateProblems(){
  const { testId } = useParams();
  let [problems,setProblems] = useState([]);
  
  useEffect(()=>{
    getProblems();
  },[]);
  
  async function getProblems(){
    await axios
    .get(baseUrl+'/tests/'+testId+'/problems',{
      withCredentials : true
    })
    .then((result)=>{ 
      setProblems(result.data)
      console.log(result.data)
    })
    .catch(()=>{ console.log("실패") })
  }
  

  async function createProblems(point,problemNum,question){

    const data = {
      "attachedFile": "",
      "point": point,
      "problemNum": problemNum,
      "question": question
    };

    console.log(point,problemNum,question)
      let response = await fetch(baseUrl+`/tests/`+testId+`/problems`,{
      method: 'POST',
      credentials : 'include',
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    })
    .then( res => {
      console.log("response:", res);
      getProblems();
      if(res.status === 200){
          alert("문제가 생성되었습니다.");
      }
      else if(res.status === 400){
        alert("문제 번호가 이미 존재합니다.");
      }
      else{
        alert("문제 생성에 실패했습니다.");
      }
      }
    )
    .catch(error => {console.error('Error:', error)});

  }

  async function updateProblems(point,problemNum,question){

    const data = {
      "attachedFile": "",
      "point": point,
      "problemNum": problemNum,
      "question": question
    };

    console.log(point,problemNum,question)
      let response = await fetch(baseUrl+`/tests/`+testId+`/problems`,{
      method: 'PUT',
      credentials : 'include',
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    })
    .then( res => {
      console.log("response:", res);
      getProblems();
      if(res.status === 200){
        alert("문제가 수정되었습니다.");
      }
      else{
        alert("문제 수정에 실패했습니다.");
      }
      }
    )
    .catch(error => {console.error('Error:', error)});

  }

  return(
    <div className="container"> 
      <div className="m-3">
        <ProblemModal createProblems={createProblems}></ProblemModal>
      </div>
      <div className="row">
        {problems.map((problem,index)=>{
          return (
            <div key={index} className="col-md-6">
              <Card className="mb-3" >
                <Card.Img variant="top" src="" />
                <Card.Header>
                  <Card.Title>문제 {problem.problemNum} ({problem.point}점)</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Card.Text>
                  {problem.question}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <ProblemUpdateModal updateProblems={updateProblems} problemNum={problem.problemNum} point={problem.point} question={problem.question}></ProblemUpdateModal>
                  <Button variant="danger">문제 삭제</Button>
                </Card.Footer>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ProblemModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        문제생성
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>문제 생성</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
              <Form.Group className="mb-3" controlId="problemNum">
                <Form.Label>문제 번호</Form.Label>
                <Form.Control type="number" placeholder="1" />
              </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-3" controlId="point">
                <Form.Label>문제 배점</Form.Label>
                <Form.Control type="number" placeholder="10" />
              </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="question">
              <Form.Label>문제 내용</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="문제 내용을 입력하세요." />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
          <Button variant="success" onClick={()=>{
            let point=document.querySelector("#point").value
            let problemNum=document.querySelector("#problemNum").value
            let question=document.querySelector("#question").value
            if (problemNum===""){
              alert("문제 번호를 입력해주세요.")
            }
            else  if (point==="" ){
              alert("문제 배점을 입력해주세요.")
            }
            else if ( question===""){
              alert("문제 내용을 입력해주세요.")
            }
            else{
              props.createProblems(point,problemNum,question)
            }
          }}>저장</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function ProblemUpdateModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="secondary" className="m-2" onClick={handleShow}>
        문제 수정
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>문제수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
              <Form.Group className="mb-3" controlId="problemNum">
                <Form.Label>문제 번호</Form.Label>
                <Form.Control disabled type="number" defaultValue={props.problemNum} />
              </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-3" controlId="point">
                <Form.Label>문제 배점</Form.Label>
                <Form.Control type="number" defaultValue={props.point} />
              </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="question">
              <Form.Label>문제내용</Form.Label>
              <Form.Control as="textarea" rows={3} defaultValue={props.question} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
          <Button variant="success" onClick={()=>{
            let point=document.querySelector("#point").value
            let problemNum=document.querySelector("#problemNum").value
            let question=document.querySelector("#question").value
            if (problemNum===""){
              alert("문제 번호를 입력해주세요.")
            }
            else  if (point==="" ){
              alert("문제 배점을 입력해주세요.")
            }
            else if ( question===""){
              alert("문제 내용을 입력해주세요.")
            }
            else{
              props.updateProblems(point,problemNum,question)
            }
          }}>저장</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateProblems