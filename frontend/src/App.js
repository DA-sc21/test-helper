import './App.css';
import { Route, Switch, Redirect} from 'react-router-dom';
import Main from './Main';
import NavBar from './component/NavBar';
import Tests from './professor/Tests';
import SuperviseTest from './professor/SuperviseTest';
import TestStudentPre from './student/TestStudentPre';
import SignUp from './professor/SignUp/SignUp';
import Login from './professor/Login/Login';

function App() {
  let isAuthorized = localStorage.getItem("isAuthorized");
  return (
    <div className="App">
      {!isAuthorized ? <Redirect to="/login" /> : <Redirect to="/" />}
      <Switch>
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/tests/:testId/students/:studentId" component={TestStudentPre} />
        <>
          <NavBar></NavBar>
          <Route exact path="/tests/:testId/supervise" component={SuperviseTest} />
          <Route exact path="/tests" component={Tests} />
          <Route exact path="/" component={Main} />
        </>
      </Switch>
    </div>
  );
}

export default App;
