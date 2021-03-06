import React from "react";
import {  Route } from 'react-router-dom';
import Assistant from './Assistant';
import Student from './Student';
import Test from './Test';

function CourseRouter (props){
  console.log(props);
  let path = props.path;
  let assistant = props.assistant;
  let courseName = props.courseName;

  return (
    <>
      <Route exact path={path+"/assistants"} 
        render ={()=>
          <Assistant
            path={path}
            assistant={assistant} />
        }
      />

      <Route exact path={path+"/tests"} 
        render ={()=>
          <Test
            path={path} 
            courseName={courseName}
            assistant={assistant} />
        }
      />

      <Route exact path={path+"/students"} 
        render ={()=>
          <Student
            path={path} />
        }
      />
    </>
  )
}

export default CourseRouter;
