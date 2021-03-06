import React, { useState } from 'react'
import { Button , Modal } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import ChatForm from '../component/ChatForm';
import { Problems } from './Problems';
import SubmitAnswer from './SubmitAnswer';

function TakingTest(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
      if(!props.consented)
      {
        alert("사전 동의를 완료하지 않아서 시험장에 입장할 수 없습니다.")
      }
      else if(props.verification!=="SUCCESS")
      {
        alert("본인인증을 완료하지 않아서 시험장에 입장할 수 없습니다.")
      }
      else{
        setShow(true);
      }
    };
    console.log(props.data)
    let [showNotice,setShowNotice]=useState(false)
    let [showChat,setShowChat]=useState(false)
    let { testId ,studentId } = useParams();
    let [newMessages,setNewMessages] =useState([])
    // let id = props.data.room.device + props.data.student.id;

    return (
      <>
        <Button variant= "dark" size="lg" disabled= {!props.started} onClick={handleShow}>
          시험장입장
        </Button>

        <Modal show={show} fullscreen={true} onHide={handleClose}>
          <Modal.Header >
            <Modal.Title>시험장</Modal.Title>
            <div className="d-flex justify-content-end">
              <Button className="" variant="dark" onClick={()=>{setShowNotice(!showNotice);setShowChat(false);setNewMessages([])}} >공지사항</Button>
              <Button className="mx-3" variant="secondary" onClick={()=>{setShowChat(!showChat);setShowNotice(false);setNewMessages([])}} >채팅하기</Button>
            </div>
            <div  className="position-absolute top-0 end-0">
              <ChatForm testId={testId} role="Viewer" chatroom="0" show={showNotice} setShow={setShowNotice} newMessages={newMessages} setNewMessages={setNewMessages} ></ChatForm> 
              <ChatForm testId={testId} role="Viewer" chatroom={studentId} show={showChat} setShow={setShowChat} newMessages={newMessages} setNewMessages={setNewMessages} ></ChatForm> 
            </div>
          </Modal.Header>
          <Modal.Body>
            {props.ended?
            <SubmitAnswer handleClose={handleClose}></SubmitAnswer>
            :<Problems></Problems>
            }
          </Modal.Body>
          <Modal.Footer>
            <div style={{backgroundColor:"#2a2f38",color:"white", textAlign:"center", padding:"4px",margin:"10px", borderRadius:"5px", fontWeight:"bold"}}>
              {
                props.ended 
                ?  "시험 종료 "+(-props.remainEndTime.days)+"일 "+(-props.remainEndTime.hours)+"시간 "+(-props.remainEndTime.minutes)+"분 "+(-props.remainEndTime.seconds)+"초 지났습니다."
                :  "시험 종료까지 "+ props.remainEndTime.days+"일 "+props.remainEndTime.hours+"시간 "+props.remainEndTime.minutes+"분 "+props.remainEndTime.seconds+"초 남았습니다." 
              }
            </div>
            <Button variant="secondary" onClick={handleClose}>
              시험종료
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }


export default TakingTest 