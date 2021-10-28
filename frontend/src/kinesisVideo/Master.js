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
    role: OPTIONS.ROLE.MASTER,
    channelName: '',
    clientId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    endpoint: null,
    sendVideo: true,
    sendAudio: true,
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
    dataChannel: null,
    peerConnectionStatsInterval: null,
    peerConnectionByClientId: {},
    dataChannelByClientId: [],
    receivedMessages: '',
});

function onStatsReport(report) {
    // TODO: Publish stats
}

const Master = (props) => {

    // In order to modify properties of our <video> components, we need a reference
    // to them in the DOM; first, we declare set them up with the useRef hook. 
    // Later, when we render the <VideoPlayers/> component, we include this reference
    // in the component definition. Finally, we can reference the object properties
    // by state.localView.current.<PROPERTY>:
    state.localView = useRef(null);
    state.remoteView = useRef(null);
  
    // When widget first loads, get saved state values from localStorage:
    useEffect(() => {
      console.log(props);
      state.region=props.location.state.region;
      state.accessKey=props.location.state.accessKey;
      state.secretAccessKey=props.location.state.secretAccessKey;
      state.channelName=props.location.state.channelName;

      startPlayerForMaster();
    }, []);
  
    return (
      <div>
        <h1>Master</h1>
        <br /><br />
        <div className="box">
          <div><h1>시험 응시자 view</h1>
          <video
                className="return-view"
                ref={state.remoteView}
                style={{width: '30%', minHeight: '250px', maxHeight: '100px', position: 'relative' }}
                autoPlay playsInline controls 
              />
          </div>
        </div>
      </div>
    );
};

