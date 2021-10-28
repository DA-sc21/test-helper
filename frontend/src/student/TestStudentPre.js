import React, { useState ,useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link , Route , BrowserRouter , useParams } from 'react-router-dom';
import axios from "axios";
import TestStudentAgreement from './TestStudentAgreement'
import TestStudentPCSetting from './TestStudentPCSetting'
import TestStudentMobileSetting from './TestStudentMobileSetting'
import TestStudentIdentification from './TestStudentIdentification'
import TestStudentWaiting from './TestStudentWaiting'
import testDatas from '../tests.json'
import { BrowserView, MobileView } from 'react-device-detect';

function TestStudentPre(){
  useEffect(()=>{
    getStudentRoom();
  },[]);

  async function getStudentRoom(){
    await axios
      .get('/tests/'+testId+'/students/'+studentId+'/room')
      .then((result)=>{ 
        console.log(result.data.room)
        console.log(result.data.test) 
      })
      .catch(()=>{ console.log("실패") })
  }
  let {testId, studentId} =useParams();
  console.log(testId,studentId)
  let tests=testDatas
  let [tabCompleted,setTabCompleted]=useState([false,false,false,false,false])
  let tabTitles=["안내사항 & 사전동의","PC화면공유","모바일화면공유 & 모바일마이크공유","본인인증"," 시험대기 "]
  let tabPath=["agreement","pcsetting","mobilesetting","identification","waiting"]

  return(
    <BrowserRouter>
      <BrowserView> {/*PC 화면*/}
      <div> 
        <Nav variant="tabs" defaultActiveKey="link-0">
          {
            tabTitles.map((tabtitle,index)=>{
              return(
                <Nav.Item key={index}>
                  <Nav.Link  as={Link} to ={"/tests/"+testId+"/students/"+studentId+"/"+tabPath[index]} eventKey={"link-"+index}  >{tabtitle +" : "+ tabCompleted[index]}</Nav.Link>
                </Nav.Item>
              )
            })
          }
        </Nav>
        <Route exact path="/tests/:testId/students/:studentId/agreement" 
          render ={()=>
              <TestStudentAgreement 
                test={tests} 
                tabTitles={tabTitles} 
                tabCompleted={tabCompleted} 
                setTabCompleted={setTabCompleted} />
          }
        />
        <Route exact path="/tests/:testId/students/:studentId/pcsetting" 
          render ={()=>
            <TestStudentPCSetting 
              test={tests} 
              tabTitles={tabTitles} 
              tabCompleted={tabCompleted} 
              setTabCompleted={setTabCompleted} />
          }
        />
        <Route exact path="/tests/:testId/students/:studentId/mobilesetting" 
          render ={()=>
            <TestStudentMobileSetting 
              test={tests} 
              tabTitles={tabTitles} 
              tabCompleted={tabCompleted} 
              setTabCompleted={setTabCompleted} />
          }
        />
        <Route exact path="/tests/:testId/students/:studentId/identification" 
          render ={()=>
            <TestStudentIdentification 
              test={tests} 
              tabTitles={tabTitles} 
              tabCompleted={tabCompleted} 
              setTabCompleted={setTabCompleted} />
          }
        />
        <Route exact path="/tests/:testId/students/:studentId/waiting" 
          render ={()=>
            <TestStudentWaiting 
              test={tests} 
              tabTitles={tabTitles} 
              tabCompleted={tabCompleted} 
              setTabCompleted={setTabCompleted} />
          }
        />
      </div>
      </BrowserView>
      <MobileView> {/*모바일 화면*/}
        <div style={{marginTop: '25%', marginLeft:'3%', marginRight: '3%'}}>
          <p style={{marginBottom: '1%', fontSize: '20px', fontWeight: 'bold'}}>안녕하세요. O O O 시험</p>
          <p style={{marginBottom: '30%', fontSize: '20px', fontWeight: 'bold'}}>응시 환경 세팅 화면입니다.</p>
          <Button variant="primary"><Link to ="/tests/setting" style={{textDecorationLine: 'none', color: 'white'}}>핸드폰 카메라 설정</Link></Button>
        </div>
      </MobileView>
    </BrowserRouter>
  )
}

export default TestStudentPre
