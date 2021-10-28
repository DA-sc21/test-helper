import React,{useEffect, useState} from 'react'
import {Card, Button } from 'react-bootstrap';
import axios from 'axios';
import moment from "moment";

function Tests(){

  let [testDatas,setTestData] = useState([])
  useEffect(()=>{
    getStudentRoom();
  },[]);

  let accountId=1;
  let testStatus='"Mark"';

  async function getStudentRoom(){
    await axios
    .get('http://api.testhelper.com/tests?accountId='+accountId+'&testStatus='+testStatus)
    .then((result)=>{ 
      setTestData(result.data);
    })
    .catch(()=>{ console.log("실패") })
  }

  return(
    <div className="container">
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