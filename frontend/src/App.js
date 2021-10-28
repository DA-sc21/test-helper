import './App.css';
import { Route, Switch} from 'react-router-dom';
import Tests from './Tests'
import Main from './Main'
import NavBar from './NavBar'
import TestStudentPre from './student/TestStudentPre'
import Kinesis from './kinesisVideo/Home'
import SetViewer from './kinesisVideo/SetViewer'
import Viewer from './kinesisVideo/Viewer'

function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <Switch>
        <Route path="/kinesis" component={Kinesis} />
        <Route path="/tests/:testId/students/:studentId" component={TestStudentPre} / >
        <Route path='/tests/setting' component={SetViewer}/>
        <Route path='/tests/viewer' component={Viewer} />
        <Route path="/tests" component={Tests} />
        <Route path="/" component={Main} />
      </Switch>
    </div>
  );
}

export default App;
