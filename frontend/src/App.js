import './App.css';
import { Route } from 'react-router-dom';
import Tests from './Tests'
import Main from './Main'
import NavBar from './NavBar'

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
    </div>
  );
}

export default App;
