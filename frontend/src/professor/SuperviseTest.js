import React,{useEffect, useState} from 'react'
import {ListGroup,Card, Button ,Offcanvas ,Image,ButtonGroup,Badge } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from '../component/Loading';
import {baseUrl} from "../component/baseUrl"

function SuperviseTest(){

  let [verifications,setVerifications] = useState([])
  let [loading,setLoading] = useState(false)
  let [toggled,setToggled]=useState(0)
  let {testId} = useParams()
  
  useEffect(()=>{
    getVerifications();
  },[]);

  async function getVerifications(){
    await axios
    .get(baseUrl+'/tests/'+testId+'/students/verification')
    .then((result)=>{ 
      setVerifications(result.data)
      setLoading(true);
    })
    .catch(()=>{ console.log("실패") })
  }

  function sortVerifications(inc,standard){
    let temp = [...verifications].sort(function (a,b){
      let value  = a[standard] > b[standard] ?  1 :  -1
      return inc*value 
    })
    setVerifications(temp)
    
  }
  function buttonCss(idx) {
    return toggled===idx? "primary" : "outline-primary"  
  }

  if(!loading)return(<Loading></Loading>)
  return(
    <div className="conatiner p-3">
      <div className="row">
        <div className="col-md-3 d-flex justify-content-start">
          <StudentsList verifications={verifications} ></StudentsList>
        </div>
        <div className="col-md-9 d-flex justify-content-end">
          <ButtonGroup className="" aria-label="Basic example">
            <Button variant={buttonCss(0)} onClick={()=>{setToggled(0);sortVerifications(1,"studentId")}}>학번순오름정렬</Button>
            <Button variant={buttonCss(1)} onClick={()=>{setToggled(1);sortVerifications(-1,"studentId")}}>학번순내림정렬</Button>
          </ButtonGroup>
        </div>
        </div>
        <div className="row mt-3">
          {
            verifications.map((verification,index)=>{
              return <StudentCard className="" key={index} testId={testId} verification = {verification} setVerifications={setVerifications} / >;
            })
          }
        </div>
    </div> 
  )
}

function StudentCard(props){
  let verification_status_options={
    "REJECTED" : "거절",
    "PENDING" : "보류",
    "SUCCESS" : "성공",
  }
  return(
    <div className="col-md-6 mb-5">
      <Card >
        <div className="row">
          <video className="col-md-12" controls></video>
          <video className="col-md-12" controls></video>
        </div>
        <Card.Body>
          <Card.Title>{props.verification.studentId}번 학생</Card.Title>
          <hr />
          <Card.Text>
            {props.verification.submissionId}(submissionId)
          </Card.Text>
          <Card.Text>
            {verification_status_options[props.verification.verified]}
          </Card.Text>
          <div className="row">
            {props.verification.verified==="SUCCESS"
            ? <Button className="col-md-4" variant="primary" onClick={()=>{
                changeVerifications(props,false)}}>본인인증거절
              </Button> 
            : <Button className="col-md-4" variant="outline-primary" onClick={()=>{
                changeVerifications(props,true)}}>본인인증승인
              </Button> }
            
            <Button className="col-md-4" variant="success">채팅</Button>
            <Button className="col-md-4" variant="danger">경고</Button>
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="row">
            <Image className="col-md-5" src="https://cdn.pixabay.com/photo/2016/10/04/13/05/name-1714231_1280.png" />
            <Image className="col-md-7" src="https://cdn.pixabay.com/photo/2018/10/02/11/13/girl-3718526_1280.jpg" />
          </div>
        </Card.Footer>
      </Card>
    </div>
  )
}
async function changeVerifications(props,verified){
  let testId=props.testId
  let studentId=props.verification.studentId
  let setVerifications=props.setVerifications
  await axios
  .put(baseUrl+'/tests/'+testId+'/students/'+studentId+'/verification',{"verified" : verified})
  .then((result)=>{ 
    console.log(result.data)
  })
  .catch(()=>{ console.log("실패") })

  await axios
    .get(baseUrl+'/tests/'+testId+'/students/verification')
    .then((result)=>{ 
      setVerifications(result.data)
    })
    .catch(()=>{ console.log("실패") })
}

function StudentsList(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let verification_status_options={
    "REJECTED" : "거절",
    "PENDING" : "보류",
    "SUCCESS" : "성공",
  }
  let verification_status_css={
    "REJECTED" : "danger",
    "PENDING" : "warning",
    "SUCCESS" : "success",
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        전체 학생 현항
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>전체 학생 본인 인증 현항</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <ListGroup variant="flush">
            {
              props.verifications.map((verification,index)=>{
                return (
                  <ListGroup.Item key={index}>
                    <div className="row ">
                      <div className="col-md-6"> {verification.studentId} . 이름이 </div>
                      <div className="col-md-6 d-flex justify-content-end"> 
                        <Badge bg={verification_status_css[verification.verified]} className="mx-3">{verification_status_options[verification.verified]}</Badge>
                      </div>
                    </div>
                  </ListGroup.Item>
                )
              })
            }
            </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SuperviseTest