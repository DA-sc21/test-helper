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

  let accountId=1;
  let testStatus='"Mark"';

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
      if(data[i].test_status === "ENDED" || data[i].test_status === "MARK"){
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
        <Button variant={buttonCss(1)} onClick={()=>{setToggled(1);sortTests(-1,"id")}}>생성느린순정렬</Button>
        <Button variant={buttonCss(2)} onClick ={()=>{setToggled(2);sortTests(1,"start_time")}}>날짜빠른순정렬</Button>
        <Button variant={buttonCss(3)} onClick ={()=>{setToggled(3);sortTests(-1,"start_time")}}>날짜느린순정렬</Button>
        <Button variant={buttonCss(4)} onClick ={()=>{setToggled(4);}}>종료된 시험 조회</Button>
      </ButtonGroup>
      <div className="row mt-5">
        {toggled===4? unscoredTests.map((testdata,index)=>{
          return <TestCard key={index} test = {testdata} testState="unscored"/>;
          }):
          testDatas.map((testdata,index)=>{
            return <TestCard key={index} test = {testdata} testState=""/>;
          })
        }
      </div>
    </div> 
  )
}

function TestCard(props){
  console.log(props);
  const [testState, setTestState] = useState("");
  let test_status_options={
    "CREATE" : "시험 생성중",
    "INVITED" : "시험 생성 완료",
    "IN_PROGRESS" : "시험 진행중",
    "ENDED" : "시험 미채점",
    "MARK" : "시험 채점중",
    "GRADED" : "시험 채점 완료",
  }
  let history = useHistory()

  useEffect(()=>{
    if(props.testState==="unscored"){
      setTestState("unscored");
    }else{
      setTestState("");
    }
  })

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
              testEndTime: props.test.end_time
          }});
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return(
    <div className="col-md-4">
      <Card>
        <Card.Body>
          <Card.Title>{props.test.name}</Card.Title>
          <hr />
          <Card.Text>
            {test_status_options[props.test.test_status]}
          </Card.Text>
          <Card.Text>
            시작시각 : {moment(props.test.start_time).format("YYYY-MM-DD dd HH:mm:ss")}
          </Card.Text>
          <Card.Text>
            종료시각 : {moment(props.test.end_time).format("YYYY-MM-DD dd HH:mm:ss")}
          </Card.Text>
          <div className="row">
            {testState === "unscored"? 
            <Button style={{backgroundColor:"#2c4b88", borderColor:"#2c4b88"}} onClick={()=>history.push({
              pathname:`/tests/${props.test.id}/unscored`,
              state:{
                testName: props.test.name
              }
            })}>답안지 관리</Button>: 
            <>
            <Button className="col-md-4" style={{backgroundColor:"#7f95c0", borderColor:"#7f95c0", color:"black"}}>문제출제</Button>
            <Button className="col-md-4" style={{backgroundColor:"#3e4450", borderColor:"#3e4450"}} onClick={(e)=>{checkSuperviseTest(e)}}>시험감독</Button>
            <Button className="col-md-4" style={{backgroundColor:"#f7f7f7", borderColor:"gray", color:"black"}}>채점하기</Button>
            </>}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Tests