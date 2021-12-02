import React from "react";
import {  Route } from 'react-router-dom';
import StudentAnswerSheets from './StudentAnswerSheets';

function TestsRouter (props){
    console.log(props);
    let path = props.path;
  
    return (
      <>
        <Route exact path={path+"/students"} 
          render ={()=>
            <StudentAnswerSheets
              path={path} />
          }
        />
      </>
    )
  }
  
  export default TestsRouter;