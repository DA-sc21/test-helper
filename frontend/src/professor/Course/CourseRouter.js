import React from "react";
import {  Route } from 'react-router-dom';
import Assistant from './Assistant';

function CourseRouter (props){
  console.log(props);
  let path = props.path;
  let assistant = props.assistant;

  return (
    <>
      <Route exact path={path+"/assistants"} 
        render ={()=>
          <Assistant
            assistant={assistant} />
        }
      />
    </>
  )
}

export default CourseRouter;
