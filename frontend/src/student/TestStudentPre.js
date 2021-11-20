import React, { useState ,useEffect } from 'react';
import { Nav , Button } from 'react-bootstrap';
import { Link , useParams ,useHistory } from 'react-router-dom';
import axios from "axios";
import { BrowserView, MobileView } from 'react-device-detect';
import TestStudentRouter from './TestStudentRouter';
import Loading from '../component/Loading';
import NavBarStudent from '../component/NavBarStudent';
import "../component/Chat.css"
import {baseUrl} from "../component/baseUrl"

function TestStudentPre(){
  useEffect(()=>{
    getStudentRoom();
  },[]);
  
  let {testId, studentId} =useParams();
  let [room,setRoom]=useState();
  let [student,setStudent]=useState();
  let [test,setTest]=useState();
  let [credentials,setCredentials]=useState();
  let [mobileAgreement,setmobileAgreement]=useState(false);
  let [loading,setLoading] = useState(false)
  let [video, setVideo] = useState(false);
  let [audio, setAudio] = useState(false);
  let [tabCompleted,setTabCompleted]=useState([false,false,false,false,false])
  let tabTitles=["안내사항 & 사전동의","PC화면공유","모바일화면공유 & 모바일마이크공유","본인인증"," 시험대기 "]
  let tabPath=["agreement","pcsetting","mobilesetting","identification","waiting"]
  let history = useHistory()
  let path="/tests/:testId/students/:studentId"

  let changeVideo = (e) => {
    setVideo(e.target.checked)
    console.log('카메라 공유 여부:', e.target.checked)
  } 

  let changeAudio = (e) => {
    setAudio(e.target.checked)
    console.log('마이크 공유 여부:', e.target.checked)
  }

  async function getStudentRoom(){
    await axios
    .get(baseUrl+'/tests/'+testId+'/students/'+studentId+'/room')
    .then((result)=>{ 
      setCredentials(result.data.credentials)
      setRoom(result.data.room)
      setStudent(result.data.room.student)
      setTest(result.data.room.test)
      setLoading(true);
      console.log(result.data);
    })
    .catch(()=>{ console.log("실패") })
  }
  
  if(!loading)return(<Loading></Loading>)
  return(
    <div className="position-relative">
      <NavBarStudent></NavBarStudent>
      <BrowserView> 
        <Nav variant="tabs" >
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
      </BrowserView>
      <MobileView> 
        { mobileAgreement === false ? 
          <div style={{marginTop: '20%', marginLeft:'3%', marginRight: '3%'}}>
            <p style={{marginBottom: '1%', fontSize: '20px', fontWeight: 'bold'}}>{test.name}</p>
            <p style={{marginBottom: '25%', fontSize: '20px', fontWeight: 'bold'}}>응시 환경 세팅 "모바일" 화면입니다.</p>
              <p style={{fontWeight: 'bold', marginBottom:"20%"}}>화상회의 입장 시 카메라 및 마이크 공유를 <br/><span style={{ color: 'rgb(43, 73, 207)', fontWeight: 'bold'}}>모두 동의</span> 해주세요.</p>
            <Button 
              onClick={()=>{ 
                console.log('Button clicked')
                setmobileAgreement(true)
                history.push("/tests/"+testId+"/students/"+studentId+"/mobilesetting")
              }} 
              className="btn btn-primary" >
              화상회의 입장
            </Button> 
          </div>
          : null
        }
      </MobileView>
      <TestStudentRouter 
          path={path}
          test={test} 
          tabTitles={tabTitles} 
          tabCompleted={tabCompleted} 
          setTabCompleted={setTabCompleted}
          credentials={credentials}
          student={student}
          room={room}
          video={true}
          audio={true}
        />
    </div>
  )
}

export default TestStudentPre
