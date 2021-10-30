import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const SetViewer = () => {
  const [video, setVideo] = useState(false);
  const [audio, setAudio] = useState(false);

  let changeVideo = (e) => {
    setVideo(e.target.checked)
    console.log('카메라 공유 여부:', e.target.checked)
  } 

  let changeAudio = (e) => {
    setAudio(e.target.checked)
    console.log('마이크 공유 여부:', e.target.checked)
  }
         
  return (
    <div style={{marginTop: '15%', marginLeft:'3%', marginRight: '3%'}}>
      <p style={{fontWeight: 'bold'}}>카메라 및 마이크 공유를 <span style={{ color: 'rgb(43, 73, 207)', fontWeight: 'bold'}}>모두 동의</span>한 후 설정완료 버튼을 클릭해주세요.</p>

      <div style={{marginTop: '15%'}}>
        <p style={{fontWeight: 'bold'}}>모바일 카메라 공유</p>
        <div>
          <input type="checkbox" checked={video} onChange={(e) => changeVideo(e)}></input>
          <label>동의</label>
        </div>
      </div>
      <div style={{marginTop: '10%', marginBottom: '20%'}}>
        <p style={{fontWeight: 'bold'}}>모바일 마이크 공유</p>
        <div>
          <input type="checkbox" checked={audio} onChange={(e) => changeAudio(e)}></input>
          <label> 동의</label>
        </div>
      </div>

      <Button variant="primary"><Link to ={{pathname: "/tests/viewer", state:{sendVideo: video, sendAudio: audio, region: "", accessKey: "", secretAccessKey: "",  channelName: "", clientId: "", sessionToken: ""}}} style={{textDecorationLine: 'none', color: 'white'}}>설정 완료</Link></Button>

    </div>
  );
};

export default SetViewer;