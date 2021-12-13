import React,{useEffect, useState} from 'react'
import {Card, Button,ButtonGroup } from 'react-bootstrap';
import axios from 'axios';
import moment from "moment";
import { useHistory } from 'react-router-dom';
import Loading from '../component/Loading';
import {baseUrl} from "../component/baseUrl"
import 'moment/locale/ko';

function Tests(){
  moment.locale('ko')

  let [testDatas,setTestData] = useState([])
  let [loading,setLoading] = useState(false)
  let [unscoredTests,setUnscoredTests] = useState([]);

  useEffect(()=>{
    getTests();
  },[]);

  let testStatus='ALL';

  async function getTests(){
    await axios
    // .get(baseUrl+'/tests?accountId='+accountId+'&testStatus='+testStatus,{
    .get(baseUrl+'/tests?testStatus=ALL',{
      withCredentials : true
    })
    .then((result)=>{ 
      setTestData(result.data);
      sortUnscoredTests(result.data);
      setLoading(true);
      console.log(result.data);
    })
    .catch(()=>{ console.log("실패") })
  }
  function sortTests(inc,standard){
    let temp = [...testDatas].sort(function (a,b){
      let value  = a[standard] > b[standard] ?  1 :  -1
      return inc*value 
    })
    setTestData(temp)
    
  }
  let [toggled,setToggled]=useState(0)
  function buttonCss(idx) {
    if(idx===4){
      return toggled===idx? "secondary" : "outline-secondary" 
    }
    else{
      return toggled===idx? "primary" : "outline-primary"  
    }
  }

  function sortUnscoredTests(data){
    let temp = [];
    console.log(temp);
    for(let i=0; i<data.length; i++){
      if(data[i].test_status === "ENDED" || data[i].test_status === "MARK" || data[i].test_status === "GRADED"){
        temp.push(data[i]);
      }
    }
    console.log(temp);
    setUnscoredTests(temp);
  }

  if(!loading)return(<Loading></Loading>)
  return(
    <div className="container mt-3 p-2">
      <ButtonGroup aria-label="Basic example">
        <Button variant={buttonCss(0)} onClick={()=>{setToggled(0);sortTests(1,"id")}}>생성빠른순정렬</Button>
        {/* <Button variant={buttonCss(1)} onClick={()=>{setToggled(1);sortTests(-1,"id")}}>생성느린순정렬</Button> */}
        <Button variant={buttonCss(2)} onClick ={()=>{setToggled(2);sortTests(1,"start_time")}}>날짜빠른순정렬</Button>
        {/* <Button variant={buttonCss(3)} onClick ={()=>{setToggled(3);sortTests(-1,"start_time")}}>날짜느린순정렬</Button> */}
        <Button variant={buttonCss(4)} onClick ={()=>{setToggled(4);}}>종료된 시험 조회</Button>
      </ButtonGroup>
      <div className="row mt-5">
        {toggled===4? unscoredTests.map((testdata,index)=>{
          return <TestCard key={index} test = {testdata} testState="unscored" />;
          }):
          testDatas.map((testdata,index)=>{
            return <TestCard key={index} test = {testdata} testState="" />;
          })
        }
      </div>
    </div> 
  )
}

