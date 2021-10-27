import React, { useState } from 'react'
import {ListGroup ,Button} from 'react-bootstrap'

function TestStudentWaiting(props){
  console.log(props.tabCompleted)
  let testInformations=["id","class_id","type","start_time","end_time"]
  let [today,setToday] = useState(new Date());   
  // let [leftTime,setleftTime]=useState(test_start_time-today);
  // setInterval(()=>{
  //   let temp = new Date();
  //   console.log(temp)
  //   setToday( temp );   
  //   setleftTime( test_start_time - temp);   
  // },1000)
  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1;  // 월
  let date = today.getDate();  // 날짜
  let day = today.getDay();  // 요일
  let hours = today.getHours(); // 시
  let minutes = today.getMinutes();  // 분
  let seconds = today.getSeconds();  // 초
  return(
    <div className="m-5 p-5"> 
      <div className="row">
        <h4 className="mb-5"> 지금은 {year+" 년 "+month+" 월 "+date+" 일 "+hours+" 시 "+minutes+" 분 "+seconds+" 초"}</h4>
        {/* <h4>시험 시작시간은 </h4> 
        <h4>남은시간은 </h4> */}
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