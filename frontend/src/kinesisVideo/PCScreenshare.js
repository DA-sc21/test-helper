import React, { useEffect, useRef, useState } from 'react';
import AWS from "aws-sdk";
import { store } from '@risingstack/react-easy-state';
import { Button } from "react-bootstrap";
import moment from 'moment';

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

const PCScreenShare = (props) => {
  const localView = useRef(null);
  const screenStream = useRef(null);
  let [Messages,setMessages]=useState("")
  let [dataChannels,setdataChannels]=useState({})
  let [peerconnections,setpeerconnections]=useState({})
  const viewer = {
    signalingClient: null,
    dataChannel: null,
    localStream: null,
    peerConnectionStatsInterval: null,
    peerConnection: null,
    useTrickleICE: false,
    openDataChannel: true,
    endpoint: null,
    role: OPTIONS.ROLE.VIEWER,
    resolution: OPTIONS.RESOLUTION.WIDESCREEN,
    natTraversal: OPTIONS.TRAVERSAL.STUN_TURN,
    receivedMessages: '',
  };

  function screenshare(props, e){
    navigator.mediaDevices.getDisplayMedia({
      audio: false, //audio 없음
      video: true
    }).then(function(stream){
        //success
        stream.getVideoTracks()[0].addEventListener('ended', () => {
          console.log('screensharing has ended')
          stopPlayerForViewer();
        });
        screenStream.current.srcObject = stream;
        viewer.localStream = stream;
        startViewer(props);
    }).catch(function(e){
        //error
        console.log("pc share error");
    });
  }

  async function startViewer(props) {
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
              Role: viewer.role, 
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
      role: viewer.role, 
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
  
    viewer.peerConnection = new RTCPeerConnection(configuration);
    setpeerconnections(viewer.peerConnection)
    if (viewer.openDataChannel) {
        console.log(`Opened data channel with MASTER.`);
        
        viewer.dataChannel = viewer.peerConnection.createDataChannel('kvsDataChannel');
        setdataChannels(viewer.dataChannel)
        viewer.peerConnection.ondatachannel = event => {
          event.channel.onmessage = (message) => {
            console.log(message)
            const loggedMessage = `${message.data}\n`;
            setMessages( loggedMessage)
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
  
      // Put the PC sharing screen in the local stream
      try{
        console.log(viewer.localStream);
        viewer.localStream.getTracks().forEach(track => viewer.peerConnection.addTrack(track, viewer.localStream));
        localView.current.srcObject = viewer.localStream; 

        } catch (e){
          console.log('[PC SCREEN] could not find');
        }
  
      // Create an SDP offer to send to the master
      console.log('[VIEWER] Creating SDP offer');
      await viewer.peerConnection.setLocalDescription(
          await viewer.peerConnection.createOffer({
              offerToReceiveAudio: false, //수정
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
          }
      }
    });
  
    console.log('[VIEWER] Starting viewer connection');
    viewer.signalingClient.open();
    
  }
  
  function stopPlayerForViewer() {

    console.log('[VIEWER] Stopping viewer connection');
    if (viewer.signalingClient) {
      viewer.signalingClient.close();
      viewer.signalingClient = null;
    }
  
    if (viewer.peerConnection) {
      viewer.peerConnection.close();
      viewer.peerConnection = null;
    }
  
    if (viewer.localStream) {
      viewer.localStream.getTracks().forEach(track => track.stop());
      viewer.localStream = null;
    }
  
    if (viewer.peerConnectionStatsInterval) {
        clearInterval(viewer.peerConnectionStatsInterval);
        viewer.peerConnectionStatsInterval = null;
    }
  
    if (viewer.dataChannel) {
      viewer.dataChannel = null;
    }
  }
  function sendMessage() {
    console.log(viewer)
    try {
      const timestamp = moment().format("HH:mm:ss");
      const loggedMessage = `${timestamp}!@#Viewer!@#${viewer.messageToSend}\n`;
  
      dataChannels.send(Messages+=loggedMessage);
      // Messages+=viewer.messageToSend
      setMessages(Messages)

      console.log(`Message sent to master: ${viewer.messageToSend}`);
    } catch (e) {
        console.error('[viewer] Send DataChannel: ', e.toString());
    }
  }
  
  function updateState(key, value) {
    viewer[key] = value;
    var localKey = `kvs-widget-${key}`;
    localStorage.setItem(localKey, value);
  }

  return (
    <div>
      <br />
      <div>
      <video
          ref={screenStream}
          style={{width: '40%', minHeight: '400px', maxHeight: '100px', border: '2px solid gray', padding: '2%', borderRadius: '10px', position: 'relative'}}
          autoPlay muted
      />
      </div>
      <Button style={{float: 'right', marginRight: '30%'}} onClick={(e) => screenshare(props, e)}>화면 공유하기</Button>
      <textarea
          id="messageToSend"
          label="DataChannel Message"
          onChange={(e) => updateState('messageToSend', e.target.value)}
          value={viewer.messageToSend} 
        />
        <br/><br/>
        <Button id="startPlayer" variant="contained" color="primary" onClick={sendMessage}>
        Send Message
      </Button>
      <br/><br/><br/>
      <textarea
          id="receivedMessages"
          label="received messages"
          value={Messages}
          size='small'
          disabled={true}
          variant="outlined"
          />
    </div>
  );
};

export default PCScreenShare;