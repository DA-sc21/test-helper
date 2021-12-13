import React, { useEffect, useState } from 'react'
import { Table ,Card } from 'react-bootstrap'
import moment from 'moment';
import Moment from "react-moment"
import 'moment/locale/ko';
import { useInterval } from 'react-use';
import TakingTest from './TakingTest';
import { baseUrl } from '../component/baseUrl';
import { useParams } from 'react-router-dom';

function TestStudentWaiting(props){
  moment.locale('ko')
  let {testId, studentId} =useParams();
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
  let [consented,setConsented]=useState(false)
  let [verification,setVerification]=useState(false)

  useEffect(() => {
    getStudentSetting();
  },[])

  async function getStudentSetting(){

    let response = await fetch(baseUrl+`/tests/`+testId+'/students/'+studentId+'/submissions/status',{
			method: 'GET',
			credentials : 'include',
		  })
      .then((res) => res.json())
		  .then((result) => {
        console.log("response:", result)
        setConsented(result.consented)
        setVerification(result.verification)
		  })
      .catch(error => {console.error('Error:', error)});
  }

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
          <TakingTest consented={consented} verification={verification} started={started} data={props} endTime={endTime} remainEndTime={remainEndTime} ended={ended} ></TakingTest>
        </div>
        <div className="col-md-12">
          <Card className="mt-5 m-5">
            <Card.Body>
              <h5>{props.test[testInformations[1]]} 시험정보</h5>
              <hr></hr>
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
                    <td>시험종료 시간</td>
                    <td> {endTime}  </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div style={{backgroundColor:"#2a2f38",color:"white", textAlign:"center", padding:"4px",margin:"10px", borderRadius:"5px", fontWeight:"bold"}}>
                        { started 
                          ?  "시험 시작이 "+ (-remainTime.days)+"일 "+(-remainTime.hours)+"시간 "+(-remainTime.minutes)+"분 "+(-remainTime.seconds)+"초 지났습니다."
                          :  "시험 시작이 "+ remainTime.days+"일 "+remainTime.hours+"시간 "+remainTime.minutes+"분 "+remainTime.seconds+"초 남았습니다." 
                        }
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="row mt-5 d-flex justify-content-center">
      <div className="col-md-12 my-4">
      </div>
        {/* <div className="col-md-6">
          <h4>Setting현황</h4>
          <ListGroup>
            <ListGroup.Item variant="info">
              {props.tabTitles[0] +" 성공여부 : "}{consented?"성공":"실패"}
            </ListGroup.Item>
            <ListGroup.Item variant="info">
              {props.tabTitles[1] +" 성공여부 : 성공 "}
            </ListGroup.Item>
            <ListGroup.Item variant="info">
              {props.tabTitles[2] +" 성공여부 : 성공 "}
            </ListGroup.Item>
            <ListGroup.Item variant="info">
              {props.tabTitles[3] +" 성공여부 : "}{verification?"성공":"실패"}
            </ListGroup.Item>
            {props.tabCompleted.map((completed,index)=>{
              if (index===4){return}
              return (
                <ListGroup.Item action variant="info">
                  {props.tabTitles[index] +" 성공여부 : true "}
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </div> */}
      </div>
    </div>

  )
}

export default TestStudentWaiting