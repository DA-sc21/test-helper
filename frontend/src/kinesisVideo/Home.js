import React, { useEffect, useRef, useState } from 'react';
import { Switch , withRouter } from "react-router";
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { Link } from "react-router-dom";
import { store } from '@risingstack/react-easy-state';
import { Form, Button  } from 'react-bootstrap';
import Master from './Master';
import Viewer from './Viewer';
import SetViewer from './SetViewer';

const Home = () => {
  const [state, setState] = useState([]);

  let onChangehandler = (e) => {
    let { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    })
  }

  return (
    <Router>
    <div>
      <h4>Region</h4>
      <Form.Control type="text" name="region" onChange={(e)=>onChangehandler(e)} />
      <h4>AccessKeyID</h4>
      <Form.Control type="text" name="accessKey" onChange={(e)=>onChangehandler(e)} />
      <h4>SecretAccessKey</h4>
      <Form.Control type="text" name="secretAccessKey" onChange={(e)=>onChangehandler(e)} />
      <h4>channel Name</h4>
      <Form.Control type="text" name="channelName" onChange={(e)=>onChangehandler(e)} />
      
      <br></br>

      <Button variant="light"><Link to ={{pathname: "/kinesis/master", state:{region: state.region, accessKey: state.accessKey, secretAccessKey: state.secretAccessKey, channelName: state.channelName } }}>Master</Link></Button>
      <Button variant="light"><Link to ={{pathname: "/kinesis/setviewer", state:{region: state.region, accessKey: state.accessKey, secretAccessKey: state.secretAccessKey, channelName: state.channelName } }}>Viewer</Link></Button>

      <Switch>
        <Route exact path='/kinesis/master' component={Master}/>
        <Route exact path='/kinesis/viewer' component={Viewer}/>
        <Route exact path='/kinesis/setviewer' component={SetViewer}/>
      </Switch>
    </div>
    </Router>
  );
}

export default Home;
