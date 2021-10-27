import './App.css';
import { Route } from 'react-router-dom';
import Tests from './Tests'
import Main from './Main'
import NavBar from './NavBar'
import TestStudentPre from './TestStudentPre'
import Kinesis from './kinesisVideo/Home'

function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <Route exact path="/" component={Main} />
      <Route exact path="/tests" component={Tests} />
      <Route path="/tests/students" component={TestStudentPre} / >
      <Route path="/kinesis">
      <Kinesis></Kinesis>
      </Route>
    </div>
  );
}

export default App;
