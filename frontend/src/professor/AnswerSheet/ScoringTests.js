import React, { useEffect, useState } from 'react'
import { ListGroup , Col, Tab , Row, Image, InputGroup, FormControl, Button } from 'react-bootstrap'
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl"
import { useParams } from 'react-router-dom';

function ScoringTests(props){
  let path = props.path;
  const [problems, setProblems] = useState([]);
  const [state, setState] = useState([]);

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
      })
      .catch(error => {console.error('Error:', error)});
  }

  async function enterScore(e,problemNum){
    let response = await fetch(baseUrl+'/submissions/'+props.submissionId+'/problems/'+problemNum+'/score?score='+state.score,{
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
	
  return(
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
                    <Image src={props.answerSheetUrl} style={{width:"35%", marginTop:"1%"}}/>
                    <Button variant="light" style={{float:"right", marginTop:"43%", color:"black", borderColor:"gray"}} onClick={(e)=>enterScore(e,index+1)}>입력</Button>
                    <InputGroup style={{width:"30%", float:"right", marginTop:"43%"}}>
                      <InputGroup.Text>점수</InputGroup.Text>
                      <FormControl
                        name="score" 
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
      </Tab.Container>
      )
}

export default ScoringTests;