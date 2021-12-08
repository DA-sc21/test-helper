import React, { useState, useEffect } from 'react';
import {coursePaginate} from "./CoursePaginate";
import { Card, Button,Badge,Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import CourseFooter from './CourseFooter';
import {baseUrl} from "../../component/baseUrl";
import "./Course.css"

const AdminCourse = (props) => {
  let history = useHistory();
  const [course, setCourse] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  

  let register_status={
    "PENDING" : "등록 대기",
    "DONE" : "등록 완료",
  }
  let register_status_css={
    "PENDING" : "secondary",
    "DONE" : "success",
  }
  useEffect(()=>{
    // setCourse(props.course);
  },[])

  async function registerSubject(e){
    let response = await fetch(baseUrl+`/admin/`,{
      method: 'POST',
      credentials : 'include'
    })
    .then( res => {
      console.log("response:", res);
      if(res.status === 200){
        history.push("/admin/courses");
      }
      else{
        alert("과목 추가 버튼이 비활성되었습니다.");
      }
    })
    .catch(error => {console.error('Error:', error)});
      } 


    const handlePageChange = (page) => {
        setCurrentPage(page);
        // console.log(currentPage);
    }

    const pagedCourses = coursePaginate(props.course, currentPage, pageSize);

    const courseList = pagedCourses.map((data,index)=>{
        if(!currentPage){
          setCurrentPage(1);
        }
        return(
              // <tr onClick={()=>history.push(`/admin/courses/${data.id}`)}>
              <tr key={index}>
              <td>{(currentPage-1)*10+index+1}</td>
              <td>{data.code}</td>
              <td>{data.name}</td>
              <td>{data.professor.name}({data.professor.email})</td>
              <td><Badge className="registerStatus" bg={register_status_css[data.professor.joined]}>{register_status[data.professor.joined]}</Badge></td>
              <td><Badge className="registerStatus" bg={register_status_css[data.registered]}>{register_status[data.registered]}</Badge></td>
              <td><Button className="btn btn-warning btn-register"  onClick={(e)=>registerSubject(e)} disabled={data.professor.joined==="PENDING"}>수업 등록/미등록</Button></td>
              </tr>
        )
    });

    if(props.course.length === 0){
        return(
        <div className={""}>
            <p>no classes</p>
        </div>
        );
    }
    else{
        return (
            <div className="content">
              <Table responsive="md">
                <thead>
                <tr>
                  <th>#</th>
                  <th>과목 코드</th>
                  <th>과목 이름</th>
                  <th>교수 이름</th>
                  <th>교수/조교 등록 상태</th>
                  <th>수업 등록 상태 </th>
                  <th>수업 등록 상태 변경</th>
              </tr>
              </thead>
              <tbody>
              {courseList}
              </tbody>
              </Table>
              <CourseFooter itemsCount={props.course.length} pageSize={pageSize} currentPage={currentPage}
                              onPageChange={handlePageChange} />
            </div>
        );
    }

  }


export default AdminCourse;