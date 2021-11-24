import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Switch} from 'react-router-dom';
import Main from './Main';
import NavBar from './component/NavBar';
import Tests from './professor/Tests';
import SuperviseTest from './professor/SuperviseTest';
import TestStudentPre from './student/TestStudentPre';
import SignUp from './professor/SignUp/SignUp';
import Login from './professor/Login/Login';

function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(()=>{
    if(sessionStorage.getItem('username') === null){
      console.log('isLogin:', isLogin)
    } else {
      setIsLogin(true);
      console.log('isLogin:', isLogin)
    }
  })

  return (
    <div className="App">
    {isLogin? <NavBar isLogin={isLogin}></NavBar>: <Login />}
      <Switch>
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/tests/:testId/students/:studentId" component={TestStudentPre} />
        <>
          {/* <NavBar></NavBar> */}
          <Route exact path="/tests/:testId/supervise" component={SuperviseTest} />
          <Route exact path="/tests" component={Tests} />
          <Route exact path="/" component={Main} />
        </>
      </Switch>
    </div>
  );
}

export default App;
