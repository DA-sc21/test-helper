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
  const handleShow = () => {setShow(true);setCheckList([]);setState([]);}
  const [state, setState] = useState([]);
  const [testList, setTestList] = useState([]);
  const [midterm, setMidterm] = useState([]);
  const [final, setFinal] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [assistant, setAssistant] = useState([]);
  const [checkList, setCheckList] = useState([]);
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

  function checkBoxHandler(checked,id){
    if(checked){
      setCheckList([...checkList, id]);
    }
    else{
      setCheckList(checkList.filter((el) => el !== id));
    }
    console.log(checkList);
  }
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
    if(state.startTime===undefined||state.endTime===undefined||checkList.length===0||state.type===undefined){
      alert("정보를 모두 입력해 주세요.");
    }
    else if(moment().format("YYYY-MM-DD HH:mm")>=moment(state.startTime).format("YYYY-MM-DD HH:mm")||moment(state.endTime).format("YYYY-MM-DD HH:mm")<=moment(state.startTime).format("YYYY-MM-DD HH:mm")){
      //현재시간>=시작시간 or 시작시간>=종료시간
      alert("시험 시작 및 종료 일시를 정확히 입력해 주세요.");
    }
    else{
      let start_time = moment(state.startTime).format("YYYY-MM-DD HH:mm");
      let end_time = moment(state.endTime).format("YYYY-MM-DD HH:mm");
      
      let assistantList = "";
      for(let i=0; i<checkList.length; i++){
        if(i==0){
          assistantList+=String(checkList[i]);
        }
        else{
          assistantList+=','+String(checkList[i]);
        }
      }
      console.log(assistantList)

      let response = await fetch(baseUrl+path+`/tests?assistants=${assistantList}&endTime=${end_time}&startTime=${start_time}&type=${state.type}`,{
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
          console.log(res);
        }
      })
      .catch(error => {console.error('Error:', error)});  
    }
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
              <CheckTestInfo name={data.name} type={data.test_type} id={data.id} assistant={assistant} path={path}/>
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
              <CheckTestInfo name={data.name} type={data.test_type} id={data.id} assistant={assistant} path={path}/>
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
              <CheckTestInfo name={data.name} type={data.test_type} id={data.id} idx={idx+1} assistant={assistant} path={path}/>
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
            <div style={{height:"34%", overflow: "auto"}}>
            <Table striped bordered hover>
              <thead style={{backgroundColor:"#aeb8ce"}}>
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
                    // onChange={(e)=>onChangehandler(e)}
                    onChange={(e)=>checkBoxHandler(e.currentTarget.checked, data.id)}
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
          <Button variant="secondary" onClick={(e)=>submitForm(e)}>
            등록
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

