import React, { useState, useEffect } from 'react';
import {coursePaginate} from "./CoursePaginate";
import { Card, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import CourseFooter from './CourseFooter';
import "./Course.css"

const AdminCourse = (props) => {
  let history = useHistory();
  const [course, setCourse] = useState(props.course);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(()=>{

  },[])
    const handlePageChange = (page) => {
        setCurrentPage(page);
        console.log(currentPage);
    }
    const pagedCourses = coursePaginate(course, currentPage, pageSize);

    const courseList = pagedCourses.map((data,index)=>{
        return(
            <Card key={index} className="cardbox" onClick={()=>history.push(`/admin/courses/${data.id}`)}>
              <div className="cardline"></div>
              <Card.Body>
                <p className="index">{(currentPage-1)*10+index+1}</p>
                <p className="courseName">{data.name}</p>
                <p className="professorName">{data.professor.name}</p>
              </Card.Body>
            </Card>
        )
    });

    if(course.length === 0){
        return(
        <div className={""}>
            <p>no classes</p>
        </div>
        );
    }
    else{
        console.log(currentPage)
        return (
            <div className="content">
            <div className="content">
                <h4 className="courseCount">총 {course.length} 개의 수업이 있습니다.</h4>
                {courseList}
                <CourseFooter itemsCount={course.length} pageSize={pageSize} currentPage={currentPage}
                              onPageChange={handlePageChange} />
            </div>
            </div>
        );
    }

  }


export default AdminCourse;