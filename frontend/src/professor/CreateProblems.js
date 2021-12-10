import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Button, Col, Form, Modal, Row ,Card, Tab, ListGroup } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router-dom';
import { baseUrl } from '../component/baseUrl';

function CreateProblems(){
  const { testId } = useParams();
  let [problems,setProblems] = useState([]);
  let history = useHistory()
  
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

  async function deleteProblems(problemNum){

    let response = await fetch(baseUrl+`/tests/`+testId+`/problems/`+problemNum,{
      method: 'DELETE',
      credentials : 'include',
    })
    .then( res => {
      console.log("response:", res);
      getProblems();
      if(res.status === 200){
        alert("문제가 삭제되었습니다.");
      }
      else{
        alert("문제 삭제에 실패했습니다.");
      }
      }
    )
    .catch(error => {console.error('Error:', error)});

  }

  return(
    <div className="m-3">
      <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
        <Row>
          <Col sm={3}>
            <ListGroup>
              <ListGroup.Item action href="#link1">
                문제 출제
              </ListGroup.Item>
              <ListGroup.Item action href="#link2">
                답안 등록
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="#link1">
              <div className="mb-3">
                <ProblemModal createProblems={createProblems} lastProblemNum={problems.length}></ProblemModal>
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
                          <Button variant="danger" onClick={()=>{
                            deleteProblems(problem.problemNum)
                          }}>문제 삭제</Button>
                        </Card.Footer>
                      </Card>
                    </div>
                  )
                })}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="#link2">
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>

      // <div className="m-1"> 
      //   <div className="row">
      //     <div className="col-md-2 mt-3">
      //       <h4>컴퓨터네트워크</h4>
      //       <div className="container">
      //         <div className="row mt-4 pl-1">
      //           <Button className="mb-3" style={{backgroundColor:"#7f95c0", borderColor:"#7f95c0", color:"black"}} onClick={()=>{history.push({
      //               pathname: "/tests/"+testId+"/problems",
      //               })}}>문제출제</Button>
      //           </div>
      //         <div className="row">
      //           <Button className="" style={{backgroundColor:"#7f95c0", borderColor:"#7f95c0", color:"black"}} onClick={()=>{history.push({
      //           pathname: "/tests/"+testId+"/problems",
      //           })}}>답안등록</Button>
      //         </div>
      //       </div>
      //     </div>
      //     <div className="col-md-9">
      //     <div className="m-3">
      //       <ProblemModal createProblems={createProblems} lastProblemNum={problems.length}></ProblemModal>
      //     </div>
      //     <div className="row">
      //     {problems.map((problem,index)=>{
      //       return (
      //         <div key={index} className="col-md-6">
      //           <Card className="mb-3" >
      //             <Card.Img variant="top" src="" />
      //             <Card.Header>
      //               <Card.Title>문제 {problem.problemNum} ({problem.point}점)</Card.Title>
      //             </Card.Header>
      //             <Card.Body>
      //               <Card.Text>
      //               {problem.question}
      //               </Card.Text>
      //             </Card.Body>
      //             <Card.Footer>
      //               <ProblemUpdateModal updateProblems={updateProblems} problemNum={problem.problemNum} point={problem.point} question={problem.question}></ProblemUpdateModal>
      //               <Button variant="danger" onClick={()=>{
      //               deleteProblems(problem.problemNum)
      //               }}>문제 삭제</Button>
      //             </Card.Footer>
      //           </Card>
      //         </div>
      //       )
      //     })}
      //   </div>
      //     </div>
      //   </div>
        
      // </div>
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
                <Form.Control type="number" disabled defaultValue={props.lastProblemNum+1} />
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