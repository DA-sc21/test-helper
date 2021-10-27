import React, { useEffect, useRef, useState } from 'react';
import { Button  } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Viewer from './Viewer';

const SetViewer = (props) => {
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
      <div>
            <br></br>
            <h4>모바일 카메라 공유</h4>
            <div>
                <input type="checkbox" checked={video} onChange={(e) => changeVideo(e)}></input>
                <label>Send Video</label>
            </div>
            <br></br>
            <h4>모바일 마이크 공유</h4>
            <div>
                <input type="checkbox" checked={audio} onChange={(e) => changeAudio(e)}></input>
                <label>Send Audio</label>
            </div>
            <br></br>

            <Button variant="light"><Link to ={{pathname: "/kinesis/viewer", state:{sendVideo: video, sendAudio: audio, region: props.location.state.region, accessKey: props.location.state.accessKey, secretAccessKey: props.location.state.secretAccessKey,  channelName:  props.location.state.channelName} }}>Viewer</Link></Button>
      </div>
    );
};


export default SetViewer;