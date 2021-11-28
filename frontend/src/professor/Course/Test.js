import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, InputGroup, FormControl, Form , Card, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';
import './Test.css';
import moment from "moment";

function Test(props){
  const path = props.path;
  const courseName = props.courseName;
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {setShow(true);}
  const [state, setState] = useState([]);
  const [testList, setTestList] = useState([]);
  const [midterm, setMidterm] = useState([]);
  const [final, setFinal] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [assistant, setAssistant] = useState([]);
  let test_status_options={
    "CREATE" : "시험 생성 완료",
    "IN_PROGRESS" : "시험 진행중",
    "ENDED" : "시험 종료",
    "MARK" : "시험 채점중",
    "GRADED" : "점수 전송 완료",
  }

  useEffect(()=>{
    console.log(props);
    setAssistant(props.assistant);
    getTest();
  },[])

  function onChangehandler(e){
    let { name , value} = e.target;
    setState({
      ...state,
      [name]: value,
    });
    console.log(state);
  }
  async function getTest(){
    await axios
    .get(baseUrl+'/tests',{
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      sortTest(result.data);   
    })
    .catch(()=>{ console.log("실패") })
  }
  function sortTest(data){
    console.log(data)
    let mid = [];
    let final = [];
    let quiz = [];
    for(let i=0; i<data.length; i++){
      if(data[i].name === courseName){
        if(data[i].test_type === "MID"){
          mid.push(data[i]);
        }
        else if(data[i].test_type === "FINAL"){
          final.push(data[i]);
        }
        else{
          quiz.push(data[i]);
        }
      }
    }
    console.log(mid,final,quiz);
    setMidterm(mid);
    setFinal(final)
    setQuiz(quiz);
    setLoading(true);
  }
  async function submitForm(e){
    if(state.endTime<state.startTime){
        console.log("에러")
    }
    if(state.startTime===undefined||state.endTime===undefined||state.assistantId===undefined||state.type===undefined){
      alert("정보를 모두 입력해 주세요.");
    }
    else if(moment(state.endTime).format("YYYY-MM-DD HH:mm")<=moment(state.startTime).format("YYYY-MM-DD HH:mm")){
      alert("시험 시작 및 종료 일시를 정확히 입력해 주세요.");
    }
    else{
      let start_time = moment(state.startTime).format("YYYY-MM-DD HH:mm");
      let end_time = moment(state.endTime).format("YYYY-MM-DD HH:mm");
    
      let response = await fetch(baseUrl+path+`/tests?assistants=${state.assistantId}&endTime=${end_time}&startTime=${start_time}&type=${state.type}`,{
        method: 'POST',
        credentials : 'include',
      })
      .then( res => {
        console.log("response:", res);
        if(res.status === 200){
            alert("시험이 생성되었습니다.");
            setShow(false);
            setLoading(false);
            getTest();
        }
        else{
          alert("시험 생성에 실패했습니다.");
        }
      })
      .catch(error => {console.error('Error:', error)});  
    }
    // await axios
    // .post(baseUrl+path+'/tests', null, { params:{
    //     assistants: state.assistantId,
    //     endTime: end_time,
    //     startTime: start_time,
    //     type: state.type
    //   }},{
    //     withCredentials : true
    // })
    // .then((result)=>{
    //   console.log(result.data);
    // })
    // .catch((e)=>{ console.log(e) })

  }
  if(!loading)return(<Loading></Loading>)
  return(
    <div style={{marginLeft:"7%", marginTop:"2%", width:"70%"}}>
      <Button variant="secondary" style={{float:"right", marginRight:"15%"}} onClick={handleShow}>시험 생성</Button>
      <h4 style={{marginBottom:"3%", textAlign:"left"}}>시험 정보</h4>
      <div style={{width:"85%", height:"75vh", borderRadius:"10px", overflow: "auto", textAlign:"center"}}>
        <div style={{textAlign:"left", marginLeft:"2%", fontSize:"19px"}}>중간고사</div>
        {midterm.length !=0 ? midterm.map((data,idx)=>(
          <Card key={idx} className="testCard">
            <Card.Body>
              <CheckTestInfo name={data.name} type={data.test_type} id={data.id}/>
            </Card.Body>
          </Card>
        )):
        <Card className="noTestCard">
          <Card.Body>
            <div className="noTest">
              시험이 존재하지 않습니다
            </div>
          </Card.Body>
        </Card>}
        <div style={{textAlign:"left", marginLeft:"2%", fontSize:"19px"}}>기말고사</div>
        {final.length != 0 ? final.map((data,idx)=>(
          <Card key={idx} className="testCard">
            <Card.Body>
              <CheckTestInfo name={data.name} type={data.test_type} id={data.id}/>
            </Card.Body>
          </Card>
        )):
        <Card className="noTestCard">
          <Card.Body>
            <div className="noTest">
              시험이 존재하지 않습니다
            </div>
          </Card.Body>
        </Card>}
        <div style={{textAlign:"left", marginLeft:"2%", fontSize:"19px"}}>퀴즈</div>
        {quiz.length !=0 ? quiz.map((data,idx)=>(
          <Card key={idx} className="testCard">
            <Card.Body>
              <CheckTestInfo name={data.name} type={data.test_type} id={data.id} idx={idx+1}/>
            </Card.Body>
          </Card>
        )):
        <Card className="noTestCard">
          <Card.Body>
            <div className="noTest">
              시험이 존재하지 않습니다
            </div>
          </Card.Body>
        </Card>}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>시험 생성</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{height:"55vh"}}>
            <div className="FormName">시험 유형</div>
            <Form.Select className="type" name="type" onChange={(e)=>onChangehandler(e)}>
              <option>시험 유형</option>
              <option value="MID">중간고사</option>
              <option value="FINAL">기말고사</option>
              <option value="QUIZ">퀴즈</option>
            </Form.Select>
            <div className="FormName">시작 일시</div>
            <input className="date" type="datetime-local" name="startTime" onChange={(e)=>onChangehandler(e)}/>
            <div className="FormName">종료 일시</div>
            <input className="date" type="datetime-local" name="endTime" onChange={(e)=>onChangehandler(e)}/>
            <div className="FormName">담당 조교 등록</div>
            <div style={{overflow: "auto"}}>
            <Table striped bordered hover>
              <thead>
              <tr>
              <th>#</th>
              <th>이름</th>
              <th>이메일</th>
              <th>Check</th>
              </tr>
              </thead>
              <tbody>
              {assistant.map((data,idx)=>(
                <tr key={idx}>
                <td>{idx+1}</td>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td><Form style={{marginLeft:"12%"}}>
                  <Form.Check
                    inline
                    name="assistantId"
                    value={data.id}
                    onChange={(e)=>onChangehandler(e)}
                  />
                  </Form>
                </td>
                </tr>
              ))}
            </tbody>
            </Table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={(e)=>submitForm(e)}>
            등록
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

const CheckTestInfo = (props) => {
  console.log(props)
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {setShow(true);}
  const [state, setState] = useState([]);
  const [quizNum,setQuizNum] = useState("");
  const [testInfo, setTestInfo] = useState([]);
  let test_type={
    "MID" : "중간고사",
    "FINAL" : "기말고사",
    "QUIZ" : "퀴즈",
  }
  useEffect(()=>{
    if(props.type==="QUIZ"){
      setQuizNum(props.idx);
    }
  })
  async function getTestInfo(){
    setShow(true);
    await axios
    .get(baseUrl+'/tests/'+props.id,{
        withCredentials : true
    })
    .then((result)=>{
      console.log(result.data);
      setTestInfo(result.data);
      setLoading(true);
    })
    .catch(()=>{ console.log("실패") })
  }

  return(
    <div>
      <button className="testName" onClick={(e)=>getTestInfo(e)}>
        {props.name} {test_type[props.type]}{quizNum}
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>시험 정보</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{height:"55vh"}}>
            {loading?
            <div>
              <div className="FormName">시험 유형</div>
              <div className="testContent">{test_type[testInfo.type]}</div>
              <div className="FormName">시작 일시</div>
              <div className="testContent">{testInfo.startTime}</div>
              <div className="FormName">종료 일시</div>
              <div className="testContent">{testInfo.endTime}</div>
              <div className="FormName">담당 조교</div>
              <div style={{overflow: "auto", width:"97%", marginLeft:"1%"}}>
                <Table striped bordered hover>
                  <thead className="tableHead">
                  <tr>
                  <th>#</th>
                  <th>이름</th>
                  <th>이메일</th>
                  </tr>
                  </thead>
                  <tbody>
                  {testInfo.assistants.map((data,idx)=>(
                    <tr key={idx}>
                    <td>{idx+1}</td>
                    <td>{data.name}</td>
                    <td>{data.email}</td>
                    </tr>
                  ))}
                </tbody>
                </Table>
              </div>
            </div> :
            <div>
              <h4 style={{textAlign:"center", paddingTop:"20%"}}>정보를 불러오는 중입니다.</h4>
              <Spinner className="loading" animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">
            수정
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}


export default Test;