async function startPlayerForMaster() {
        console.log(state.region, state.accessKey, state.secretAccessKey);

        // Create KVS client
        const kinesisVideoClient = new AWS.KinesisVideo({
            region: state.region,
            endpoint: state.endpoint || null,
            correctClockSkew: true,
            accessKeyId: state.accessKey,
            secretAccessKey: state.secretAccessKey,
            sessionToken: state.sessionToken || null
          });

        // Get signaling channel ARN
        console.log('Getting signaling channel ARN...');
        const describeSignalingChannelResponse = await kinesisVideoClient
            .describeSignalingChannel({
                ChannelName: state.channelName,
            })
            .promise();
            const channelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN;
            console.log('[MASTER] Channel ARN: ', channelARN);

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
          console.log('[MASTER] Endpoints: ', endpointsByProtocol);

        // Create Signaling Client
        console.log(`Creating signaling client...`);
        state.signalingClient = new window.KVSWebRTC.SignalingClient({
            channelARN,
            channelEndpoint: endpointsByProtocol.WSS,
            role: state.role, //roleOption.MASTER
            region: state.region,
            systemClockOffset: kinesisVideoClient.config.systemClockOffset,
            credentials: {
            accessKeyId: state.accessKey,
            secretAccessKey: state.secretAccessKey,
            sessionToken: state.sessionToken || null
            }
        });

        // Get ICE server configuration
        console.log('Creating ICE server configuration...');
        const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
            region: state.region,
            endpoint: endpointsByProtocol.HTTPS,
            correctClockSkew: true,
            accessKeyId: state.accessKey,
            secretAccessKey: state.secretAccessKey,
            sessionToken: state.sessionToken || null
        });

        console.log('Getting ICE server config...');
        const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
                .getIceServerConfig({
                    ChannelARN: channelARN,
                })
            .promise();

            const iceServers = [];
            if (state.natTraversal === OPTIONS.TRAVERSAL.STUN_TURN) {
              console.log('Getting STUN servers...');
              iceServers.push({ urls: `stun:stun.kinesisvideo.${state.region}.amazonaws.com:443` });
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

        // Get a stream from the webcam and display it in the local view. 
        // If no video/audio needed, no need to request for the sources. 
        // Otherwise, the browser will throw an error saying that either video or audio has to be enabled.
        /*if (state.sendVideo || state.sendAudio) {
            try {
              console.log('Getting user media stream...');
              state.localStream = await navigator.mediaDevices.getUserMedia(constraints);
              console.log(typeof(state.localStream));
              
              state.localView.current.srcObject = state.localStream;
              //localView.current.srcObject = appStore.master.localStream;
        
            } catch (e) {
              console.log('Error: ', e);
              console.error('[MASTER] Could not find webcam');
            }
          }*/

          state.signalingClient.on('open', async () => {
            console.log('[MASTER] Connected to signaling service');
          });
    
          state.signalingClient.on('sdpOffer', async (offer, remoteClientId) => {
            console.log('[MASTER] Received SDP offer from client: ' + remoteClientId);
    
            // Create a new peer connection using the offer from the given client
            const peerConnection = new RTCPeerConnection(configuration);
    
            state.peerConnectionByClientId[remoteClientId] = peerConnection;
        
            if (state.openDataChannel) {
              console.log(`Opened data channel with ${remoteClientId}`);
              state.dataChannelByClientId[remoteClientId] = peerConnection.createDataChannel('kvsDataChannel');
              peerConnection.ondatachannel = event => {
                event.channel.onmessage = (message) => {
                  const timestamp = new Date().toISOString();
                  const loggedMessage = `${timestamp} - from ${remoteClientId}: ${message.data}\n`;
                  console.log(loggedMessage);
                  state.receivedMessages += loggedMessage;
                };
              };
            }
    
            // Poll for connection stats
            if (!state.peerConnectionStatsInterval) {
                state.peerConnectionStatsInterval = setInterval(() => peerConnection.getStats().then(onStatsReport), 1000);
              }          
    
            // Send any ICE candidates to the other peer
            peerConnection.addEventListener('icecandidate', ({ candidate }) => {
                if (candidate) {
                  console.log('[MASTER] Generated ICE candidate for client: ' + remoteClientId);
          
                  // When trickle ICE is enabled, send the ICE candidates as they are generated.
                  if (state.useTrickleICE) {
                    console.log('[MASTER] Sending ICE candidate to client: ' + remoteClientId);
                    state.signalingClient.sendIceCandidate(candidate, remoteClientId);
                  }
                } else {
                  console.log('[MASTER] All ICE candidates have been generated for client: ' + remoteClientId);
          
                  // When trickle ICE is disabled, send the answer now that all the ICE candidates have ben generated.
                  if (!state.useTrickleICE) {
                    console.log('[MASTER] Sending SDP answer to client: ' + remoteClientId);
                    state.signalingClient.sendSdpAnswer(peerConnection.localDescription, remoteClientId);
                  }
                }
              });
    
            // As remote tracks are received, add them to the remote view
            peerConnection.addEventListener('track', event => {
                console.log('[MASTER] Received remote track from client: ' + remoteClientId);
                if (state.remoteView.current.srcObject) {
                  return;
                }
                console.log(event.streams.length);
                state.remoteView.current.srcObject = event.streams[0];
              });
    
            // If there's no video/audio, master.localStream will be null. So, we should skip adding the tracks from it.
            if (state.localStream) {
                console.log("There's no audio/video...");
                state.localStream.getTracks().forEach(track => peerConnection.addTrack(track, state.localStream));
              }
              await peerConnection.setRemoteDescription(offer);
    
            // Create an SDP answer to send back to the client
            console.log('[MASTER] Creating SDP answer for client: ' + remoteClientId);
            await peerConnection.setLocalDescription(
                await peerConnection.createAnswer({
                  offerToReceiveAudio: true,
                  offerToReceiveVideo: true,
                }),
              );
    
            // When trickle ICE is enabled, send the answer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
            if (state.useTrickleICE) {
                console.log('[MASTER] Sending SDP answer to client: ' + remoteClientId);
                state.signalingClient.sendSdpAnswer(peerConnection.localDescription, remoteClientId);
              }
              console.log('[MASTER] Generating ICE candidates for client: ' + remoteClientId);
          
            });
          
            state.signalingClient.on('iceCandidate', async (candidate, remoteClientId) => {
              console.log('[MASTER] Received ICE candidate from client: ' + remoteClientId);
    
            // Add the ICE candidate received from the client to the peer connection
            const peerConnection = state.peerConnectionByClientId[remoteClientId];
            peerConnection.addIceCandidate(candidate);
            });

            state.signalingClient.on('close', () => {
                console.log('[MASTER] Disconnected from signaling channel');
            });

            state.signalingClient.on('error', () => {
                console.error('[MASTER] Signaling client error');
            });

            console.log('[MASTER] Starting master connection');
            state.signalingClient.open();    

}

export default Master;