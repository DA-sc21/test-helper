import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap'
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
    let attachedFile=""
    console.log(point,problemNum,question)
    let response = await fetch(baseUrl+`/tests/`+testId+`problems?attachedFile=${attachedFile}&point=${point}&problemNum=${problemNum}&question=${question}`,{
      method: 'POST',
      credentials : 'include',
    })
    .then( res => {
      console.log("response:", res);
      getProblems();
      if(res.status === 200){
          alert("문제가 생성되었습니다.");
        }
        else{
          alert("문제 생성에 실패했습니다.");
        }
      }
    )
    .catch(error => {console.error('Error:', error)});

  }

  return(
    <div className="row"> 
      <div className="col-md-1"></div>
      <div className="col-md-9  mt-5">
        <Table responsive="md">
          <thead >
            <tr className="row">
              <th className="col-md-2">문제번호</th>
              <th className="col-md-2">문제배점</th>
              <th className="col-md-8"> 문제내용</th>
            </tr>
          </thead>
          <tbody >
            {problems.map((problem,index)=>{
              return (
                <tr className="row">
                  <td className="col-md-2">{problem.problemNum}</td>
                  <td className="col-md-2">{problem.point}</td>
                  <td className="col-md-8">{problem.question}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
      <div className="col-md-1 mt-3">
        <ProblemModal createProblems={createProblems}></ProblemModal>
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
          <Modal.Title>문제생성</Modal.Title>
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
              <Form.Label>문제내용</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            저장
          </Button>
          <Button className="col-md-4" variant="success" onClick={()=>{
            let point=document.querySelector("#point").value
            let problemNum=document.querySelector("#problemNum").value
            let question=document.querySelector("#question").value
            props.createProblems(point,problemNum,question)
          }}>문제생성</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateProblems