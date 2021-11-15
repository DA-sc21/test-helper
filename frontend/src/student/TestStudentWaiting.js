import React, { useState } from 'react'
import { ListGroup ,Button , Table } from 'react-bootstrap'
import moment from 'moment';
import Moment from "react-moment"
import 'moment/locale/ko';
import { useInterval } from 'react-use';
import TakingTest from './TakingTest';

function TestStudentWaiting(props){
  let testInformations = ["id","name","startTime","endTime"]
  let startTime = props.test.startTime
  startTime = moment(startTime).format("YYYY-MM-DD dd HH:mm:ss")
 
  const [remainTime, setRemainTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  let [started,setStarted]=useState(false)
  useInterval(() => {
    
    let currentTime = moment();
    let testStartTime = moment("2021 10 31 18:07");
    // let testStartTime = moment(props.test.startTime);
    let duration = moment.duration(testStartTime.diff(currentTime));
    duration < 0 ? setStarted(true) :setStarted(false) 
    let temp={
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds()
    }
    setRemainTime(temp)
  }, 1000);

  return(
    <div className="conatiner m-4 px-5"> 
      <div className="row">
        <div className="col-md-12 my-4">
          {/* <Button variant= "success" size="lg" disabled= {!started} >
            시험장입장
          </Button> */}
          <TakingTest started={started} data={props}></TakingTest>
        </div>
        <div className="col-md-12">
          <Table striped bordered hover size="sm">
            <tbody>
              <tr>
                <td> 현재 시간 </td>
                <td> <Moment format="YYYY-MM-DD dd HH:mm:ss" >{Date.now()}</Moment>  </td>
              </tr>
              <tr>
                <td>시험시작 시간</td>
                <td> {startTime}  </td>
              </tr>
              <tr>
                <td colSpan="2">
                  { started 
                    ?  (-remainTime.days)+"일 "+(-remainTime.hours)+"시간 "+(-remainTime.minutes)+"분 "+(-remainTime.seconds)+"초 지났습니다."
                    :  remainTime.days+"일 "+remainTime.hours+"시간 "+remainTime.minutes+"분 "+remainTime.seconds+"초 남았습니다." 
                  }
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
      <hr />
      <div className="row mt-5">
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
      </div>
    </div>

  )
}

export default TestStudentWaiting