import React, { useEffect, useRef, useState } from 'react';
import { store, view } from '@risingstack/react-easy-state';
import AWS from "aws-sdk";
import { Button } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import { useInterval } from 'react-use';
import 'moment/locale/ko';
import Compress from "react-image-file-resizer";

const OPTIONS = {
  TRAVERSAL: {
    STUN_TURN: 'stunTurn',
    TURN_ONLY: 'turnOnly',
    DISABLED: 'disabled'
  },
  ROLE: {
    MASTER: 'MASTER',
    VIEWER: 'VIEWER'
  },
  RESOLUTION: {
    WIDESCREEN: 'widescreen',
    FULLSCREEN: 'fullscreen'
  }
};

function onStatsReport(report) {
    // TODO: Publish stats
}

const Viewer = (props) => {
  moment.locale('ko')

  let cnt = 0;
  let captureId = null;
  const localView = useRef(null);
  const viewer = {
    signalingClient: null,
    dataChannel: null,
    localStream: null,
    peerConnectionStatsInterval: null,
    peerConnection: null,
    useTrickleICE: true,
    openDataChannel: true,
    endpoint: null,
    role: OPTIONS.ROLE.VIEWER,
    resolution: OPTIONS.RESOLUTION.WIDESCREEN,
    natTraversal: OPTIONS.TRAVERSAL.STUN_TURN,
    receivedMessages: '',
  };
  const [dataChannel,setDataChannel] = useState();

  useEffect(() => {
    console.log(props);
    startPlayerForViewer(props);
  }, []);

  useInterval(() => {
    let currentTime = moment(); //현재 시간
    let testStartTime = moment(props.startTime);
    let testEndTime = moment(props.endTime);
    // let testStartTime = moment("2021 11 17 22:53");//테스트
    // let testEndTime = moment("2021 11 17 22:55");//테스트
    let startTimeDifference = moment.duration(testStartTime.diff(currentTime)).seconds();
    let endTimeDifference = moment.duration(testEndTime.diff(currentTime)).seconds();
    if(startTimeDifference===0){
      startCapture();
    }
    if(endTimeDifference===0){
      stopCapture();
    }
  }, 1000);
  
  function startCapture(e){
    captureId=setInterval(capture, 3000);
  }
  
  function stopCapture(e){
    clearInterval(captureId);
  }
  
  function capture(e){ //두손 사진 캡쳐 제출
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(mediaStream => {
        // Do something with the stream.
        const track = mediaStream.getVideoTracks()[0];
        let imageCapture = new ImageCapture(track);
  
        imageCapture.takePhoto()
        .then(blob => {console.log(blob); //blob=캡쳐이미지
          Compress.imageFileResizer(
            blob, // the file from input
            640, // width
            480, // height
            "JPG", // compress format WEBP, JPEG, PNG
            70, // quality
            0, // rotation
            (uri) => {
              checkHandDetection(uri)
              console.log(uri);
              // You upload logic goes here
            },
            "base64" // blob or base64 default base64
          );
        })
        .catch(error => console.log(error));
    })
  }
  
  async function checkHandDetection(blob){
    let form = new FormData();
    form.append('hand_img', blob);
    const config = {
      header: {'content-type': 'multipart/form-data'}
    }
 
    await axios
    // .post('http://localhost:5000/hand-detection', form, config) //local test
    .post('https://ai.test-helper.com/hand-detection', form, config)
    .then((result)=>{
      console.log(result);
      if(result.data.result === true){
        cnt=0;
        console.log(cnt, "true");
      }
      else{
        cnt+=1;
        if(cnt === 2){
          console.log(cnt, "false");
          sendMessage();
          cnt=0;
        }
      }
    })
    .catch(()=>{ console.log("hand detection 실패") })
  } 

  function sendMessage() {
    if (dataChannel) {
      try {
        dataChannel.send("HandDetection_False");
        console.log("Message sent to master: HandDetection_False");
      } catch (e) {
          console.error('[VIEWER] Send DataChannel: ', e.toString());
      }
    }
  }

  async function startPlayerForViewer(props, e) {
    console.log("viewer credentials : ",props.credentials);

    // Create KVS client
    console.log('Created KVS client...');
    const kinesisVideoClient = new AWS.KinesisVideo({
      region: props.region,
      endpoint: viewer.endpoint || null,
      correctClockSkew: true,
      accessKeyId: props.accessKey,
      secretAccessKey: props.secretAccessKey,
      sessionToken: props.sessionToken || null
    });
  
    // Get signaling channel ARN
    console.log('Getting signaling channel ARN...');
    const describeSignalingChannelResponse = await kinesisVideoClient
      .describeSignalingChannel({
          ChannelName: props.channelName,
      })
      .promise();
    
    const channelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN;
    console.log('[VIEWER] Channel ARN: ', channelARN);
  
    // Get signaling channel endpoints:
    console.log('Getting signaling channel endpoints...');
    const getSignalingChannelEndpointResponse = await kinesisVideoClient
      .getSignalingChannelEndpoint({
          ChannelARN: channelARN,
          SingleMasterChannelEndpointConfiguration: {
              Protocols: ['WSS','HTTPS'],
              Role: viewer.role, //roleOption.VIEWER
          },
    })
    .promise();
    
    const endpointsByProtocol = getSignalingChannelEndpointResponse.ResourceEndpointList.reduce((endpoints, endpoint) => {
      endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
      return endpoints;
    }, {});  
    console.log('[VIEWER] Endpoints: ', endpointsByProtocol);
  
    // Create Signaling Client
    console.log(`Creating signaling client...`);
    viewer.signalingClient = new window.KVSWebRTC.SignalingClient({
      channelARN,
      channelEndpoint: endpointsByProtocol.WSS,
      role: viewer.role, //roleOption.VIEWER
      region: props.region,
      systemClockOffset: kinesisVideoClient.config.systemClockOffset,
      clientId: props.clientId,
      credentials: {
        accessKeyId: props.accessKey,
        secretAccessKey: props.secretAccessKey,
        sessionToken: props.sessionToken || null
      }
    });
    
    // Get ICE server configuration
    console.log('Creating ICE server configuration...');
    const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
      region: props.region,
      endpoint: endpointsByProtocol.HTTPS,
      correctClockSkew: true,
      accessKeyId: props.accessKey,
      secretAccessKey: props.secretAccessKey,
      sessionToken: props.sessionToken || null
    });
  
    console.log('Getting ICE server config response...');
    const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
          .getIceServerConfig({
              ChannelARN: channelARN,
          })
      .promise();
    
    const iceServers = [];
    if (viewer.natTraversal === OPTIONS.TRAVERSAL.STUN_TURN) {
      console.log('Getting STUN servers...');
      iceServers.push({ urls: `stun:stun.kinesisvideo.${props.region}.amazonaws.com:443` });
    }
    
    if (viewer.natTraversal !== OPTIONS.TRAVERSAL.DISABLED) {
      console.log('Getting TURN servers...');
      getIceServerConfigResponse.IceServerList.forEach(iceServer =>
        iceServers.push({
          urls: iceServer.Uris,
          username: iceServer.Username,
          credential: iceServer.Password,
        }),
      );
    }
    
    const configuration = {
      iceServers,
      iceTransportPolicy: (viewer.natTraversal === OPTIONS.TRAVERSAL.TURN_ONLY) ? 'relay' : 'all',
    };
  
    const resolution = (viewer.resolution === OPTIONS.TRAVERSAL.WIDESCREEN) ? { width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 640 }, height: { ideal: 480 } };
  
    const constraints = {
        video: props.sendVideo ? resolution : false,
        audio: props.sendAudio,
    };
  
    viewer.peerConnection = new RTCPeerConnection(configuration);
    if (viewer.openDataChannel) {
        console.log(`Opened data channel with MASTER.`);
        viewer.dataChannel = viewer.peerConnection.createDataChannel('kvsDataChannel');
        setDataChannel(viewer.dataChannel);
        viewer.peerConnection.ondatachannel = event => {
          event.channel.onmessage = (message) => {
            const timestamp = new Date().toISOString();
            const loggedMessage = `${timestamp} - from MASTER: ${message.data}\n`;
            console.log(loggedMessage);
            viewer.receivedMessages += loggedMessage;
  
          };
        };
    }
  
    // Poll for connection stats
    viewer.peerConnectionStatsInterval = setInterval(
      () => {
        viewer.peerConnection.getStats().then(onStatsReport);
      }, 1000
    );
  
    viewer.signalingClient.on('open', async () => {
      console.log('[VIEWER] Connected to signaling service');
  
      // Get a stream from the webcam, add it to the peer connection, and display it in the local view.
      // If no video/audio needed, no need to request for the sources. 
      // Otherwise, the browser will throw an error saying that either video or audio has to be enabled.
      if (props.sendVideo || props.sendAudio) {
          try {
              viewer.localStream = await navigator.mediaDevices.getUserMedia(constraints);
              console.log(viewer.localStream);
              viewer.localStream.getTracks().forEach(track => viewer.peerConnection.addTrack(track, viewer.localStream));

              localView.current.srcObject = viewer.localStream;
              
          } catch (e) {
              console.error('[VIEWER] Could not find webcam');
              return;
          }
      }
  
      // Create an SDP offer to send to the master
      console.log('[VIEWER] Creating SDP offer');
      await viewer.peerConnection.setLocalDescription(
          await viewer.peerConnection.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
          }),
      );
  
      // When trickle ICE is enabled, send the offer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
      if (viewer.useTrickleICE) {
          console.log('[VIEWER] Sending SDP offer');
          
          viewer.signalingClient.sendSdpOffer(viewer.peerConnection.localDescription);
      }
      console.log('[VIEWER] Generating ICE candidates');
    });
  
    viewer.signalingClient.on('sdpAnswer', async answer => {
      // Add the SDP answer to the peer connection
      console.log('[VIEWER] Received SDP answer');
    
      await viewer.peerConnection.setRemoteDescription(answer);
    });
  
    viewer.signalingClient.on('iceCandidate', candidate => {
      // Add the ICE candidate received from the MASTER to the peer connection
      console.log('[VIEWER] Received ICE candidate');
      viewer.peerConnection.addIceCandidate(candidate);
    });
  
    viewer.signalingClient.on('close', () => {
      console.log('[VIEWER] Disconnected from signaling channel');
    });
  
    viewer.signalingClient.on('error', error => {
      console.error('[VIEWER] Signaling client error: ', error);
    });
  
    // Send any ICE candidates to the other peer
    viewer.peerConnection.addEventListener('icecandidate', ({ candidate }) => {
      if (candidate) {
          console.log('[VIEWER] Generated ICE candidate');
  
          // When trickle ICE is enabled, send the ICE candidates as they are generated.
          if (viewer.useTrickleICE) {
              console.log('[VIEWER] Sending ICE candidate');
              viewer.signalingClient.sendIceCandidate(candidate);
          }
      } else {
          console.log('[VIEWER] All ICE candidates have been generated');
  
          // When trickle ICE is disabled, send the offer now that all the ICE candidates have ben generated.
          if (!viewer.useTrickleICE) {
              console.log('[VIEWER] Sending SDP offer');
              viewer.signalingClient.sendSdpOffer(viewer.peerConnection.localDescription);
              console.log(viewer.signalingClient);
          }
      }
    });
  
    console.log('[VIEWER] Starting viewer connection');
    viewer.signalingClient.open();
    
} 
  
  return (
    <div className="my-5" >
      <video
        className="w-100 output-view"
        ref={localView}
        autoPlay playsInline controls muted
      />
    </div>
  );  
};

export default Viewer;