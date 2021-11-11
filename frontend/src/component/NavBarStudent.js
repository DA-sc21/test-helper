import React ,{useState} from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar , Container, Button  } from 'react-bootstrap';
import ChatForm from "../component/ChatForm"

function NavBarStudent(){
  let [showNotice,setShowNotice]=useState(false)
  let [showChat,setShowChat]=useState(false)
  let { testId ,studentId } = useParams();
  return(
    <div className="">
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand as = {Link} to="/">Test Helper</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
        <Navbar.Text className="mx-2">
          000학생, 반갑습니다.
          </Navbar.Text>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="mx-2">
          </Navbar.Text>
          <Button className="mx-1" variant="primary" onClick={()=>{setShowNotice(!showNotice)}} >공지사항</Button>
          <Button className="mx-1" variant="primary" onClick={()=>{setShowChat(!showChat)}} >채팅하기</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    {showNotice? <ChatForm testId={testId} role="Viewer" chatroom="0" ></ChatForm>  :null }
    {showChat? <ChatForm testId={testId} role="Viewer" chatroom={studentId}></ChatForm>  :null }
    </div>
  )
}
export default NavBarStudent