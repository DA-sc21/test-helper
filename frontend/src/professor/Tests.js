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

  useEffect(()=>{
    getTests();
  },[]);

  let accountId=1;
  let testStatus='"Mark"';

  async function getTests(){
    await axios
    .get(baseUrl+'/tests?accountId='+accountId+'&testStatus='+testStatus,{
      withCredentials : true
    })
    .then((result)=>{ 
      setTestData(result.data);
      setLoading(true);
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
    return toggled===idx? "primary" : "outline-primary"  
  }

  if(!loading)return(<Loading></Loading>)
  return(
    <div className="container mt-3 p-2">
      <ButtonGroup aria-label="Basic example">
        <Button variant={buttonCss(0)} onClick={()=>{setToggled(0);sortTests(1,"id")}}>생성빠른순정렬</Button>
        <Button variant={buttonCss(1)} onClick={()=>{setToggled(1);sortTests(-1,"id")}}>생성느린순정렬</Button>
        <Button variant={buttonCss(2)} onClick ={()=>{setToggled(2);sortTests(1,"start_time")}}>날짜빠른순정렬</Button>
        <Button variant={buttonCss(3)} onClick ={()=>{setToggled(3);sortTests(-1,"start_time")}}>날짜느린순정렬</Button>
      </ButtonGroup>
      <div className="row mt-5">
        {
          testDatas.map((testdata,index)=>{
            return <TestCard key={index} test = {testdata} / >;
          })
        }
      </div>
    </div> 
  )
}

function TestCard(props){
  let test_status_options={
    "CREATE" : "시험 생성중",
    "IN_PROGRESS" : "시험 진행중",
    "ENDED" : "시험 종료",
    "MARK" : "시험 채점중",
    "GRADED" : "점수 전송 완료",
  }
  let history = useHistory()

  return(
    <div className="col-md-4">
      <Card>
        <Card.Body>
          <Card.Title>{props.test.name}</Card.Title>
          <Card.Text>
            {props.test.test_type}
          </Card.Text>
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
            <Button className="col-md-4" variant="primary" onClick={()=>{history.push({
              pathname: "/tests/"+props.test.id+"/problems",
              })}}>문제출제</Button>
            <Button className="col-md-4" variant="danger" onClick={()=>{history.push({
              pathname: "/tests/"+props.test.id+"/supervise",
              state: {
                testStartTime: props.test.start_time,
                testEndTime: props.test.end_time
                }})}}>시험감독</Button>
            <Button className="col-md-4" variant="success">채점하기</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Tests