import React,{useEffect, useState} from 'react'
import {Card, Button } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import axios from 'axios';
import moment from "moment";

function Tests(){

  let [testDatas,setTestData] = useState([])
  let baseUrl ="http://api.testhelper.com"
  
  useEffect(()=>{
    getTests();
  },[]);

  let accountId=1;
  let testStatus='"Mark"';

  async function getTests(){
    await axios
    .get(baseUrl+'/tests?accountId='+accountId+'&testStatus='+testStatus)
    .then((result)=>{ 
      setTestData(result.data);
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

  return(
    <div className="container p-5">
      <ButtonGroup aria-label="Basic example">
        <Button variant={buttonCss(0)} onClick={()=>{setToggled(0);sortTests(1,"id")}}>id순오름정렬</Button>
        <Button variant={buttonCss(1)} onClick={()=>{setToggled(1);sortTests(-1,"id")}}>id순내림정렬</Button>
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
    "CREATE" : "문제생성중",
    "PROBLEM" : "실시대기중",
    "MARK" : "채점중",
    "FINISH" : "채점완료",
  }
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
            <Button className="col-md-4" variant="primary">문제출제</Button>
            <Button className="col-md-4" variant="danger">시험감독</Button>
            <Button className="col-md-4" variant="success">채점하기</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Tests