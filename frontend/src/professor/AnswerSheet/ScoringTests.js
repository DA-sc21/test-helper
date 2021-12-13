import React, { useEffect, useState } from 'react'
import { ListGroup , Col, Tab , Row, Image, InputGroup, FormControl, Button, Spinner, Pagination } from 'react-bootstrap'
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';

function ScoringTests(props){
  let path = props.path;
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState([]);
  const [state, setState] = useState([]);
  const [score, setScore] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [captureimageUrl, setcaptureImageUrl] = useState("");
  const [submissionId, setSubmissionId] = useState("");
  const [TestAnswerSheetUrl, setTestAnswerSheetUrl] = useState([]);
  const [TestAnswerSheetImgUrl, setTestAnswerSheetImgUrl] = useState("");
  const [active, setActive] = useState(1);
  const [items, setItems] = useState([]);

  useEffect(()=>{
    getTestAnswerSheet();
    getProblems();
  },[]);

  function onChangehandler(e){
    let { name , value} = e.target;
    setState({
      ...state,
      [name]: value,
    });
    console.log(state);
  }

  async function getProblems(){
    let response = await fetch(baseUrl+path+'/problems',{
        method: 'GET',
        credentials : 'include',
      })
      .then((res) => res.json())
      .then((res) => {
        console.log("response:", res);
        setProblems(res);
        getAnswerSheet(res);
      })
      .catch(error => {console.error('Error:', error)});
  }

  async function getAnswerSheet(problem){
    await axios
    .get(baseUrl+path+`/students/${props.studentId}/submissions?includeCapture=true`,{
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      setSubmissionId(result.data.id);
      setImageUrl(result.data.answerSheetDownloadUrl);
      setcaptureImageUrl(result.data.captureSheetDownloadUrl);
      setLoading(true); 
    })
    .catch(()=>{ console.log("실패") })
  }

  async function getAnswerSheetScore(e, id){
    console.log(id)
    let response = await fetch(baseUrl+'/submissions/'+submissionId+'/problems/'+id+'/score',{
      method: 'GET',
      credentials : 'include',
      })
      .then((res) => res.json())
      .then((res) => {
        console.log("response:", res);
        setState({
          "score": res.score,
        });
      })
      .catch(error => {console.error('Error:', error)});
  }

  async function getTestAnswerSheet(){
    let temp = [];
    let response = await fetch(baseUrl+path+'/answers',{
      method: 'GET',
      credentials : 'include',
      })
      .then((res) => res.json())
      .then((res) => {
        console.log("response:", res);
        temp=res;
      })
      .catch(error => {console.error('Error:', error)});

    let url = [];
    for(let i =0; i<temp.length; i++){
      url.push(temp[i].file);
      if(i==0){
        setTestAnswerSheetImgUrl(temp[i].file);
      }
    }
    console.log(url);
    setTestAnswerSheetUrl(url);
  }

  async function enterScore(e,problemNum){
    let response = await fetch(baseUrl+'/submissions/'+submissionId+'/problems/'+problemNum+'/score?score='+state.score,{
        method: 'PUT',
        credentials : 'include',
      })
      .then((res) => res.json())
      .then((res) => {
        if(res.result === true){
          alert("점수 입력에 성공했습니다.");
        }
        else{
          alert(res.errorMessage);
        }
        console.log("response:", res);
      })
      .catch(error => {console.error('Error:', error)});
  }

  function changeTestAnswerSheet(id){
    setActive(id+1);
    setTestAnswerSheetImgUrl(TestAnswerSheetUrl[id]);
    console.log(TestAnswerSheetUrl[id]);
  }
	
  return(
    <>
    {!loading? 
      <div style={{textAlign:"center"}}>
        <h3 style={{paddingTop:"5%", marginBottom:"2%"}}>정보를 불러오는 중입니다.</h3>
        <Spinner style={{width:"40px", height:"40px"}} animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>:
	<Tab.Container id="list-group-tabs-example">
	  <Row>
		<Col sm={2}>
		  <ListGroup>
			{
			  problems.map((problem,index)=>{
				return (
				  <ListGroup.Item key={index} action href={"#problem"+index} onClick={(e)=>getAnswerSheetScore(e,index+1)}>
            문제 {problem.problemNum} ({problem.point}점)
				  </ListGroup.Item>
				)})
			  }
		  </ListGroup>
		</Col>
		<Col sm={10}>
		  <Tab.Content>
			{
			  problems.map((problem,index)=>{
				return (
				  <Tab.Pane key={index} eventKey={"#problem"+index}>
            <div className="row d-flex justify-content-end">
              <div className="col-md-4">
                <InputGroup >
                  <InputGroup.Text>점수</InputGroup.Text>
                    <FormControl
                      name="score"
                      value={state.score}
                      onChange={(e)=>onChangehandler(e)}
                    />
                  <Button style={{backgroundColor:"#575757", borderColor:"gray"}} onClick={(e)=>enterScore(e,index+1)}>입력</Button>
                </InputGroup>
              </div>
              </div>
              <div className="row my-3">
                <div className="col-md-12">
                  <span style={{fontSize:"20px", fontWeight:"bold"}}>
                    {problem.question.split("\n").map((line)=>{
                      return <div>{line}</div>
                    })}
                  </span>
                  <Image className="mt-2 col-md-5" src={problem.attachedFile} />
                <div>
              </div>
            </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div style={{backgroundColor:"#ffb649", textAlign:"center", padding:"4px",  margin:"10px", borderRadius:"5px", fontWeight:"bold"}}>모범 답안</div>
                <div style={{border:"1px solid gray", height:"70vh", borderRadius:"5px"}}>
                  <Pagination style={{marginBottom:"0%"}}>
                    {TestAnswerSheetUrl.map((data,idx)=>(
                      <Pagination.Item key={idx+1} active={idx+1 === active} onClick={()=>changeTestAnswerSheet(idx)}>
                      {idx+1}
                    </Pagination.Item>
                    ))}
                  </Pagination>
                  {TestAnswerSheetImgUrl != ""? 
                    <Image src={TestAnswerSheetImgUrl} style={{width:"100%", height:"92%", marginTop:"0%"}}/>:
                    <h4 style={{marginTop:"50%", textAlign:"center"}}>등록된 답안이 없습니다.</h4>}
                </div>
              </div>
              <div className="col-md-4">
                <div style={{backgroundColor:"#ffc0cb", textAlign:"center", padding:"4px", margin:"10px", borderRadius:"5px", fontWeight:"bold"}}>학생 답안지 제출본</div>
                <Image src={imageUrl} style={{  borderRadius:"5px", height:"70vh", width:"100%"}}/>
              </div>
              <div className="col-md-4">
                <div style={{backgroundColor:"#59a5fc", textAlign:"center", padding:"4px", margin:"10px", borderRadius:"5px", fontWeight:"bold"}}>학생 답안지 캡쳐본</div>
                <Image src={captureimageUrl} style={{ borderRadius:"5px", width:"100%", height:"70vh"}}/>
              </div>
            </div>

				  </Tab.Pane>
				)
			  })
			}
		  </Tab.Content>
		</Col>
		</Row>
      </Tab.Container>}
      </>
  )
}

export default ScoringTests;