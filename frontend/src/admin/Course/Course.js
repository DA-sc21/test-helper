import React, { useState, useEffect } from 'react';
import {coursePaginate} from "./CoursePaginate";
import { Button,Badge,Table,Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import CourseFooter from './CourseFooter';
import {baseUrl} from "../../component/baseUrl";
import "./Course.css"

const AdminCourse = (props) => {
  let history = useHistory();
  const [course, setCourse] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInfoShown, setIsInfoShown] = useState(false);
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
    setCourse(props.course);

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


  async function registerSubject(e,id){
    setId(id);
    let allCourse = props.course
    let registerCourse = allCourse.filter((data)=>data.id === id)[0];
    console.log(registerCourse);

    if(registerCourse.registered == "PENDING"){
      let response = await fetch(baseUrl+`/admin/classes/`+id,{
        method: 'POST',
        credentials : 'include'
      })
      .then( res => {
        console.log("response:", res);
        if(res.status === 200){
          alert(`${registerCourse.name} 수업을 등록하였습니다.`);
          const result = allCourse.map((data)=>{
              if(data.id == id){
                data.registered = "DONE";
              }         
              return data;
          })
          console.log(result);
          props.change(result);
        }
        else{
          alert(`${registerCourse.name} 수업 추가에 실패하였습니다.`);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert("test helper 관리자에게 문의하세요.");
    });
    }

    else{
      // DELETE, PUT은 local에서 preflight 오류 local 용
      // let response = await fetch(baseUrl+`/admin/classes/delete/`+id,{
      //   method: 'POST',
      //   credentials : 'include'
      // })
      //server 용 
      let response = await fetch(baseUrl+`/admin/classes/`+id,{
        method: 'DELETE',
        credentials : 'include'
      })
      .then(res=>res.json())
      .then( res => {
        console.log("response:", res);
        if(res.errorMessage!=undefined){
          alert(res.errorMessage);
        }
        else{
          alert(`${registerCourse.name} 수업을 등록 취소하였습니다.`)
          const result = allCourse.map((data)=>{
            if(data.id == id){
              data.registered = "PENDING";
            }         
            return data;
        })
        console.log(result);
        props.change(result);
          // document.location.href="/admin/courses";
        }

      })
      .catch(error => {
        console.error('Error:', error);
        alert("test helper 관리자에게 문의하세요.");
      });
    }
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
              <td><Button className="btn btn-warning btn-register"  onClick={(e)=>registerSubject(e,data.id)} disabled={joinStatus==="PENDING"}>수업 등록/미등록</Button></td>
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
            <div className="adminContent">
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
                  <th onMouseEnter={() => setIsInfoShown(true)}
                      onMouseLeave={() => setIsInfoShown(false)}>수업 등록 상태 변경
                      {isInfoShown && (
                       <div className={"divRegister"}>
                         교수자, 조교 모두 등록 시 수업 등록/미등록이 가능합니다.
                      </div>
                  )}</th>
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