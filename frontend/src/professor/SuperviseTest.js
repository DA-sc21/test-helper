import React,{useEffect, useState} from 'react'
import {ListGroup,Card, Button ,Offcanvas ,Image,ButtonGroup,Badge } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from '../component/Loading';
import Master from '../kinesisVideo/Master';
import {baseUrl} from "../component/baseUrl"

function SuperviseTest(){

  let [testRooms,setTestRooms] = useState([])
  let [credentials,setCredentials] = useState();
  let [verifications,setVerifications] = useState([])
  let [loading,setLoading] = useState(false)
  let [toggled,setToggled]=useState(0)
  let {testId} = useParams()
  const [audio,setAudio] = useState([])
  const [pc,setPc] = useState([])
  const [studentId,setStudentId] = useState([])
  
  useEffect(()=>{
    getVerifications();
    createTestRooms();
  },[]);

  async function getVerifications(){
    await axios
    .get(baseUrl+'/tests/'+testId+'/students/verification')
    .then((result)=>{ 
      setVerifications(result.data)
      console.log(result.data)
      getStudentId(result.data)
    })
    .catch(()=>{ console.log("실패") })
  }

  function getStudentId(arr){
    let len = arr.length;
    let temp = [];
    let id = [];
    for(let i=0; i<len; i++){
      temp.push(false);
      id.push(arr[i].studentId);
    }
    setAudio(temp);
    setPc(temp);
    setStudentId(id);
  }

  async function createTestRooms(){
    await axios
    .post(baseUrl+'/tests/'+testId+'/students/room')
    .then((result)=>{
      sortTestRooms(result.data.students)
      setCredentials(result.data.credentials)
      console.log(result.data);
    })
    .catch(()=>{ console.log("실패") })
  }

  function sortTestRooms(arr){
    let temp = []
    let rooms = arr.map(data=>{
      temp.push(data.roomId)
    })
    setLoading(true);
    setTestRooms(temp)
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
          <StudentsList verifications={verifications} audio={audio} pc={pc}></StudentsList>
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
              return <StudentCard className="" key={index} testId={testId} verification = {verification} setVerifications={setVerifications} testRooms={testRooms} credentials={credentials} index={index} audio={audio} setAudio={setAudio} pc={pc} setPc={setPc} studentId={studentId} / >;
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
  function changeAudio(data){
    console.log("changeAudio 함수 호출");
    props.setAudio(data);
  }
  function changePc(data){
    console.log("changePc 함수 호출");
    props.setPc(data);
  }
  return(
    <div className="col-md-6 mb-5">
      <Card >
        <div className="row">
          <Master testRooms={props.testRooms[props.index]} credentials={props.credentials} region="us-east-2" index={props.index} audio={props.audio} pc={props.pc} studentId={props.studentId} changeAudio={changeAudio} changePc={changePc}></Master>
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
                        {props.audio[index] === true ? <img style ={{width: '20px', height: '20px', marginRight: '5%'}} src="/img/audio_on.png" /> : <img style ={{width: '20px', height: '20px', marginRight: '5%'}} src="/img/audio_off.png" />}
                        {props.pc[index] === true ? <img style ={{width: '20px', height: '20px'}} src="/img/pc_on.png" /> : <img style ={{width: '20px', height: '20px'}} src="/img/pc_off.png" />}
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