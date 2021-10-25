import './App.css';
import { Route } from 'react-router-dom';
import Tests from './Tests'
import Main from './Main'
import NavBar from './NavBar'
import Kinesis from './kinesisVideo/Home'

function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <Route exact path="/">
        <Main></Main>
      </Route>
      <Route path="/tests">
        <Tests></Tests>
      </Route>
      <Route path="/kinesis">
      <Kinesis></Kinesis>
      </Route>
    </div>
  );
}

export default App;
