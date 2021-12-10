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
    .get(baseUrl+path+`/students/${props.studentId}/submissions?includeCapture=false`,{
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      setSubmissionId(result.data.id);
      setImageUrl(result.data.answerSheetDownloadUrl);
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
		<Col sm={9}>
		  <Tab.Content>
			{
			  problems.map((problem,index)=>{
				return (
				  <Tab.Pane key={index} eventKey={"#problem"+index}>
					  <span style={{fontSize:"17px"}}>
              {problem.question.split("\n").map((line)=>{
							  return <div>{line}</div>
							})}
            </span>
            {/* <Image className="col-md-5" src={problem.attachedFile} /> */}
            <div style={{float:"right", marginRight:"38%", marginTop:"1%", backgroundColor:"#ffb649", width:"100px", textAlign:"center", padding:"2px", borderRadius:"5px", fontWeight:"bold"}}>시험 답안지</div>
            <div style={{marginLeft:"13%", marginTop:"1%", backgroundColor:"#59a5fc", width:"100px", textAlign:"center", padding:"2px", borderRadius:"5px", fontWeight:"bold"}}>학생 답안지</div>
            <div style={{border:"1px solid gray", float:"right", width:"35%", height:"70vh", marginRight:"25%", borderRadius:"5px"}}>
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
            <Image src={imageUrl} style={{width:"35%", height:"70vh", marginTop:"0%"}}/>
              
            <Button style={{marginTop:"1%", backgroundColor:"#575757", borderColor:"gray"}} onClick={(e)=>enterScore(e,index+1)}>입력</Button>
            <InputGroup style={{float:"left", width:"30%", marginTop:"1%"}}>
            <InputGroup.Text>점수</InputGroup.Text>
              <FormControl
                name="score"
                value={state.score}
                onChange={(e)=>onChangehandler(e)}
              />
            </InputGroup>
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