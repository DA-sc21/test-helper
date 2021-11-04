import React from "react";
import {  Route } from 'react-router-dom';
import TestStudentAgreement from './TestStudentAgreement'
import TestStudentPCSetting from './TestStudentPCSetting'
import TestStudentMobileSetting from './TestStudentMobileSetting'
import TestStudentIdentification from './TestStudentIdentification'
import TestStudentWaiting from './TestStudentWaiting'
import SetViewer from '../kinesisVideo/SetViewer';

function TestStudentRouter (props){
  let path=props.path
  let test=props.test
  let tabTitles=props.tabTitles
  let tabCompleted=props.tabCompleted
  let setTabCompleted=props.setTabCompleted
  let credentials=props.credentials

  return (
    <>
      <Route exact path={path+"/agreement"} 
        render ={()=>
          <TestStudentAgreement 
            test={test} 
            tabTitles={tabTitles} 
            tabCompleted={tabCompleted} 
            setTabCompleted={setTabCompleted} />
        }
      />
      <Route exact path={path+"/pcsetting"}
        render ={()=>
          <TestStudentPCSetting 
            test={test} 
            tabTitles={tabTitles} 
            tabCompleted={tabCompleted} 
            setTabCompleted={setTabCompleted}
            credentials={credentials} />
        }
      />
      <Route exact path={path+"/mobilesetting"}
        render ={()=>
          <TestStudentMobileSetting 
            test={test} 
            tabTitles={tabTitles} 
            tabCompleted={tabCompleted} 
            setTabCompleted={setTabCompleted}
            credentials={credentials} />
        }
      />
      <Route exact path={path+"/identification"}
        render ={()=>
          <TestStudentIdentification 
            test={test} 
            credentials={credentials}
            tabTitles={tabTitles} 
            tabCompleted={tabCompleted} 
            setTabCompleted={setTabCompleted} />
        }
      />
      <Route exact path={path+"/waiting"}
        render ={()=>
          <TestStudentWaiting 
            test={test} 
            credentials={credentials}
            tabTitles={tabTitles} 
            tabCompleted={tabCompleted} 
            setTabCompleted={setTabCompleted} />
        }
      />
      <Route exact path={path+"/setting"}
        render ={()=>
          <SetViewer 
            test={test} 
            credentials={credentials}
            tabTitles={tabTitles} 
            tabCompleted={tabCompleted} 
            setTabCompleted={setTabCompleted} />
        }
      />
    </>
  )
}

export default TestStudentRouter