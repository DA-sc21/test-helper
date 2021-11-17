import React, { useState } from 'react'
import { ListGroup ,Button , Table } from 'react-bootstrap'
import moment from 'moment';
import Moment from "react-moment"
import 'moment/locale/ko';
import { useInterval } from 'react-use';
import TakingTest from './TakingTest';

function TestStudentWaiting(props){
  moment.locale('ko')

  let testInformations = ["id","name","startTime","endTime"]
  let startTime = props.test.startTime
  startTime = moment(startTime).format("YYYY-MM-DD dd HH:mm:ss")
  let endTime = props.test.endTime
  endTime = moment(endTime).format("YYYY-MM-DD dd HH:mm:ss")
  let testTime = moment.duration(moment(props.test.endTime).diff(moment(props.test.startTime)));
  let formatTime={
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }
  const [remainTime, setRemainTime] = useState(formatTime);
  const [remainEndTime, setRemainEndTime] = useState(formatTime);
  let [started,setStarted]=useState(false)
  let [ended,setEnded]=useState(false)

  useInterval(() => {
    let currentTime = moment();
    // let testStartTime = moment("2021 10 31 18:07");//테스트용
    let testStartTime = moment(props.test.startTime);
    // let testEndTime = moment("2021 11 14 23:25");//테스트용
    let testEndTime = moment(props.test.endTime);
    let duration = moment.duration(testStartTime.diff(currentTime));
    let durationEndTime = moment.duration(testEndTime.diff(currentTime));
    duration < 0 ? setStarted(true) :setStarted(false) 
    durationEndTime < 0 ? setEnded(true) :setEnded(false) 
    let temp=timeToDict(duration)
    setRemainTime(temp)
    let tempEnd=timeToDict(durationEndTime)
    setRemainEndTime(tempEnd)
  }, 1000);

  function timeToDict(duration){
    return {
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds()
    }
  }
  return(
    <div className="conatiner m-4 px-5"> 
      <div className="row">
        <div className="col-md-12 my-4">
          {/* <Button variant= "success" size="lg" disabled= {!started} >
            시험장입장
          </Button> */}
          <TakingTest started={started} data={props} endTime={endTime} remainEndTime={remainEndTime} ended={ended} ></TakingTest>
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