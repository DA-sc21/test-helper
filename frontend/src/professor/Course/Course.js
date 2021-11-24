import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';
import './Course.css';

function Course(){
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
    .catch((e)=>{ console.log(e.response.data) })
  }

  if(!loading)return(<Loading></Loading>)
  return(
    <div className="box">
      <div className="content">
        <p className="semester">{year}학년 {semester}학기</p>
        {course.map((data,i)=>(
        <Card key={i} className="cardbox">
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