import React,{useEffect, useState} from 'react'
import {Card, Button } from 'react-bootstrap';
import axios from 'axios';

function Tests(){

  let [testDatas,setTestData] = useState([])
  useEffect(()=>{
    getStudentRoom();
  },[]);
  
  async function getStudentRoom(){
    await axios
    .get('/tests?accountId=1&testStatus="MARK"')
    .then((result)=>{ 
      // tests = result.data
      setTestData(result.data);
      console.log(result.data)
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
  return(
    <div className="col-md-4">
      <Card>
        <Card.Body>
          <Card.Title>{props.test.name}</Card.Title>
          <Card.Text>
            {props.test.test_type}
          </Card.Text>
          <Card.Text>
            {props.test.test_status}
          </Card.Text>
          <Card.Text>
            시작시각 : {props.test.start_time}
          </Card.Text>
          <Card.Text>
            종료시각 : {props.test.end_time}
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