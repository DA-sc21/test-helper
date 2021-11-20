import "./Chat.css"
import React from "react"
import { Form , Button } from 'react-bootstrap';

export default function ChatList(props){
  return(
    <div className="row">
      <div className="chatcard chat-app" style={{boxShadow:"3px 3px 3px #57575775"}}>
        <div className="chat">
          <div className="chat-room p-3">{props.notice?"공지사항":"채팅하기"}</div>
          <div className="chat-history">
            <ul className="m-b-0">
              {
              props.messages.map((data,index)=>{
                let time=new Date(data.timeStamp)
                let person=data.user
                let dialog=data.message
                return(
                <li className="" key={index}>
                  <div className={person===props.role?"message-data text-right":"message-data text-left"}>
                    <span className="message-data-time">{time.getHours()}:{time.getMinutes()}:{time.getSeconds()}, {person}</span>
                  </div>
                  <div className={person===props.role?" col-md-12 message other-message float-right":" col-md-12 message my-message"} > {dialog} </div>
                </li>)
              })
              }
            </ul>
          </div>
          {props.notice && props.role==="Viewer"
            ?null:
            <div className="input-group mb-0">
              <Form.Control 
                size="lg" 
                type="text" 
                id={"MessageInput"+props.chatRoomId} 
                placeholder="메세지를 입력하세요." 
              />
              <Button 
              variant="primary" 
              onClick={
                ()=>{

                  props.sendMessage(1, {"author":props.role,
                                        "message":document.querySelector("#MessageInput"+props.chatRoomId).value})
                  document.querySelector("#MessageInput"+props.chatRoomId).value=""
                }}
              >전송</Button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}