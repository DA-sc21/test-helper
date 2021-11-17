import React,{useEffect, useState} from 'react'
import {ListGroup, Card, Button, Offcanvas, Image, ButtonGroup, Badge, Modal, Accordion} from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from '../component/Loading';
import ChatFormPro from '../component/ChatFormPro';
import Master from '../kinesisVideo/Master';
import {baseUrl} from "../component/baseUrl"
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastify.css';

function SuperviseTest(){

  let [studentName,setStudentName] = useState([]);
  let [studentInfo,setStudentInfo] = useState([]);
  let [testRooms,setTestRooms] = useState([]);
  let [credentials,setCredentials] = useState();
  let [verifications,setVerifications] = useState([]);
  let [submissions,setSubmissions] = useState([])
  let [loading,setLoading] = useState(false);
  let [toggled,setToggled]=useState(0);
  let {testId} = useParams();
  const [studentId,setStudentId] = useState([]);
  const shareState = {
    audio: [],
    pc: [],
  };
  
  useEffect(()=>{
    getVerifications();
    getSubmissions();
    createTestRooms();
  },[]);

  function changeAudioState(id,value){
    shareState.audio[id]=value;
    console.log(shareState.audio, shareState.pc);
  }
  function changePcState(id,value){
    shareState.pc[id]=value;
    console.log(shareState.audio, shareState.pc);
  }

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

  async function getSubmissions(){
    await axios
    .get(baseUrl+'/tests/'+testId+'/submissions')
    .then((result)=>{ 
      setSubmissions(result.data)
      console.log(result.data)
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
    shareState.audio=temp;
    shareState.pc=temp;
    setStudentId(id);
  }

  async function createTestRooms(){
    await axios
    .post(baseUrl+'/tests/'+testId+'/students/room')
    .then((result)=>{
      getStudentName(result.data.students);
      sortTestRooms(result.data.students);
      setStudentInfo(result.data.students);
      setCredentials(result.data.credentials);
      console.log(result.data);
      setLoading(true);
    })
    .catch(()=>{ console.log("실패") })
  }

  function sortTestRooms(arr){
    let temp = []
    let rooms = arr.map(data=>{
      temp.push(data.roomId);
    })
    setLoading(true);
    setTestRooms(temp);
  }

  function getStudentName(arr){
    let temp = []
    let rooms = arr.map(data=>{
      temp.push(data.student.name);
    })
    setStudentName(temp);
  }

  function sortVerifications(inc,standard){
    let temp = [...verifications].sort(function (a,b){
      let value  = a[standard] > b[standard] ?  1 :  -1
      return inc*value 
    })
    setVerifications(temp)
    
  }

  const notify = (name) => toast.warn(`${name} 학생의 손이 화면에서 벗어났습니다.`, {
    position: "bottom-right",
    transition: Slide,
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  });

  if(!loading)return(<Loading></Loading>)
  return(
    <div className="conatiner p-3" style={{backgroundColor:"#E8F5FF"}}>
      <div className="row">
        <div className="col-md-3 d-flex justify-content-start">
          <ToastContainer
            position="bottom-right"
            autoClose={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            style={{ width: "350px" }}
          />
          <StudentsList verifications={verifications} audio={shareState.audio} pc={shareState.pc} studentInfo={studentInfo}></StudentsList>
        </div>
        <div className="col-md-9 d-flex justify-content-end">
          <ChattingModal studentId="0"></ChattingModal>
        </div>
        <div className="row mt-3" style={{backgroundColor:"#E8F5FF"}}>
          {
            verifications.map((verification,index)=>{


              return <StudentCard className="" key={index} testId={testId} verification = {verification} submission={submissions[index]} setVerifications={setVerifications} testRooms={testRooms} credentials={credentials} index={index} audio={shareState.audio} pc={shareState.pc} studentId={studentId} changeAudioState={changeAudioState} changePcState={changePcState} studentInfo={studentInfo} notify={notify} studentName={studentName}/ >;

            })
          }
        </div>
      </div>
    </div> 
  )
}

function StudentCard(props){
  let {testId} = useParams();
  let [studentCard,setStudentCard] = useState("");
  let [face,setface] = useState("");
  let verification_status_options={
    "REJECTED" : "거절",
    "PENDING" : "보류",
    "SUCCESS" : "성공",
  }
  let submission_status_options={
    "PENDING" : "제출전",
    "DONE" : "제출완료",
  }
  function changeAudio(id,value){
    props.changeAudioState(id,value);
  }
  function changePc(id,value){
    props.changePcState(id,value);
  }

  function pushHandDetetionNotice(){
    props.notify(props.studentName[props.index]);
  }
  
  function getIdentificationImgae(e){
    getimages("student_card",setStudentCard);
    getimages("face",setface);
  }
  async function getimages(target,setfunc){
    testId=String(testId).padStart(5,"0");
    let studentNum=props.studentInfo[props.index].student.studentNumber;
    await axios
      .get(baseUrl+'/s3-download-url?objectKey=test/'+testId+'/submission/'+studentNum+'/'+target+'.jpg')
      .then((result)=>{
        setfunc(result.data);
      })
      .catch(()=>{ console.log("실패") })
  }
  return(
    <div className="col-md-6 mb-5">
      <Card style={{borderColor: "white", padding: "3%", backgroundColor:"white", borderRadius: "20px", boxShadow: "3px 3px 3px #dcdcdc"}}>
        <div className="row">
          <Master testRooms={props.testRooms[props.index]} credentials={props.credentials} region="us-east-2" index={props.index} audio={props.audio} pc={props.pc} studentId={props.studentId} changeAudio={changeAudio} changePc={changePc} pushHandDetetionNotice={pushHandDetetionNotice}></Master>
        </div>
        <Card.Body>
          <Card.Title><h4>{props.studentInfo[props.index].student.name}-<span style={{fontSize: "15px"}}>{props.studentInfo[props.index].student.studentNumber}</span></h4></Card.Title>
          <hr />
          <Card.Text>
          본인인증 : {verification_status_options[props.verification.verified]}
          </Card.Text>
          <Card.Text>
          답안제출현황 : {submission_status_options[props.submission.submitted]}
          </Card.Text>
          <div className="row">
            {props.verification.verified==="SUCCESS"
            ? <Button className="col-md-4" variant="primary" onClick={()=>{
                changeVerifications(props,false)}}>본인인증거절
              </Button> 
            : <Button className="col-md-4" variant="outline-primary" onClick={()=>{
                changeVerifications(props,true)}}>본인인증승인
              </Button> }
            <ChattingModal studentId={props.verification.studentId}></ChattingModal>
            <Button className="col-md-4" variant="danger">경고</Button>
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="row">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header><Button style={{backgroundColor:"#ffffff00", color:"black", borderColor:"0", outline:"0", fontWeight:"bold", marginLeft:"0%"}} onClick={(e)=>getIdentificationImgae(e)}>본인인증 사진</Button></Accordion.Header>
                <Accordion.Body>
                  <Image className="col-md-5" style={{height:"270px", width:"290px", marginRight:"1.5%"}} src={studentCard} />
                  <Image className="col-md-5" style={{height:"270px", width:"290px", marginLeft:"1.5%"}} src={face} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </Card.Footer>
      </Card>
    </div>
  )
}

function ChattingModal(props) {
  let {testId} = useParams()
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(!show);
  let [newMessages,setNewMessages] =useState([])

  return (
    <>
      {props.studentId==="0"
        ?
          <Button variant="success" onClick={handleShow} style={{marginRight: "2.5%"}}>
          공지사항
          </Button>
        :
          <Button className="col-md-4" variant="success" onClick={handleShow}>
          채팅
          </Button>
      }
        <ChatFormPro testId={testId} role="Master" chatroom={props.studentId} show={show} newMessages={newMessages} setNewMessages={setNewMessages} ></ChatFormPro>
    </>
  );
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
      <Button style={{backgroundColor: "#506EA5"}} onClick={handleShow}>
        전체 학생 현황
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>전체 학생 본인 인증 현황</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <ListGroup variant="flush">
            {
              props.verifications.map((verification,index)=>{
                return (
                  <ListGroup.Item key={index}>
                    <div className="row ">
                      <div className="col-md-6">{index+1}. {props.studentInfo[index].student.name}</div>
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