const CheckTestInfo = (props) => {
  // console.log(props)
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [show1, setShow1] = useState(false); //시험 정보 조회 Modal
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const [show2, setShow2] = useState(false); //시험 정보 수정 Modal
  const handleClose2 = () => {setShow2(false);setCheckList([]);}
  const handleShow2 = () => {setShow2(true);setState([]);}
  const [state, setState] = useState([]);
  const [quizNum,setQuizNum] = useState("");
  const [testInfo, setTestInfo] = useState([]);
  const [startTime, setStartTime] = useState([]);
  const [endTime, setEndTime] = useState([]);
  const [checkList, setCheckList] = useState([]);
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

  function checkBoxHandler(checked,id){
    if(checked){
      setCheckList([...checkList, id]);
    }
    else{
      setCheckList(checkList.filter((el) => el !== id));
    }
    console.log(checkList);
  }

  function onChangehandler(e){
    let { name , value} = e.target;
    setState({
      ...state,
      [name]: value,
    });
    console.log(state);
  }

  async function getTestInfo(){
    setShow1(true);
    await axios
    .get(baseUrl+'/tests/'+props.id,{
        withCredentials : true
    })
    .then((result)=>{
      console.log(result.data);
      setTestInfo(result.data);
      let start_time = result.data.startTime.split(" ");
      let end_time = result.data.endTime.split(" ");
      setStartTime(start_time[0]+"T"+start_time[1]);
      setEndTime(end_time[0]+"T"+end_time[1]);
      console.log(start_time[0]+"T"+start_time[1]);
      sortAssistant(result.data.assistants);
    })
    .catch(()=>{ console.log("실패") })
  }

  function sortAssistant(data){
    let arr = [];
    for(let i=0; i<data.length; i++){
      arr.push(data[i].id);
    }
    console.log(arr);
    setCheckList(arr);
    setLoading(true);
  }
  
  function openModifyModal(){
    setState({
      type: testInfo.type,
      startTime: startTime,
      endTime: endTime,
    })
    setShow1(false);
    setShow2(true);
  }

  async function submitForm(e){;
    console.log(state.startTime,state.endTime,state.type,checkList)
    if(state.startTime===undefined||state.endTime===undefined||checkList.length===0||state.type===undefined){
      alert("정보를 모두 입력해 주세요.");
    }
    else if(moment().format("YYYY-MM-DD HH:mm")>=moment(state.startTime).format("YYYY-MM-DD HH:mm")||moment(state.endTime).format("YYYY-MM-DD HH:mm")<=moment(state.startTime).format("YYYY-MM-DD HH:mm")){
      //현재시간>=시작시간 or 시작시간>=종료시간
      alert("시험 시작 및 종료 일시를 정확히 입력해 주세요.");
    }
    else{
      let start_time = moment(state.startTime).format("YYYY-MM-DD HH:mm");
      let end_time = moment(state.endTime).format("YYYY-MM-DD HH:mm");
      
      let assistantList = "";
      for(let i=0; i<checkList.length; i++){
        if(i==0){
          assistantList+=String(checkList[i]);
        }
        else{
          assistantList+=','+String(checkList[i]);
        }
      }
      console.log(assistantList);
      console.log(props.id);

      let response = await fetch(baseUrl+`/tests/${props.id}?assistants=${assistantList}&endTime=${end_time}&startTime=${start_time}&type=${state.type}`,{
        method: 'PATCH',
        credentials : 'include',
      })
      .then( res => {
        console.log("response:", res);
        if(res.status === 200){
            alert("시험 정보가 수정되었습니다.");
            setShow2(false);
            history.push(props.path+'/tests');
        }
        else{
          alert("시험 정보 수정에 실패했습니다.");
        }
      })
      .catch(error => {console.error('Error:', error)});
      
      // await axios
      // .patch(baseUrl+'/tests/'+props.id, null, { params:{
      //     assistants: assistantList,
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
  }

  return(
    <div>
      <button className="testName" onClick={(e)=>getTestInfo(e)}>
        {props.name} {test_type[props.type]}{quizNum}
      </button>
      <Modal show={show1} onHide={handleClose1}>
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
          <Button variant="secondary" onClick={()=>openModifyModal()}>
            수정
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>시험 정보 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{height:"55vh"}}>
          <div className="FormName">시험 유형</div>
            <Form.Select className="type" name="type" onChange={(e)=>onChangehandler(e)} value={testInfo.type}>
              <option>시험 유형</option>
              <option value="MID">중간고사</option>
              <option value="FINAL">기말고사</option>
              <option value="QUIZ">퀴즈</option>
            </Form.Select>
            <div className="FormName">시작 일시</div>
            <input className="date" type="datetime-local" name="startTime" onChange={(e)=>onChangehandler(e)} defaultValue={startTime}/>
            <div className="FormName">종료 일시</div>
            <input className="date" type="datetime-local" name="endTime" onChange={(e)=>onChangehandler(e)} defaultValue={endTime}/>
            <div className="FormName">담당 조교 등록</div>
            <div style={{height:"34%", overflow: "auto"}}>
            <Table striped bordered hover>
              <thead className="tableHead"> 
              <tr>
              <th>#</th>
              <th>이름</th>
              <th>이메일</th>
              <th>Check</th>
              </tr>
              </thead>
              <tbody>
              {props.assistant.map((data,idx)=>(
                <tr key={idx}>
                <td>{idx+1}</td>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td>
                  <Form style={{marginLeft:"12%"}}>
                  <Form.Check
                    inline
                    name="assistantId"
                    value={data.id}
                    // onChange={(e)=>onChangehandler(e)}
                    onChange={(e)=>checkBoxHandler(e.currentTarget.checked, data.id)}
                    checked={checkList.includes(data.id) ? true : false}
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
          <Button variant="secondary" onClick={(e)=>submitForm(e)}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}



export default Test;