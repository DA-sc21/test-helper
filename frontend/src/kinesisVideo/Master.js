import React, { useEffect, useRef, useState } from 'react';
import { store, view } from '@risingstack/react-easy-state';
import AWS from "aws-sdk";
import moment from 'moment';
import { Button,Form } from 'react-bootstrap';

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

const Master = (props) => {
  const remoteView = useRef(null);
  const pcView = useRef(null);
  const [isAudioShare, setIsAudioShare] = useState(false); //모바일 마이크 공유 여부
  const [isPcShare, setIsPcShare] = useState(false); //PC 화면 공유 여부
  let [Messages,setMessages]=useState("")
  let [dataChannels,setdataChannels]=useState({})
  let [peerconnections,setpeerconnections]=useState({})
  const master = {
    signalingClient: null,
    peerConnectionByClientId: {},
    dataChannelByClientId: {},
    localStream: null,
    remoteStreams: [],
    peerConnectionStatsInterval: null,
    role: OPTIONS.ROLE.MASTER,
    endpoint: null,
    openDataChannel: true,
    resolution: OPTIONS.RESOLUTION.WIDESCREEN,
    natTraversal: OPTIONS.TRAVERSAL.STUN_TURN,
    useTrickleICE: false,
    receivedMessages: '',
  };

  useEffect(() => {
    console.log(props);
    startMaster(props);
  }, []);

  async function startMaster(props,e) {
    // Create KVS client
    const kinesisVideoClient = new AWS.KinesisVideo({
        region: props.region,
        endpoint: master.endpoint || null,
        correctClockSkew: true,
        accessKeyId: props.credentials.accessKeyId,
        secretAccessKey: props.credentials.secretAccessKey,
        sessionToken: props.credentials.sessionToken || null
    });

    // Get signaling channel ARN
    console.log('Getting signaling channel ARN...');
    const describeSignalingChannelResponse = await kinesisVideoClient
        .describeSignalingChannel({
            ChannelName: props.testRooms,
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
                Role: master.role, //roleOption.MASTER
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
    master.signalingClient = new window.KVSWebRTC.SignalingClient({
        channelARN,
        channelEndpoint: endpointsByProtocol.WSS,
        role: master.role, //roleOption.MASTER
        region: props.region,
        systemClockOffset: kinesisVideoClient.config.systemClockOffset,
        credentials: {
        accessKeyId: props.credentials.accessKeyId,
        secretAccessKey: props.credentials.secretAccessKey,
        sessionToken: props.credentials.sessionToken || null
        }
    });

    // Get ICE server configuration
    console.log('Creating ICE server configuration...');
    const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
        region: props.region,
        endpoint: endpointsByProtocol.HTTPS,
        correctClockSkew: true,
        accessKeyId: props.credentials.accessKeyId,
        secretAccessKey: props.credentials.secretAccessKey,
        sessionToken: props.credentials.sessionToken || null
    });

    console.log('Getting ICE server config...');
    const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
            .getIceServerConfig({
                ChannelARN: channelARN,
            })
            .promise();

    const iceServers = [];
    if (master.natTraversal === OPTIONS.TRAVERSAL.STUN_TURN) {
        console.log('Getting STUN servers...');
        iceServers.push({ urls: `stun:stun.kinesisvideo.${props.region}.amazonaws.com:443` });
    }
        
    if (master.natTraversal !== OPTIONS.TRAVERSAL.DISABLED) {
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
      iceTransportPolicy: (master.natTraversal === OPTIONS.TRAVERSAL.TURN_ONLY) ? 'relay' : 'all',
    };
          
    const resolution = (master.resolution === OPTIONS.TRAVERSAL.WIDESCREEN) ? { width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 640 }, height: { ideal: 480 } };
          
    master.signalingClient.on('open', async () => {
      console.log('[MASTER] Connected to signaling service');
    });
  
    master.signalingClient.on('sdpOffer', async (offer, remoteClientId) => {
      console.log('[MASTER] Received SDP offer from client: ' + remoteClientId);
  
      // Create a new peer connection using the offer from the given client
      const peerConnection = new RTCPeerConnection(configuration);
  
      master.peerConnectionByClientId[remoteClientId] = peerConnection;
      setpeerconnections(peerConnection)
      if (master.openDataChannel) {
        console.log(`Opened data channel with ${remoteClientId}`);
        master.dataChannelByClientId[remoteClientId] = peerConnection.createDataChannel('kvsDataChannel');
        setdataChannels(peerConnection.createDataChannel('kvsDataChannel'))
        peerConnection.ondatachannel = event => {
          event.channel.onmessage = (message) => {
            console.log(message)
            const loggedMessage = `${message.data}\n`;
            console.log(loggedMessage);
            setMessages(loggedMessage)
            master.receivedMessages += loggedMessage;
          };
        };
      }
  
      // Poll for connection stats
      if (!master.peerConnectionStatsInterval) {
          master.peerConnectionStatsInterval = setInterval(() => peerConnection.getStats().then(onStatsReport), 1000);
      }          
  
      // Send any ICE candidates to the other peer
      peerConnection.addEventListener('icecandidate', ({ candidate }) => {
          if (candidate) {
            console.log('[MASTER] Generated ICE candidate for client: ' + remoteClientId);
        
            // When trickle ICE is enabled, send the ICE candidates as they are generated.
            if (master.useTrickleICE) {
              console.log('[MASTER] Sending ICE candidate to client: ' + remoteClientId);
              master.signalingClient.sendIceCandidate(candidate, remoteClientId);
            }
          } else {
            console.log('[MASTER] All ICE candidates have been generated for client: ' + remoteClientId);
        
            // When trickle ICE is disabled, send the answer now that all the ICE candidates have ben generated.
            if (!master.useTrickleICE) {
              console.log('[MASTER] Sending SDP answer to client: ' + remoteClientId);
              master.signalingClient.sendSdpAnswer(peerConnection.localDescription, remoteClientId);
              console.log(master.signalingClient, remoteClientId);
            }
          }
      });
  
      // As remote tracks are received, add them to the remote view
      peerConnection.addEventListener('track', event => {
          console.log('[MASTER] Received remote track from client: ' + remoteClientId);
          
          if(remoteClientId.indexOf('PC')!=-1){ //pc인 경우
            pcView.current.srcObject = event.streams[0];
          }
          else if(remoteClientId.indexOf('MO')!=-1){ //mobile인 경우
            remoteView.current.srcObject = event.streams[0];
            event.track.onunmute = () => {
              console.log("마이크 on");
              if(event.track.kind == "audio"){
                setIsAudioShare(true);
              }
            }
          }
      });

      peerConnection.addEventListener("connectionstatechange", ev => {
        if(remoteClientId.indexOf('PC')!=-1){
          switch(peerConnection.connectionState) {
            case "connected":
              setIsPcShare(true);
              console.log('pc connect');
              break;
            case "disconnected":
              setIsPcShare(false);
              console.log('pc connection disconnected');
            case "failed":
              setIsPcShare(false);
              console.log('pc connection failed');
              break;
            case "closed":
              setIsPcShare(false);
              console.log('pc connection closed');
              break;
          }
        }
      }, false);
  
      // If there's no video/audio, master.localStream will be null. So, we should skip adding the tracks from it.
      if (master.localStream) {
          console.log("There's no audio/video...");
          master.localStream.getTracks().forEach(track => peerConnection.addTrack(track, master.localStream));
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
      if (master.useTrickleICE) {
          console.log('[MASTER] Sending SDP answer to client: ' + remoteClientId);
          master.signalingClient.sendSdpAnswer(peerConnection.localDescription, remoteClientId);
      }
      console.log('[MASTER] Generating ICE candidates for client: ' + remoteClientId);
        
    });
        
    master.signalingClient.on('iceCandidate', async (candidate, remoteClientId) => {
        console.log('[MASTER] Received ICE candidate from client: ' + remoteClientId);
  
        // Add the ICE candidate received from the client to the peer connection
        const peerConnection = master.peerConnectionByClientId[remoteClientId];
        peerConnection.addIceCandidate(candidate);
    });

    master.signalingClient.on('close', () => {
        console.log('[MASTER] Disconnected from signaling channel');
    });

    master.signalingClient.on('error', () => {
        console.error('[MASTER] Signaling client error');
    });

    console.log('[MASTER] Starting master connection');
    master.signalingClient.open();
           
  }

  function sendMessage() {
    console.log(dataChannels,peerconnections)
    try {
      const timestamp = moment().format("HH:mm:ss");
      const loggedMessage = `${timestamp} Master: ${master.messageToSend}\n`;
  
      dataChannels.send(Messages+=loggedMessage);
      // Messages+=master.messageToSend
      setMessages(Messages)
      console.log(`Message sent to viewer: ${master.messageToSend}`);
    } catch (e) {
        console.error('[MASTER] Send DataChannel: ', e.toString());
    }
  }

  function updateState(key, value) {
    master[key] = value;
    var localKey = `kvs-widget-${key}`;
    //console.log(`Setting ${localKey} = `, value);
    localStorage.setItem(localKey, value);
  }


  return (
    <div>
      <video
          className="return-view"
          ref={remoteView}
          style={{width: '100%', height: '280px'}}
          autoPlay playsInline controls 
      />
      <video
          className="return-view"
          ref={pcView}
          style={{width: '100%', height: '280px'}}
          autoPlay playsInline controls 
      />
      <div className="row">
        <div className="col-md-12">
        {isPcShare === true ? <img style ={{width: '40px', height: '40px', float: 'right', marginRight: '3%'}} src="/img/pc_on.png" /> : <img style ={{width: '40px', height: '40px', float: 'right', marginRight: '3%'}} src="/img/pc_off.png" />}
        {isAudioShare === true ? <img style ={{width: '40px', height: '40px', float: 'right', marginRight: '3%'}} src="/img/audio_on.png" /> : <img style ={{width: '38px', height: '38px', float: 'right', marginRight: '3%'}} src="/img/audio_off.png" />}
        </div>
      </div>
      <div className="row">
        <div className="col-md-10">
          <Form.Control as="textarea" 
            placeholder="메시지를 입력하세요."
            id="messageToSend"
            onChange={(e) => updateState('messageToSend', e.target.value)}
            value={master.messageToSend} />
          {/* <textarea
            id="messageToSend"
            label="DataChannel Message"
            onChange={(e) => updateState('messageToSend', e.target.value)}
            value={master.messageToSend} 
          /> */}
        </div>
        <div className="col-md-2">
          <Button id="startPlayer" variant="primary" onClick={sendMessage}>
            전송
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Form.Control
            as="textarea"
            id="receivedMessages"
            label="received messages"
            value={Messages}
            disabled={true}
            readOnly/>
          </div>
        </div>
    </div>
  );
};

export default Master;