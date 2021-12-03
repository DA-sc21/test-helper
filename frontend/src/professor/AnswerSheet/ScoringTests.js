import React, { useEffect, useState } from 'react'
import { ListGroup , Col, Tab , Row, Image, InputGroup, FormControl, Button, Spinner } from 'react-bootstrap'
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';

function ScoringTests(props){
  let path = props.path;
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState([]);
  const [state, setState] = useState([]);
  const [score, setScore] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [submissionId, setSubmissionId] = useState("");

  useEffect(()=>{
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
      getAllAnswerSheetScore(problem, result.data.id);
    })
    .catch(()=>{ console.log("실패") })
  }

  async function getAllAnswerSheetScore(data, id){
    let temp = [];
    for(let i=1; i<=data.length; i++){
      let response = await fetch(baseUrl+'/submissions/'+id+'/problems/'+i+'/score',{
        method: 'GET',
        credentials : 'include',
        })
        .then((res) => res.json())
        .then((res) => {
          console.log("response:", res);
          temp.push(res.score);
        })
        .catch(error => {console.error('Error:', error)});
    }
    if(data.length>0){
      console.log(temp);
      setScore(temp);
    }
    setLoading(true); 
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
          setLoading(false);
          getAllAnswerSheetScore(problems,submissionId);
        }
        else{
          alert(res.errorMessage);
        }
        console.log("response:", res);
      })
      .catch(error => {console.error('Error:', error)});
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
	<Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
	  <Row>
		<Col sm={2}>
		  <ListGroup>
			{
			  problems.map((problem,index)=>{
				return (
				  <ListGroup.Item key={index} action href={"#problem"+index}>
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
					<span style={{fontSize:"20px"}}>{problem.question} ({problem.point}점)</span>
					<br/>
                    {/* <Image className="col-md-5" src={problem.attachedFile} /> */}
                    <Image src={imageUrl} style={{width:"35%", marginTop:"1%"}}/>
                    <Button variant="light" style={{float:"right", marginTop:"43%", color:"black", borderColor:"gray"}} onClick={(e)=>enterScore(e,index+1)}>입력</Button>
                    <InputGroup style={{width:"30%", float:"right", marginTop:"43%"}}>
                      <InputGroup.Text>점수</InputGroup.Text>
                      <FormControl
                        name="score"
                        defaultValue={score[index]}
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