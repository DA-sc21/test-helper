import React, { useEffect, useRef } from 'react';
import { store, view } from '@risingstack/react-easy-state';
import AWS from "aws-sdk";

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
  //sendVideo: true,
  //sendAudio: true,
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
  zdataChannel: null,
  peerConnectionStatsInterval: null,
  peerConnectionByClientId: {},
  dataChannelByClientId: [],
  receivedMessages: '',
});

function onStatsReport(report) {
    // TODO: Publish stats
}

const Viewer = (props) => {
  state.localView = useRef(null);
  state.remoteView = useRef(null);

  useEffect(() => {
    console.log(props);
    startPlayerForViewer(props);
  }, []);
  
  return (
    <div>
      <div style={{marginTop: '8%'}}>
          <video
            className="output-view"
            ref={state.localView}
            style={{width: '80%', minHeight: '250px', maxHeight: '100px' }}
            autoPlay playsInline controls muted
          />
      </div>
    </div>
  );  
};

async function startPlayerForViewer(props, e) {
    console.log(props.location.state);

    // Create KVS client
    console.log('Created KVS client...');
    const kinesisVideoClient = new AWS.KinesisVideo({
      region: props.location.state.region,
      endpoint: state.endpoint || null,
      correctClockSkew: true,
      accessKeyId: props.location.state.accessKey,
      secretAccessKey: props.location.state.secretAccessKey,
      sessionToken: state.sessionToken || null
    });
  
    // Get signaling channel ARN
    console.log('Getting signaling channel ARN...');
    const describeSignalingChannelResponse = await kinesisVideoClient
      .describeSignalingChannel({
          ChannelName: props.location.state.channelName,
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
              Role: state.role, //roleOption.MASTER
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
      role: state.role, //roleOption.MASTER
      region: props.location.state.region,
      systemClockOffset: kinesisVideoClient.config.systemClockOffset,
      clientId: props.location.state.clientId,
      credentials: {
        accessKeyId: props.location.state.accessKey,
        secretAccessKey: props.location.state.secretAccessKey,
        sessionToken: state.sessionToken || null
      }
    });
    
    // Get ICE server configuration
    console.log('Creating ICE server configuration...');
    const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
      region: props.location.state.region,
      endpoint: endpointsByProtocol.HTTPS,
      correctClockSkew: true,
      accessKeyId: props.location.state.accessKey,
      secretAccessKey: props.location.state.secretAccessKey,
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
      iceServers.push({ urls: `stun:stun.kinesisvideo.${props.location.state.region}.amazonaws.com:443` });
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
        video: props.location.state.sendVideo ? resolution : false,
        audio: props.location.state.sendAudio,
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
  
    /// REVIEW BELOW HERE
  
    state.signalingClient.on('open', async () => {
      console.log('[VIEWER] Connected to signaling service');
  
      // Get a stream from the webcam, add it to the peer connection, and display it in the local view.
      // If no video/audio needed, no need to request for the sources. 
      // Otherwise, the browser will throw an error saying that either video or audio has to be enabled.
      if (props.location.state.sendVideo || props.location.state.sendAudio) {
          try {
              state.localStream = await navigator.mediaDevices.getUserMedia(constraints);
              console.log(state.localStream);
              state.localStream.getTracks().forEach(track => state.peerConnection.addTrack(track, state.localStream));

              state.localView.current.srcObject = state.localStream;
          } catch (e) {
              console.error('[VIEWER] Could not find webcam');
              return;
          }
      }
  
      // Create an SDP offer to send to the master
      console.log('[VIEWER] Creating SDP offer');
      await state.peerConnection.setLocalDescription(
          await state.peerConnection.createOffer({
              offerToReceiveAudio: true,
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

export default Viewer;