import React, { useState } from 'react'
import {ListGroup ,Button} from 'react-bootstrap'
import Moment from 'react-moment';
import 'moment/locale/ko';

function TestStudentWaiting(props){
  // console.log(props.tabCompleted)
  let testInformations=["id","class_id","type","start_time","end_time"]
  const MomentDateChange = ()=>{
    const nowTime = Date.now(),
          startTime = new Date("2021-10-24T22:17:00");  //test시작시간
    return <Moment interval={1000} format="HH:mm:ss" toNow>{startTime}</Moment>;
  }

  return(
    <div className="m-5 p-5"> 
      <div className="row">
        <h4>시험 시작시간 {MomentDateChange()}</h4> 
        <h4>남은시간은 </h4>
        <div className="col-md-6">
          <h4>Setting현황</h4>
          <ListGroup>
            {props.tabCompleted.map((completed,index)=>{
              return (
                <ListGroup.Item key={index} action variant="info">
                  {props.tabTitles[index] +" 성공여부 "+props.tabCompleted[index]}
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </div>
        <div className="col-md-6">
          <h4>시험정보</h4>
          <ListGroup>
            { 
              testInformations.map((info,index)=>{
                return(
                  <ListGroup.Item key={index} action variant="success">
                  {info +" : "+props.test[info]}
                  </ListGroup.Item>
                )
              })
            }
          </ListGroup>
        </div>
        <div className="col-md-12 mt-5">
          {/* <h2>남은시간 { hours }</h2> */}
          <Button variant="info" size="lg">
            시험장입장
          </Button>
        </div>
      </div>
    </div>

  )
}

export default TestStudentWaiting