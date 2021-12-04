import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';
import './Course.css';

function Course(){
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState([]);
  const [year, setYear] = useState(0);
  const [semester, setSemester] = useState(0);

  useEffect(()=>{
    getDate();
    getCoursesList();
  },[])

  function getDate(){
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth()+1;
    setYear(year);
    if(month>0 && month<=8){
      setSemester(1);
    }
    else if(month>=9 && month<=12){
      setSemester(2);
    }
  }
  
  async function getCoursesList(){
    await axios
    .get(baseUrl+'/courses',{
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      setCourse(result.data);
      setLoading(true);
    })
    .catch((e)=>{ console.log("실패") })
  }
  function sortCourse(){
    let courseList = course.sort(function(a, b) { // 오름차순
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    });
    setCourse(courseList);
    console.log(courseList);
  }

  if(!loading)return(<Loading></Loading>)
  return(
    <div className="box">
      <div className="content">
        <Button className="sortCourseBt" onClick={(e)=>sortCourse(e)} style={{backgroundColor:"#4c5272", borderColor:"#4c5272"}}>이름순 정렬</Button>
        <p className="semester">{year}학년 {semester}학기</p>
        {course.map((data,i)=>(
        <Card key={i} className="cardbox" onClick={()=>history.push(`/courses/${data.id}`)}>
          <div className="cardline"></div>
          <Card.Body>
            <p className="courseName">{data.name}</p>
          </Card.Body>
        </Card>
      ))}
      </div>
    </div>
  )
}

export default Course;