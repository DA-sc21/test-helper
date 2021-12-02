import React, { useEffect, useState } from 'react';
import { useParams, Link, Route, Switch, BrowserRouter } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import axios from 'axios';
import {baseUrl} from "../component/baseUrl";
import Loading from '../component/Loading';
import TestsRouter from './TestsRouter';

function UnscoredTests(props){
  let testName = props.location.state.testName;
  let {testId} = useParams();
  let path = '/tests/'+testId;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const menus = [
    { name: "학생 답안지", path: `/tests/${testId}/students`},
  ];
  useEffect(()=>{
    getStudentList();
  },[])

  async function getStudentList(){
    await axios
    .get(baseUrl+path+'/submissions?studentNumber=2',{ //학생 전체 조회
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      setStudents(result.data);
      setLoading(true);
    })
    .catch(()=>{ console.log("실패") })
  }
  
  if(!loading)return(<Loading></Loading>)
  return(
    <div style={{display: "flex", flexDirection: "row", textAlign:"center"}}>
    <div style={{display: "flex", flexDirection: "column", borderRight:"1px solid #e0e0e0", height:"91vh", width:"15%"}}>
    <div style={{width:"100%", textAlign:"center", marginTop:"4%", fontSize:"20px", marginBottom:"2%"}}>{testName}</div>
    <div style={{borderBottom:"1px solid gray", width:"98%", marginLeft:"0.5%", boxShadow: "1px 1px 1px gray", marginBottom:"3%"}}></div>
    <Nav as="ul" className="flex-column" style={{width:"100%"}}>
      {
        menus.map((data,index)=>{
          return(
            <Nav.Item key={index} as="li">
              <Nav.Link  as={Link} to ={data.path} eventKey={"link-"+index} className="menuLink">{data.name}</Nav.Link>
            </Nav.Item>
          )
        })
      }
    </Nav>
    </div>
    </div>
  )
}

export default UnscoredTests;