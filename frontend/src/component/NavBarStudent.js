import React ,{useState} from 'react';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, Navbar , Container, Button  } from 'react-bootstrap';
import ChatForm from "../component/ChatForm"
import ChatAlarm from './ChatAlarm';
import { BrowserView, MobileView } from 'react-device-detect';

function NavBarStudent(){
  let [showNotice,setShowNotice]=useState(false)
  let [showChat,setShowChat]=useState(false)
  let { testId ,studentId } = useParams();
  let [newMessages,setNewMessages] =useState([])
  return(
    <div className="">
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand as = {Link} to="/">Test Helper</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="mx-2">
            </Navbar.Text>
            <Button className="" variant="dark" onClick={()=>{setShowNotice(!showNotice);setShowChat(false);setNewMessages([])}} style={{zIndex:2000}} >공지사항</Button>
            <Button className="mx-3" variant="secondary" onClick={()=>{setShowChat(!showChat);setShowNotice(false);setNewMessages([])}} style={{zIndex:2000}} >채팅하기</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <BrowserView> 
        <ChatForm testId={testId} role="Viewer" chatroom="0" show={showNotice} setShow={setShowNotice} newMessages={newMessages} setNewMessages={setNewMessages} ></ChatForm> 
        <ChatForm testId={testId} role="Viewer" chatroom={studentId} show={showChat} setShow={setShowChat} newMessages={newMessages} setNewMessages={setNewMessages} ></ChatForm> 
        <ToastContainer className="p-3 chatAlarmContainer positionTop" position="top-center" style={{zIndex:2000}}>
          {
            newMessages.map((message,index)=>{
            let chatroom=message.chatroom
            return(
            <ChatAlarm key={index} newMessages={newMessages} newMessage={message} chatroom={chatroom} setNewMessages={setNewMessages} ></ChatAlarm>
            )
          })}
        </ToastContainer>
      </BrowserView>

    </div>
  )
}
export default NavBarStudent