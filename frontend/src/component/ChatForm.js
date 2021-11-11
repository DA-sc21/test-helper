import React, { useEffect, useState } from "react";
import SockJsClient from "react-stomp";
// import UsernameGenerator from "username-generator";
import { TalkBox } from "react-talk";
// import randomstring from "randomstring";
import axios from "axios";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import ChatList from "./ChatList";
import Loading from "./Loading";
// import { Toast } from "react-bootstrap";

let baseUrl ="http://api.testhelper.com"


function ChatForm(props) {
  let testId=props.testId
  let chatRoomId=props.chatroom
  const wsSourceUrl = baseUrl+"/chatting";
  // const [randomUserName, setRandomUserName] = useState(
  //   UsernameGenerator.generateUsername("-")
  // );
  const [randomUserName, setRandomUserName] = useState("Master");
  // const [randomUserId, setRandomUserId] = useState(randomstring.generate());
  const [randomUserId, setRandomUserId] = useState("testone");
  // const [sendURL, setSendURL] = useState("/message");
  const [clientConnected, setClientConnected] = useState(false);
  const [messages, setMessages] = useState();
  const [clientRef, setClientRef] = useState();

  const onMessageReceive = (msg, topic) => {
    console.log(msg.message);
    console.log(topic);
    ToastsStore.success(msg.message);
    setMessages((messages) => [...messages, msg]);
  };

  const sendMessage = (msg, selfMsg) => {
    console.log(selfMsg)
    try {
      var send_message = {
        user: selfMsg.author,
        message: selfMsg.message,
        testId: testId,
        studentId: chatRoomId,
      };
      clientRef.sendMessage(
        "/app/message/" + testId + "/" + chatRoomId,
        JSON.stringify(send_message)
      );
      return true;
    } catch (e) {
      return false;
    }
  };

  let [loading,setLoading] = useState(false)

  useEffect(() => {
    console.log("call history");
    getHistory();
  }, []);

  async function getHistory(){
    await axios
      .get(baseUrl + "/history/" + testId + "/" + chatRoomId)
      .then((response) => {
        // console.log(response);
        setMessages(response.data);
        setLoading(true);
      });
  }
  // if(!loading)return(<Loading></Loading>)
  return (
    <div className="position-absolute top-50 end-0 ">
      {!loading
      ?<Loading></Loading>
      :
      <ChatList messages={messages} role={props.role} notice={chatRoomId==="0"?true:false} sendMessage={sendMessage}></ChatList>
    }
      {/* {messages && (
        <TalkBox
          topic={"/topic/public/" + testId + "/0"}
          // topic="/topic/public/${testId}/0"
          currentUserId={randomUserId}
          currentUser={randomUserName}
          messages={messages}
          onSendMessage={sendMessage}
          connected={clientConnected}
        />
      )} */}
      
      <ToastsContainer
        position={ToastsContainerPosition.TOP_RIGHT}
        // autoClose={50000}
        // closeOnClick
        // closeButton={closeButton}
        store={ToastsStore}
        lightBackground
      />

      <SockJsClient
        url={wsSourceUrl}
        topics={["/topic/public/" + testId + "/" + chatRoomId]}
        onMessage={onMessageReceive}
        ref={(client) => {
          setClientRef(client);
        }}
        onConnect={() => {
          setClientConnected(true);
        }}
        onDisconnect={() => {
          setClientConnected(false);
        }}
        debug={false}
        style={[{ width: "100%", height: "100%" }]}
      />
    </div>
  );
}

export default ChatForm;