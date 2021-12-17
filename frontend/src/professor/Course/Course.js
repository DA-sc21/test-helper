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
  const [isSorted, setIsSorted] = useState(false);

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
    setIsSorted(true);
    history.push('/courses');
    console.log(courseList);
  }
  function restoreCourse(){
    let courseList = course.sort(function(a, b) { // 오름차순
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });
    setCourse(courseList);
    setIsSorted(false);
    history.push('/courses');
  }

  if(!loading)return(<Loading></Loading>)
  return(
    <div className="box">
      <div className="content">
        {isSorted === false?
        <Button className="sortCourseBt" onClick={(e)=>sortCourse(e)} style={{backgroundColor:"#4c5272", borderColor:"#4c5272"}}>이름순 정렬</Button> : 
        <Button className="restoreCourseBt" onClick={(e)=>restoreCourse(e)} style={{backgroundColor:"#b2b6ce", borderColor:"#b2b6ce", color:"black"}}>강의 생성순 정렬</Button>
        }
        <p className="semester">{year}학년 {semester}학기</p>
        {course.map((data,i)=>{
        console.log(data)
        return <Card key={i} className="cardbox" onClick={()=>history.push(`/courses/${data.id}`)}>
          <div className="cardline"></div>
          <Card.Body>
            <p className="courseName">{data.name}</p>
          </Card.Body>
        </Card>
        })}
      </div>
    </div>
  )
}

export default Course;