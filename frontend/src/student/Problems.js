import React, { useEffect, useState } from 'react'
import { ListGroup , Col, Tab ,Row,Image } from 'react-bootstrap'
import axios from 'axios';
import {baseUrl} from "../component/baseUrl"
import { useParams } from 'react-router-dom';

export function Problems(props){
  let [problems,setProblems] = useState([]);
	let {testId}= useParams();

	useEffect(()=>{
    getProblems();
	},[]);
	
	async function getProblems(){
		let response = await fetch(baseUrl+'/tests/'+testId+'/problems',{
			method: 'GET',
			credentials : 'include',
		  })
		  .then((res) => res.json())
		  .then((res) => {
			console.log("response:", res);
			setProblems(res)
		  })
		  .catch(error => {console.error('Error:', error)});
	
	}

	return(
		<Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
			<Row>
				<Col sm={3}>
					<ListGroup>
						{
							problems.map((problem,index)=>{
								return (
								<ListGroup.Item action href={"#link"+index}>
									문제 {problem.problemNum} ({problem.point})
								</ListGroup.Item>
								)
							})
						}
					</ListGroup>
				</Col>
				<Col sm={9}>
					<Tab.Content>
						{
							problems.map((problem,index)=>{
								return (
									<Tab.Pane eventKey={"#link"+index}>
									{problem.question.split("\n").map((line)=>{
										return <div>{line}</div>
									})}
									<br/>
									<Image className="col-md-5" src={problem.attachedFile} />
									</Tab.Pane>
								)
							})
						}
					</Tab.Content>
				</Col>
			</Row>
		</Tab.Container>)
    }