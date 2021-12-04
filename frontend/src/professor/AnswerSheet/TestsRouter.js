import React from "react";
import {  Route } from 'react-router-dom';
import StudentAnswerSheets from './StudentAnswerSheets';

function TestsRouter (props){
    console.log(props);
    let path = props.path;
    let students = props.students;
  
    return (
      <>
        <Route exact path={path+'/unscored/students'} 
          render ={()=>
            <StudentAnswerSheets
              path={path}
              students={students} />
          }
        />
      </>
    )
  }
  
  export default TestsRouter;