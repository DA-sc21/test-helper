import './App.css';
import { Route, Switch} from 'react-router-dom';
import Tests from './Tests'
import Main from './Main'
import NavBar from './NavBar'
import TestStudentPre from './TestStudentPre'
import Kinesis from './kinesisVideo/Home'
import SetViewer from './kinesisVideo/SetViewer'
import Viewer from './kinesisVideo/Viewer'

function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/tests" component={Tests} />
      <Route path="/tests/students" component={TestStudentPre} />
      <Route path="/kinesis" component={Kinesis} />
      
      <Route path='/tests/setting' component={SetViewer}/>
      <Route path='/tests/viewer' component={Viewer} />
      </Switch>
    </div>
  );
}

export default App;
