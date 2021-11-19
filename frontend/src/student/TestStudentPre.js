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
  
  let {testId, studentId} =useParams();
  let [room,setRoom]=useState();
  let [student,setStudent]=useState();
  let [test,setTest]=useState();
  let [credentials,setCredentials]=useState();
  let [mobileAgreement,setmobileAgreement]=useState(false);
  let [loading,setLoading] = useState(false)
  let [video, setVideo] = useState(false);
  let [audio, setAudio] = useState(false);
  let [consented,setConsented]=useState(false)
  let [tabCompleted,setTabCompleted]=useState([consented,false,false,false,""])
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

  useEffect(()=>{
    getStudentRoom();
  },[]);
  
  async function getStudentRoom(){
    await axios
    .get(baseUrl+'/tests/'+testId+'/students/'+studentId+'/room')
    .then((result)=>{ 
      setConsented(result.data.consented)
      setCredentials(result.data.credentials)
      setRoom(result.data.room)
      setStudent(result.data.room.student)
      setTest(result.data.room.test)
      setLoading(true);
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
            <p style={{marginBottom: '1%', fontSize: '20px', fontWeight: 'bold'}}>안녕하세요. O O O 시험</p>
            <p style={{marginBottom: '20%', fontSize: '20px', fontWeight: 'bold'}}>응시 환경 세팅 "모바일" 화면입니다.</p>
              <p style={{fontWeight: 'bold'}}>카메라 및 마이크 공유를 <span style={{ color: 'rgb(43, 73, 207)', fontWeight: 'bold'}}>모두 동의</span>한 후 설정완료 버튼을 클릭해주세요.</p>
              <div style={{marginTop: '15%'}}>
                <p style={{fontWeight: 'bold'}}>모바일 카메라 공유</p>
                <div>
                  <input type="checkbox" checked={video} onChange={(e) => changeVideo(e)}></input>
                  <label>동의</label>
                </div>
              </div>
              <div style={{marginTop: '10%', marginBottom: '20%'}}>
                <p style={{fontWeight: 'bold'}}>모바일 마이크 공유</p>
                <div>
                  <input type="checkbox" checked={audio} onChange={(e) => changeAudio(e)}></input>
                  <label> 동의</label>
                </div>
              </div>
            <Button 
              onClick={()=>{ 
                console.log('Button clicked')
                setmobileAgreement(true)
                history.push("/tests/"+testId+"/students/"+studentId+"/mobilesetting")
              }} 
              className="btn btn-primary" >
              화상 회의 입장
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
          video={video}
          audio={audio}
        />
    </div>
  )
}

export default TestStudentPre
