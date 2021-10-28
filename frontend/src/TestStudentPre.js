import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link,Route,BrowserRouter } from 'react-router-dom';
import TestStudentAgreement from './TestStudentAgreement'
import TestStudentPCSetting from './TestStudentPCSetting'
import TestStudentMobileSetting from './TestStudentMobileSetting'
import TestStudentIdentification from './TestStudentIdentification'
import TestStudentWaiting from './TestStudentWaiting'
import testDatas from './tests.json'
import { BrowserView, MobileView } from 'react-device-detect';

function TestStudentPre(){
  let tests=testDatas
  let [tabCompleted,setTabCompleted]=useState([false,false,false,false,false])
  let tabTitles=["안내사항 & 사전동의","PC화면공유","모바일화면공유 & 모바일마이크공유","본인인증"," 시험대기 "]
  let tabPath=["agreement","pcsetting","mobilesetting","identification","waiting"]
  let components={
    0 : TestStudentAgreement,
    1 : TestStudentPCSetting,
    2 : TestStudentMobileSetting,
    3 : TestStudentIdentification,
    4 : TestStudentWaiting
  }
  return(
    <BrowserRouter>
      <BrowserView> {/*PC 화면*/}
        <div> 
          <h4 className="mb-5">이 페이지(대학생 시험준비)에선 위의 Navbar는 없을 예정.</h4>
          <hr></hr>
          <Nav variant="tabs" defaultActiveKey="link-0">
            {
              tabTitles.map((tabtitle,index)=>{
                return(
                  <Nav.Item key={index}>
                    <Nav.Link  as={Link} to ={"/tests/students/"+tabPath[index]} eventKey={"link-"+index}  >{tabtitle +" : "+ tabCompleted[index]}</Nav.Link>
                  </Nav.Item>
                )
              })
            }
          </Nav>
          {  
            tabTitles.map((tabtitle,index)=>{
            let Content = components[index]
            return(
              <Route exact path={"/tests/students/"+tabPath[index]} component={components[index]} >
                <Content 
                  test={tests} 
                  tabTitles={tabTitles} 
                  tabCompleted={tabCompleted} 
                  setTabCompleted={setTabCompleted}>
                </Content>
              </Route>
            )
          })
          }
        </div>
      </BrowserView>
      <MobileView> {/*모바일 화면*/}
        <h5>대학생 모바일 접속 페이지 입니다</h5>
      </MobileView>
    </BrowserRouter>
  )
}

export default TestStudentPre
