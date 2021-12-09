import React, { useState, useEffect } from 'react';
import {coursePaginate} from "./CoursePaginate";
import { Card, Button,Badge,Table,Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import CourseFooter from './CourseFooter';
import {baseUrl} from "../../component/baseUrl";
import "./Course.css"

const AdminCourse = (props) => {
  let history = useHistory();
  const [course, setCourse] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = (e,value) => {setShow(true); setId(value)}
  

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

  function getAssistant(){
    let assistantList = props.course.map((data, index)=>{
      let arr = [];
      let courseId = 0;
      for(let ass of data.assistants){
        arr.push(ass.assistant);
        courseId = ass.courseId;
      }
      return {id : courseId,
              assistant : arr}
    });
    // setAssList(assistantList);
    return assistantList;
  }
      
    function confirm(e){
      setShow(false);
    }


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
      let joinStatus = "PENDING";
      let assStatus = "PENDING";
      let flag=1;
        if(!currentPage){
          setCurrentPage(1);
        }
        for(let ass of data.assistants){
          if(ass.assistant.joined==="PENDING"){
            flag=0;
            break;
          }
        }
        if(flag){
          assStatus = "DONE";
          if(data.professor.joined==="DONE"){
            joinStatus = "DONE";
          }
        }
        
        return(
              <tr key={index}>
              <td>{(currentPage-1)*10+index+1}</td>
              <td>{data.code}</td>
              <td>{data.name}</td>
              <td>{data.professor.name}({data.professor.email})</td>
              <td><Badge className="registerStatus" bg={register_status_css[data.professor.joined]}>{register_status[data.professor.joined]}</Badge></td>
              <td>
                <Badge className="registerStatus showModal" bg={register_status_css[assStatus]} onClick={(e)=>handleShow(e,data.id)}>{register_status[assStatus]}</Badge>
              </td>
              <td><Badge className="registerStatus" bg={register_status_css[data.registered]}>{register_status[data.registered]}</Badge></td>
              <td><Button className="btn btn-warning btn-register"  onClick={(e)=>registerSubject(e)} disabled={joinStatus==="PENDING"}>수업 등록/미등록</Button></td>
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
      const assistant = getAssistant();
      let ass = assistant.filter((data)=>data.id === id)[0];
      // console.log(ass);
        return (
            <div className="content">
              <Table responsive="md">
                <thead>
                <tr>
                  <th>#</th>
                  <th>과목 코드</th>
                  <th>과목 이름</th>
                  <th>교수자 이름</th>
                  <th>교수자 등록 상태</th>
                  <th>조교 등록 상태</th>
                  <th>수업 등록 상태 </th>
                  <th>수업 등록 상태 변경</th>
              </tr>
              </thead>
              <tbody>
              {courseList}
              </tbody>
              </Table>
               <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                <Modal.Title>조교 등록 여부</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div style={{height:"380px"}}>
                    <ul>
                    { ass ?
                      ass.assistant.map((value,idx)=>{
                      // console.log(value);
                      return(
                     <li key={idx} className = "assList"> {value.name} ({value.email}) <Badge className="registerStatus" bg={register_status_css[value.joined]}>{register_status[value.joined]}</Badge></li>
                      )}) :
                    <li>조교가 없습니다.</li>
                    }
                    </ul>
                </div>
              </Modal.Body>
              <Modal.Footer>
              <Button variant="secondary" onClick={(e)=>confirm(e)}>
                확인
              </Button>
              </Modal.Footer>
              </Modal>
              <CourseFooter itemsCount={props.course.length} pageSize={pageSize} currentPage={currentPage}
                              onPageChange={handlePageChange} />
            </div>
        );
    }

  }


export default AdminCourse;