function TestCard(props){
  console.log(props);
  let status = props.test.test_status;
  const [testState, setTestState] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  let test_status_options={
    "CREATE" : "시험 생성",
    "INVITED" : "시험 생성",
    "IN_PROGRESS" : "시험 진행중",
    "ENDED" : "미채점",
    "MARK" : "채점",
    "GRADED" : "채점 결과 전송 완료",
  }
  let history = useHistory()

  useEffect(()=>{
    console.log(props);
    getTestDate();
    if(props.testState==="unscored"){
      setTestState("unscored");
    }else{
      setTestState("");
    }
  })

  function getTestDate(){
    let startTime = "";
    let endTime = "";
    let start = moment(props.test.start_time).format("YYYY-MM-DD dd HH:mm:ss");
    let end = moment(props.test.end_time).format("YYYY-MM-DD dd HH:mm:ss");
    let startHour = start.substring(13,15);
    let endHour = end.substring(13,15);
    if(Number(startHour)>=13){
      startTime="PM";
      startHour=Number(startHour)-12;
    }
    else{
      startTime="AM";
    }
    
    if(Number(endHour)>=13){
      endTime="PM";
      endHour=Number(endHour)-12;
    }
    else{
      endTime="AM";
    }

    // let testStart = start.substring(0,4)+"년"+start.substring(5,7)+"월"+start.substring(8,10)+"일"+" "+start.substring(11,12)+"요일"+" "+startTime+" "+startHour+"시"+start.substring(16,18)+"분";
    // let testEnd = end.substring(0,4)+"년"+end.substring(5,7)+"월"+end.substring(8,10)+"일"+" "+end.substring(11,12)+"요일"+" "+endTime+" "+endHour+"시"+end.substring(16,18)+"분";
    let testStart = start.substring(0,10)+" "+start.substring(11,12)+"요일"+" "+startTime+" "+startHour+"시"+start.substring(16,18)+"분";
    let testEnd = end.substring(0,10)+" "+end.substring(11,12)+"요일"+" "+endTime+" "+endHour+"시"+end.substring(16,18)+"분";
    console.log(testStart, testEnd);
    setStartDate(testStart);
    setEndDate(testEnd);
  }

  async function checkSuperviseTest(){
    let response = await fetch(baseUrl+"/tests/"+props.test.id+"/students/room",{
      method: "POST",
      credentials: "include",
      })
      .then((res) => res.json())
      .then((res) => {
        console.log("response:", res);
        if(res.errorMessage != undefined){ //error
          alert(res.errorMessage);
        }
        else{ //success
          history.push({
            pathname: "/tests/"+props.test.id+"/supervise",
            state: {
              testStartTime: props.test.start_time,
              testEndTime: props.test.end_time,
          }});
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function scoringTest(status){
    console.log(status)
    if(status!="ENDED" && status!="MARK", status!="GRADED"){
      alert("시험이 종료되지 않아 채점할 수 없습니다.");
    }
    else{
      history.push({
        pathname:`/tests/${props.test.id}/unscored`,
        state:{
          testName: props.test.name
        }
      })
    }
  }

  return(
    <div className="col-md-4 mb-3">
      <Card>
        <Card.Body>
          <Card.Title>{props.test.name}</Card.Title>
          <hr />
          <Card.Text>
            {test_status_options[props.test.test_status]}
          </Card.Text>
          <Card.Text>
            시작: {startDate}
          </Card.Text>
          <Card.Text>
            종료: {endDate}
          </Card.Text>
          <div className="row">
            {testState === "unscored"? 
            <Button style={{backgroundColor:"#f19f91", borderColor:"#f19f91", color:"black", fontWeight:"bold"}} onClick={()=>history.push({
              pathname:`/tests/${props.test.id}/unscored`,
              state:{
                testName: props.test.name
              }
            })}>답안지 관리</Button>: 
            <>{(status === "CREATE" || status === "INVITED")? 
              <>
                <Button className="col-md-6" style={{backgroundColor:"#c8d6a6", borderColor:"#c8d6a6", color:"black", fontWeight:"bold"}} onClick={()=>{history.push({
                  pathname: "/tests/"+props.test.id+"/problems",
                  state:{testName: props.test.name }
                  })}}>문제출제</Button>
                <Button className="col-md-6" style={{backgroundColor:"#545b69", borderColor:"#545b69"}} onClick={(e)=>{checkSuperviseTest(e)}}>시험감독</Button>
              </>: 
              <>{status === "IN_PROGRESS"? 
                <>
                  <Button className="col-md-12" style={{backgroundColor:"#545b69", borderColor:"#545b69"}} onClick={(e)=>{checkSuperviseTest(e)}}>시험감독</Button>
                </>:
                <>
                  <Button style={{backgroundColor:"#f19f91", borderColor:"#f19f91", color:"black", fontWeight:"bold"}} onClick={()=>history.push({
                    pathname:`/tests/${props.test.id}/unscored`,
                    state:{
                      testName: props.test.name
                    }
                  })}>답안지 관리</Button>
                </>}
              </>}
            </>}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Tests