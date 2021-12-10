import './App.css';
import { Route, Switch, Redirect} from 'react-router-dom';
import Main from './Main';
import NavBar from './component/NavBar';
import Tests from './professor/Tests';
import SuperviseTest from './professor/SuperviseTest';
import TestStudentPre from './student/TestStudentPre';
import SignUp from './professor/SignUp/SignUp';
import Login from './professor/Login/Login';
import CreateProblems from './professor/CreateProblems';
import Course from './professor/Course/Course';
import CourseInfo from './professor/Course/CourseInfo';
import AdminLogin from './admin/adminLogin/AdminLogin';
import AdminCourseList from './admin/Course/CourseList';
import UnscoredTest from './professor/AnswerSheet/UnscoredTests';

function App() {
  let isAuthorized = sessionStorage.getItem("isAuthorized");
  return (
    <div className="App">
      <Switch>
        <Route path="/tests/:testId/students/:studentId" component={TestStudentPre} />
        <Route exact path="/admin/courses" component={AdminCourseList} />
        <Route path="/admin" component= {AdminLogin} />
        <>
          {!isAuthorized ? <Redirect to="/login" /> : <></>}
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
          <NavBar></NavBar>
          <Route exact path="/tests/:testId/problems" component={CreateProblems} />
          <Route exact path="/tests/:testId/supervise" component={SuperviseTest} />
          <Route exact path="/courses" component={Course} />
          <Route path="/courses/:courseId" component={CourseInfo} />
          <Route path="/tests/:testId/unscored" component={UnscoredTest} />
          <Route exact path="/tests" component={Tests} />
          <Route exact path="/" component={Main} />
        </>
      </Switch>
    </div>
  );
}

export default App;