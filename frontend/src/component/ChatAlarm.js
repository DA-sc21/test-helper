import React,{ useState } from "react";
import { Toast } from 'react-bootstrap';

export default function ChatAlarm(props){
  const [show, setShow] = useState(true);
  let time=new Date(props.newMessage.timeStamp)
  // console.log(props.newMessage)

  function deleteMessage(element)  {
    let newMessageArray=[...props.newMessages]
    var index = newMessageArray.indexOf(element); 
    if (index > -1) {
      newMessageArray.splice(index, 1);
    }
    props.setNewMessages( [...newMessageArray])
  }
  
    return(
      <Toast onClose={() => {
        deleteMessage(props.newMessage)
      }} show={show} bg={props.chatroom==='0'?"light":"warning"}>
        <Toast.Header closeButton={true} >
          <strong className="me-auto">{props.chatroom==='0'?"공지사항":"채팅"}</strong>
          <small>{time.getHours()}:{time.getMinutes()}:{time.getSeconds()}</small>
        </Toast.Header>
        <Toast.Body>{props.newMessage.message}</Toast.Body>
      </Toast>
    )
  }