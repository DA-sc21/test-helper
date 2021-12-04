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
		// 	console.log(result.data)
		  })
		  .catch(error => {console.error('Error:', error)});
	
		  
		// await axios
		// .get(baseUrl+'/tests/'+testId+'/problems')
		// .then((result)=>{ 
		// 	setProblems(result.data)
		// 	console.log(result.data)
		// })
		// .catch(()=>{ console.log("실패") })
	}

	async function getimages(Fileurl){
    testId=String(testId).padStart(5,"0")
    
    await axios
      .get(baseUrl+'/s3-download-url?objectKey='+{Fileurl})
      .then((result)=>{
        console.log(result.data)
      })
		.catch(()=>{ console.log("실패") })
			
  
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
								// getimages(problem.attachedFile)
								return (
									<Tab.Pane eventKey={"#link"+index}>
									{problem.question.split("\n").map((line)=>{
										return <div>{line}</div>
									})}
									<br/>
									{/* <Image className="col-md-5" src={problem.attachedFile} /> */}
									</Tab.Pane>
								)
							})
						}
					</Tab.Content>
				</Col>
			</Row>
		</Tab.Container>)
    }