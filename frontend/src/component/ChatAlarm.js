import React,{ useState } from "react";
import { Toast } from 'react-bootstrap';

export default function ChatAlarm(props){
  const [show, setShow] = useState(true);
  let time=new Date(props.newMessage.timeStamp)
  console.log(props.chatroom)
    return(
      <Toast onClose={() => {setShow(false)}} show={show} bg={props.chatroom==='0'?"light":"success"}>
        <Toast.Header closeButton={true} >
          <strong className="me-auto">{props.chatroom==='0'?"공지사항":"채팅"}</strong>
          <small>{time.getHours()}:{time.getMinutes()}:{time.getSeconds()}</small>
        </Toast.Header>
        <Toast.Body>{props.newMessage.message}</Toast.Body>
      </Toast>
    )
  }