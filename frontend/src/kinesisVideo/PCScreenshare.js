import React, { useEffect, useRef, useState } from 'react';
import AWS from "aws-sdk";
import { store } from '@risingstack/react-easy-state';
import { Button } from "react-bootstrap";

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

const state = store({
    // These are config params set by the user:
    accessKey: '',
    secretAccessKey: '',
    sessionToken: '',
    region: '',
    role: OPTIONS.ROLE.VIEWER,
    channelName: '',
    clientId: '',
    endpoint: null,
    openDataChannel: true,
    resolution: OPTIONS.RESOLUTION.WIDESCREEN,
    natTraversal: OPTIONS.TRAVERSAL.STUN_TURN,
    useTrickleICE: false,
    messageToSend: '',
    playerIsStarted: false,
  
    // These are set when user starts video; a few of them are only used when you start the stream as MASTER:
    signalingClient: null,
    localStream: null,
    localView: null,
    remoteView: null,
    sreenStream: null, //pc screen share
    dataChannel: null,
    peerConnectionStatsInterval: null,
    peerConnectionByClientId: {},
    dataChannelByClientId: [],
    receivedMessages: '',
});

function onStatsReport(report) {
    // TODO: Publish stats
}

const PCScreenShare = (props) => {
    state.localView = useRef(null);
    state.screenStream = useRef(null);

    return (
      <div>
        <br />
        <div>
        <video
            ref={state.screenStream}
            style={{width: '40%', minHeight: '400px', maxHeight: '100px', border: '2px solid gray', padding: '2%', borderRadius: '10px', position: 'relative'}}
            autoPlay muted
        />
        </div>
        <Button style={{float: 'right', marginRight: '30%'}} onClick={(e) => screenshare(props, e)}>화면 공유하기</Button>
      </div>
    );
};

//PC 화면 공유
function screenshare(props, e){
    navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true
    }).then(function(stream){
        //success
        state.screenStream.current.srcObject = stream;
        state.localStream = stream;

        startPlayerForViewer(props);
    }).catch(function(e){
        //error
        console.log("pc share error");
    });
}

async function startPlayerForViewer(props, e) {
    // Create KVS client
    console.log('Created KVS client...');
    const kinesisVideoClient = new AWS.KinesisVideo({
      region: props.region,
      endpoint: state.endpoint || null,
      correctClockSkew: true,
      accessKeyId: props.accessKey,
      secretAccessKey: props.secretAccessKey,
      sessionToken: state.sessionToken || null
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
              Role: state.role, 
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
    state.signalingClient = new window.KVSWebRTC.SignalingClient({
      channelARN,
      channelEndpoint: endpointsByProtocol.WSS,
      role: state.role, 
      region: props.region,
      systemClockOffset: kinesisVideoClient.config.systemClockOffset,
      clientId: props.clientId,
      credentials: {
        accessKeyId: props.accessKey,
        secretAccessKey: props.secretAccessKey,
        sessionToken: state.sessionToken || null
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
      sessionToken: state.sessionToken || null
    });
  
    console.log('Getting ICE server config response...');
    const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
          .getIceServerConfig({
              ChannelARN: channelARN,
          })
      .promise();
    
    const iceServers = [];
    if (state.natTraversal === OPTIONS.TRAVERSAL.STUN_TURN) {
      console.log('Getting STUN servers...');
      iceServers.push({ urls: `stun:stun.kinesisvideo.${props.region}.amazonaws.com:443` });
    }
    
    if (state.natTraversal !== OPTIONS.TRAVERSAL.DISABLED) {
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
      iceTransportPolicy: (state.natTraversal === OPTIONS.TRAVERSAL.TURN_ONLY) ? 'relay' : 'all',
    };
  
    const resolution = (state.resolution === OPTIONS.TRAVERSAL.WIDESCREEN) ? { width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 640 }, height: { ideal: 480 } };
  
    const constraints = {
        video: state.sendVideo ? resolution : false,
        audio: state.sendAudio,
    };
  
    state.peerConnection = new RTCPeerConnection(configuration);
    if (state.openDataChannel) {
        console.log(`Opened data channel with MASTER.`);
        state.dataChannel = state.peerConnection.createDataChannel('kvsDataChannel');
        state.peerConnection.ondatachannel = event => {
          event.channel.onmessage = (message) => {
            const timestamp = new Date().toISOString();
            const loggedMessage = `${timestamp} - from MASTER: ${message.data}\n`;
            console.log(loggedMessage);
            state.receivedMessages += loggedMessage;
  
          };
        };
    }
  
    // Poll for connection stats
    state.peerConnectionStatsInterval = setInterval(
      () => {
        state.peerConnection.getStats().then(onStatsReport);
      }, 1000
    );
  
    state.signalingClient.on('open', async () => {
      console.log('[VIEWER] Connected to signaling service');
  
      // Put the PC sharing screen in the local stream
      try{
          state.localStream.getTracks().forEach(track => state.peerConnection.addTrack(track, state.localStream));
          state.localView.current.srcObject = state.localStream;

          } catch (e){
              console.log('[PC SCREEN] could not find');
          }
  
      // Create an SDP offer to send to the master
      console.log('[VIEWER] Creating SDP offer');
      await state.peerConnection.setLocalDescription(
          await state.peerConnection.createOffer({
              offerToReceiveAudio: false, //수정
              offerToReceiveVideo: true,
          }),
      );
  
      // When trickle ICE is enabled, send the offer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
      if (state.useTrickleICE) {
          console.log('[VIEWER] Sending SDP offer');
          state.signalingClient.sendSdpOffer(state.peerConnection.localDescription);
      }
      console.log('[VIEWER] Generating ICE candidates');
    });
  
    state.signalingClient.on('sdpAnswer', async answer => {
      // Add the SDP answer to the peer connection
      console.log('[VIEWER] Received SDP answer');
      await state.peerConnection.setRemoteDescription(answer);
    });
  
    state.signalingClient.on('iceCandidate', candidate => {
      // Add the ICE candidate received from the MASTER to the peer connection
      console.log('[VIEWER] Received ICE candidate');
      state.peerConnection.addIceCandidate(candidate);
    });
  
    state.signalingClient.on('close', () => {
      console.log('[VIEWER] Disconnected from signaling channel');
    });
  
    state.signalingClient.on('error', error => {
      console.error('[VIEWER] Signaling client error: ', error);
    });
  
    // Send any ICE candidates to the other peer
    state.peerConnection.addEventListener('icecandidate', ({ candidate }) => {
      if (candidate) {
          console.log('[VIEWER] Generated ICE candidate');
  
          // When trickle ICE is enabled, send the ICE candidates as they are generated.
          if (state.useTrickleICE) {
              console.log('[VIEWER] Sending ICE candidate');
              state.signalingClient.sendIceCandidate(candidate);
          }
      } else {
          console.log('[VIEWER] All ICE candidates have been generated');
  
          // When trickle ICE is disabled, send the offer now that all the ICE candidates have ben generated.
          if (!state.useTrickleICE) {
              console.log('[VIEWER] Sending SDP offer');
              state.signalingClient.sendSdpOffer(state.peerConnection.localDescription);
          }
      }
    });
  
    // As remote tracks are received, add them to the remote view
    state.peerConnection.addEventListener('track', event => {
      console.log('[VIEWER] Received remote track');
      /*if (state.remoteView.current.srcObject) {
          return;
      }
      state.remoteStream = event.streams[0];
      state.remoteView.current.srcObject = state.remoteStream;*/
    });
  
    console.log('[VIEWER] Starting viewer connection');
    state.signalingClient.open();
    
} 

export default PCScreenShare;