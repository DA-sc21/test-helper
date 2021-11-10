import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
// import { Toast } from "react-bootstrap";

let baseUrl ="http://api.testhelper.com"

function Student() {
  const { testId } = useParams();
  const wsSourceUrl = baseUrl+"/chatting";
  // const [randomUserName, setRandomUserName] = useState(
  //   UsernameGenerator.generateUsername("-")
  // );
  const [randomUserName, setRandomUserName] = useState("학생");
  // const [randomUserId, setRandomUserId] = useState(randomstring.generate());
  const [randomUserId, setRandomUserId] = useState("testone");
  // const [sendURL, setSendURL] = useState("/message");
  const [clientConnected, setClientConnected] = useState(false);
  const [messages, setMessages] = useState();
  const [clientRef, setClientRef] = useState();
  const [noticeShow, setNoticeShow] = useState(false);

  const onClickNotice = () => {
    setNoticeShow(!noticeShow);
  };

  const onMessageReceive = (msg, topic) => {
    console.log(msg.message);
    console.log(topic);
    ToastsStore.success(msg.message);
    setMessages((messages) => [...messages, msg]);
  };

  const sendMessage = (msg, selfMsg) => {
    try {
      var send_message = {
        user: selfMsg.author,
        message: selfMsg.message,
        testId: testId,
        studentId: "0",
      };
      clientRef.sendMessage(
        "/app/message/" + testId + "/" + "0",
        JSON.stringify(send_message)
      );
      return true;
    } catch (e) {
      return false;
    }
  };

  const closeButton = ({ closeToast }) => (
    <i className="material-icons" onClick={closeToast}>
      delete
    </i>
  );

  useEffect(() => {
    console.log("call history");
    // setMessages([
    //   {
    //     message: "공지공지",
    //     user: "reek-frozen",
    //     timeStamp: 1636224892146,
    //     fileName: null,
    //     rawData: null,
    //   },
    //   {
    //     message: "2번",
    //     user: "impossibility-upper-class",
    //     timeStamp: 1636224971243,
    //     fileName: null,
    //     rawData: null,
    //   },
    // ]);
    axios
      .get(baseUrl + "/history/" + testId + "/" + "0")
      .then((response) => {
        console.log(response);
        setMessages(response.data);
      });
  }, []);

  return (
    <div>
      {messages && (
        <TalkBox
          topic={"/topic/public/" + testId + "/0"}
          currentUserId={randomUserId}
          currentUser={randomUserName}
          messages={messages}
          onSendMessage={sendMessage}
          connected={clientConnected}
          // style={{ display: noticeShow ? "block" : "none" }}
        />
      )}

      {/* <div onClick={onClickNotice}>공지사항 목록</div>

      <div style={{ display: noticeShow ? "block" : "none" }}>
        {messages && messages.map((message) => <li>{message.message}</li>)}
      </div> */}

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
        topics={["/topic/public/" + testId + "/" + "0"]}
        onMessage={onMessageReceive}
        ref={(client) => {
          setClientRef(client);
        }}
        onConnect={() => {
          setClientConnected(true);
        }}
        onDisconnect={() => {
          clientConnected(false);
        }}
        debug={false}
        style={[{ width: "100%", height: "100%" }]}
      />
    </div>
  );
}

export default Student;