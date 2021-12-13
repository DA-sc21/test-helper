import React,{useEffect, useState} from 'react'
import {ListGroup, Card, Button, Offcanvas, Image, Badge, Accordion, Table } from 'react-bootstrap';
import {ToastContainer as ToastContainerB} from 'react-bootstrap';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import Loading from '../component/Loading';
import ChatFormPro from '../component/ChatFormPro';
import Master from '../kinesisVideo/Master';
import {baseUrl} from "../component/baseUrl"
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastify.css';
import moment from "moment";
import ChatAlarm from '../component/ChatAlarm';
import { useInterval } from 'react-use';
import Moment from "react-moment"
import 'moment/locale/ko';

function SuperviseTest(props){
  let history = useHistory();
  let [studentName,setStudentName] = useState([]);
  let [studentInfo,setStudentInfo] = useState([]);
  let [testRooms,setTestRooms] = useState([]);
  let [credentials,setCredentials] = useState();
  let [verifications,setVerifications] = useState([]);
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
    .get(baseUrl+'/tests/'+testId+'/students/verification',{withCredentials : true})
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
    shareState.audio=temp;
    shareState.pc=temp;
    setStudentId(id);
  }

  async function createTestRooms(){
    let response = await fetch(baseUrl+"/tests/"+testId+"/students/room",{
      method: "POST",
      credentials: "include",
      })
      .then((res) => res.json())
      .then((res) => {
        console.log("response:", res);
        getStudentName(res.students);
        sortTestRooms(res.students);
        setStudentInfo(res.students);
        setCredentials(res.credentials);
        setLoading(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function sortTestRooms(arr){
    let temp = []
    let rooms = arr.map(data=>{
      temp.push(data.roomId);
    })
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
    autoClose: 15000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  });

  async function exitTest(e){

    let response = await fetch(baseUrl+'/tests/'+testId+'/status?status=ENDED',{
      method: 'PUT',
      credentials : 'include',
    })
    .then((res) => res.json())
    .then((res) => {
      console.log("response:", res);
      if(res.errorMessage){
        alert(res.errorMessage)
      }
      else{
        alert("시험이 정상적으로 종료되었습니다.")
        history.push("/tests")
      }
    })
    .catch(error => {console.error('Error:', error)});

    // await axios
    // .put(baseUrl+'/tests/'+testId+'/status?status=ENDED',{withCredentials : true})
    // .then((result)=>{
    //   console.log(result.data);
    // })
    // .catch(()=>{ console.log("실패") })
  }

  moment.locale('ko')

  let startTime = props.location.state.testStartTime
  startTime = moment(startTime).format("YYYY-MM-DD dd HH:mm:ss")
  let endTime = props.location.state.testEndTime
  endTime = moment(endTime).format("YYYY-MM-DD dd HH:mm:ss")

  let formatTime={
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }

  const [remainTime, setRemainTime] = useState(formatTime);
  const [remainEndTime, setRemainEndTime] = useState(formatTime);
  let [started,setStarted]=useState(false)
  let [ended,setEnded]=useState(false)

  useInterval(() => {
    let currentTime = moment();
    // let testStartTime = moment("2021 10 31 18:07");//테스트용
    let testStartTime = moment(props.location.state.testStartTime);
    // let testEndTime = moment("2021 11 14 23:25");//테스트용
    let testEndTime = moment(props.location.state.testEndTime);
    let duration = moment.duration(testStartTime.diff(currentTime));
    let durationEndTime = moment.duration(testEndTime.diff(currentTime));
    duration < 0 ? setStarted(true) :setStarted(false) 
    durationEndTime < 0 ? setEnded(true) :setEnded(false) 
    let temp=timeToDict(duration)
    setRemainTime(temp)
    let tempEnd=timeToDict(durationEndTime)
    setRemainEndTime(tempEnd)
  }, 1000);

  function timeToDict(duration){
    return {
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds()
    }
  }

  if(!loading)return(<Loading></Loading>)
  return(
    <div className="conatiner p-3" style={{backgroundColor:"#f3f3f3"}}>
      <div className="row">
        <div className="col-md-8">
        </div>
        <div className="col-md-4 d-flex justify-content-end">
          <Table striped bordered hover size="sm">
            <tbody>
              <tr>
                <td> 현재 시간 </td>
                <td> <Moment format="YYYY-MM-DD dd HH:mm:ss" >{Date.now()}</Moment>  </td>
              </tr>
              <tr>
                <td>시험시작 시간</td>
                <td> {startTime}  </td>
              </tr>
              <tr>
                <td>시험종료 시간</td>
                <td> {endTime}  </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <div style={{backgroundColor:"#FFD8D8", textAlign:"center", padding:"4px",margin:"10px", borderRadius:"5px", fontWeight:"bold"}}>

                  { 
                  started
                  ?  
                    ended 
                    ?  "시험 종료 "+(-remainEndTime.days)+"일 "+(-remainEndTime.hours)+"시간 "+(-remainEndTime.minutes)+"분 "+(-remainEndTime.seconds)+"초 지났습니다."
                    :  "시험 종료까지 "+ remainEndTime.days+"일 "+remainEndTime.hours+"시간 "+remainEndTime.minutes+"분 "+remainEndTime.seconds+"초 남았습니다." 
                  :  "시험 시작까지 "+ remainTime.days+"일 "+remainTime.hours+"시간 "+remainTime.minutes+"분 "+remainTime.seconds+"초 남았습니다." 
                  }
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 d-flex justify-content-start">
          <ToastContainer
            position="bottom-right"
            autoClose={15000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            style={{ width: "350px" }}
          />
          <StudentsList audio={shareState.audio} pc={shareState.pc} studentInfo={studentInfo} testId={testId}></StudentsList>
          <AnswerSheetSubmissionList studentInfo={studentInfo} testId={testId}></AnswerSheetSubmissionList>
        </div>
        <div className="col-md-9 d-flex justify-content-end">
          <ChattingModal studentId="0" cheating={false}></ChattingModal>
          <Button style={{marginRight:"3%", backgroundColor:"#303641", borderColor:"#303641", boxShadow:"2px 2px 2px #57575775"}} onClick={(e)=> exitTest(e)}>종료</Button>
        </div>
        <div className="row mt-3" style={{backgroundColor:"#f3f3f3"}}>
          {
            verifications.map((verification,index)=>{

              return <StudentCard className="" key={index} testId={testId} verification = {verification} setVerifications={setVerifications} testRooms={testRooms} credentials={credentials} index={index} audio={shareState.audio} pc={shareState.pc} studentId={studentId} changeAudioState={changeAudioState} changePcState={changePcState} studentInfo={studentInfo} notify={notify} studentName={studentName}/ >;

            })
          }
        </div>
      </div>
    </div> 
  )
}

function StudentCard(props){
  console.log(props)
  let {testId} = useParams();
  let [studentCard,setStudentCard] = useState("");
  let [face,setface] = useState("");
  let [capture_1,setcapture_1] = useState("");
  let [answer_1,setanswer_1] = useState("");
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
    getimages("capture_1",setcapture_1);
    getimages("answer_1",setanswer_1);
  }
  async function getimages(target,setfunc){
    testId=String(testId).padStart(5,"0");
    let studentNum=props.studentInfo[props.index].student.studentNumber;
    await axios
      .get(baseUrl+'/s3-download-url?objectKey=test/'+testId+'/submission/'+studentNum+'/'+target+'.jpg',{withCredentials : true})
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
          <div className="row">
            {props.verification.verified==="SUCCESS"
            ? <Button className="col-md-4" variant="primary" onClick={()=>{
                changeVerifications(props,false)}}>본인인증거절
              </Button> 
            : <Button className="col-md-4" variant="outline-primary" onClick={()=>{
                changeVerifications(props,true)}}>본인인증승인
              </Button> }
            <ChattingModal studentId={props.verification.studentId} cheating={false}></ChattingModal>
            <ChattingModal studentId={props.verification.studentId} cheating={true}></ChattingModal>
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="row">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header><Button style={{backgroundColor:"#ffffff00", color:"black", borderColor:"#61dafb00", outline:"0", fontWeight:"bold", width:"100%", textAlign:"left"}} onClick={(e)=>getIdentificationImgae(e)}>본인인증 사진</Button></Accordion.Header>
                <Accordion.Body>
                  <Image className="col-md-5" style={{height:"270px", width:"290px", marginRight:"1.5%"}} src={studentCard} />
                  <Image className="col-md-5" style={{height:"270px", width:"290px", marginLeft:"1.5%"}} src={face} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          <div className="row">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header><Button style={{backgroundColor:"#ffffff00", color:"black", borderColor:"#61dafb00", outline:"0", fontWeight:"bold", width:"100%", textAlign:"left"}} onClick={(e)=>getIdentificationImgae(e)}>답안지 제출 사진</Button></Accordion.Header>
                <Accordion.Body>
                  <Image className="col-md-5" style={{height:"270px", width:"290px", marginRight:"1.5%"}} src={capture_1} />
                  <Image className="col-md-5" style={{height:"270px", width:"290px", marginLeft:"1.5%"}} src={answer_1} />
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
          <Button onClick={handleShow} style={{marginRight: "2.5%", backgroundColor:"#d2d6df", borderColor:"#d2d6df", color:"black", fontWeight:"bold", boxShadow:"2px 2px 2px #57575775"}}>
          공지사항
          </Button>
        :
          props.cheating?
          <Button className="col-md-4" variant="danger" onClick={handleShow}>
          부정행위경고
          </Button>
          :
          <Button className="col-md-4" variant="outline-dark" onClick={handleShow}>
          채팅
          </Button>
      }
        <ChatFormPro testId={testId} role="Master" chatroom={props.studentId} show={show} setShow={setShow} newMessages={newMessages} setNewMessages={setNewMessages} cheating={props.cheating}></ChatFormPro>
        <ToastContainerB className="p-3 chatAlarmContainer positionTop" position="top-center">
          {
            newMessages.map((message,index)=>{
            let chatroom=message.chatroom
            return(
            <ChatAlarm key={index} newMessages={newMessages} newMessage={message} chatroom={chatroom} setNewMessages={setNewMessages} ></ChatAlarm>
            )
          })}
        </ToastContainerB>
    </>
  );
}


async function changeVerifications(props,verified){
  let testId=props.testId
  let studentId=props.verification.studentId
  let setVerifications=props.setVerifications
  await axios
  .put(baseUrl+'/tests/'+testId+'/students/'+studentId+'/verification',{"verified" : verified},{
    withCredentials : true
  })
  .then((result)=>{ 
    console.log(result.data)
  })
  .catch(()=>{ console.log("실패") })

  await axios
    .get(baseUrl+'/tests/'+testId+'/students/verification',{
      withCredentials : true
    })
    .then((result)=>{ 
      setVerifications(result.data)
    })
    .catch(()=>{ console.log("실패") })
}

function StudentsList(props) {
  console.log(props)
  let [verifications,setVerifications] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    getVerifications();
  }
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
  async function getVerifications(){
    await axios
    .get(baseUrl+'/tests/'+props.testId+'/students/verification',{
      withCredentials : true
    })
    .then((result)=>{ 
      setVerifications(result.data);
      console.log(result.data);
    })
    .catch(()=>{ console.log("실패") })
  }

  return (
    <>
      <Button style={{backgroundColor: "#506EA5", borderColor:"#506EA5", boxShadow:"2px 2px 2px #57575775"}} onClick={handleShow}>
        전체 학생 현황
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>전체 학생 본인인증 현황</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <ListGroup variant="flush">
            {
              verifications.map((verification,index)=>{
                return (
                  <ListGroup.Item key={index}>
                    <div className="row ">
                      <div className="col-md-6">{index+1}. {props.studentInfo[index].student.name}</div>
                      <div className="col-md-6 d-flex justify-content-end"> 
                        {/* {props.audio[index] === true ? <img style ={{width: '20px', height: '20px', marginRight: '5%'}} src="/img/audio_on.png" /> : <img style ={{width: '20px', height: '20px', marginRight: '5%'}} src="/img/audio_off.png" />}
                        {props.pc[index] === true ? <img style ={{width: '20px', height: '20px'}} src="/img/pc_on.png" /> : <img style ={{width: '20px', height: '20px'}} src="/img/pc_off.png" />} */}
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

function AnswerSheetSubmissionList(props) {
  console.log(props);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    getSubmissions();
  }
  let [submissions,setSubmissions] = useState([]);
  let submission_status_options={
    "PENDING" : "제출전",
    "DONE" : "제출완료",
  }
  let submission_status_css={
    "PENDING" : "secondary",
    "DONE" : "primary",
  }
  async function getSubmissions(){
    await axios
    .get(baseUrl+'/tests/'+props.testId+'/submissions?studentNumber=2',{
      withCredentials : true
    })
    .then((result)=>{ 
      setSubmissions(result.data);
      console.log(result.data);
    })
    .catch(()=>{ console.log("실패") })
  }

  return (
    <>
      <Button style={{backgroundColor: "#4f596d", borderColor:"#4f596d", marginLeft:"3%", boxShadow:"2px 2px 2px #57575775"}} onClick={handleShow}>
        답안 제출 현황
      </Button>

      <Offcanvas show={show} onHide={handleClose} style={{width:"350px"}}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>답안 제출 현황</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <ListGroup variant="flush">
            {
              submissions.map((submissions,index)=>{
                return (
                  <ListGroup.Item key={index}>
                    <div className="row ">
                      <div className="col-md-6">{index+1}. {props.studentInfo[index].student.name}</div>
                      <div className="col-md-6 d-flex justify-content-end"> 
                        <Badge bg={submission_status_css[submissions.submitted]} className="mx-3">{submission_status_options[submissions.submitted]}</Badge>
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