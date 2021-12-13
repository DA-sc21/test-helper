import React, { useEffect, useState } from 'react';
import { useParams, Link, Route, Switch, BrowserRouter } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';
import CourseRouter from './CourseRouter';
import './Course.css';

function CourseInfo(){
  let {courseId} = useParams();
  let path = '/courses/'+courseId;
  const [loading, setLoading] = useState(false);
  const [courseInfo, setCourseInfo] = useState([]);
  const [assistant, setAssistant] = useState([]);
  
  const menus = [
    { name: "조교 정보", path: `/courses/${courseId}/assistants`},
    { name: "시험 정보", path: `/courses/${courseId}/tests`},
    { name: "학생 정보", path: `/courses/${courseId}/students`},
  ];
  useEffect(()=>{
    getCourseInfo();
  },[])
  
  async function getCourseInfo(){
    await axios
    .get(baseUrl+path,{
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      setCourseInfo(result.data);
      setAssistant(result.data.assistants);
      setLoading(true);
    })
    .catch(()=>{ console.log("실패") })
  }

  if(!loading)return(<Loading></Loading>)
  return(
    <div style={{display: "flex", flexDirection: "row", textAlign:"center"}}>
    <div style={{display: "flex", flexDirection: "column", borderRight:"1px solid #e0e0e0", height:"91vh", width:"15%"}}>
    <div style={{width:"100%", textAlign:"center", marginTop:"4%", fontSize:"24px", marginBottom:"2%"}}>{courseInfo.name}</div>
    <div style={{borderBottom:"1px solid gray", width:"98%", marginLeft:"0.5%", boxShadow: "1px 1px 1px gray", marginBottom:"3%"}}></div>
    <Nav as="ul" defaultActiveKey={menus[0].path} className="flex-column" style={{width:"100%"}}>
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
    <CourseRouter
      path={path}
      assistant={assistant}
      courseName={courseInfo.name}
    />
    </div>
  )
}

export default CourseInfo;