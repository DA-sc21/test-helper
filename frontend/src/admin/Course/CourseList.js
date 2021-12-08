import React, { useState, useEffect } from 'react';
import { Card, Button} from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';
import AdminCourse from './Course';
import "./Course.css"

const AdminCourseList = () => {
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState([]);
  const [sortValue, setSortValue] = useState("course");
  const [searchOption, setSearchOption] = useState("byCourseName");
  const [searchValue, setSearchValue] = useState("");
  const [year, setYear] = useState(0);
  const [semester, setSemester] = useState(0);
  const [registerStatus, setResisterStatus] = useState("all");

  useEffect(()=>{
    if(!sessionStorage.getItem("isAdmin")){
        alert("관리자 로그인 후 사용 가능합니다.");
        document.location.href="/admin";
    }

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
  async function logout(e){
    sessionStorage.removeItem("isAdmin");
    alert("로그아웃 되었습니다.")
    history.push("/admin")
  }

  async function getCoursesList(){
    let response = await fetch(baseUrl+'/admin/university/classes',{
			method: 'GET',
			credentials : 'include',
		  })
      .then((res) => res.json())
		  .then((result) => {
			console.log("response:", result)
			setCourse(result);
      setLoading(true);
		// 	console.log(result.data)
		  })
		  .catch(error => {console.error('Error:', error)});

  }


  function handleSearch(e){
    setSearchOption(e.target.value);
   }

   function handleValueChange(e){
      let nextState = {};
      nextState[e.target.name] = e.target.value;
      setSearchValue(e.target.value);
    } 

    function renderSearch(){
        if(searchOption==="byCourseName"){
            return(
                <Link to ={`/admin/courses/searchbycourse/${searchValue}`}>
                    <button className={"courseSearch"}>Search</button>
                </Link>
            );
        }
        else if(searchOption==="byCourseCode"){
            return(
                <Link to ={`/admin/courses/searchbycode/${searchValue}`}>
                    <button className={"courseSearch"}>Search</button>
                </Link>
            );
        }
        else{
            return(
                <Link to ={`/admin/courses/searchbyprofessor/${searchValue}`}>
                    <button className={"courseSearch"}>Search</button>
                </Link>
            );
        }
    }



  if(!loading)return(<Loading></Loading>)
  else{
    const sortCourse = (value) => {
        let courseList = course.sort(function(a, b) { 
            if (value==="course"){
                return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
            }
            return a.professor.name < b.professor.name ? -1 : a.professor.name > b.professor.name ? 1 : 0;
        });
        return courseList
    }

    let courseList = sortCourse(sortValue);
    if (registerStatus === "register"){
      courseList=courseList.filter((data)=>data.registered === "DONE")
    }
    else if(registerStatus == "unregister"){
      courseList=courseList.filter((data)=>data.registered === "PENDING")
    }

    // console.log(courseList)

   return(
      <div className="content">
        <Link to={`/admin/courses`}><img src={'/img/admin_logo.png'} className = {"logo"} alt={"admin page"}/></Link>
        <Button className="logout" onClick={(e)=>logout(e)} style={{backgroundColor:"#4c5272", borderColor:"#4c5272"}}>로그아웃</Button>
        <div className="content">
        <p className="semester">{year}학년 {semester}학기</p>
        <div className="showCourse">
        <Button button type="button" className="btn btn-light shadow-sm sortCourseBt" onClick={(e)=>setResisterStatus(e.target.value)} style={{borderColor:"#4c5272"}} value = "allr"> 모든 수업 조회</Button>
        <Button button type="button" className="btn btn-light shadow-sm sortCourseBt" onClick={(e)=>setResisterStatus(e.target.value)} style={{borderColor:"#4c5272"}} value = "register">등록된 수업 조회</Button>
        <Button button type="button" className="btn btn-light shadow-sm sortCourseBt" onClick={(e)=>setResisterStatus(e.target.value)} style={{borderColor:"#4c5272"}} value = "unregister">등록되지 않은 수업 조회</Button>
        </div>
        <br />
        <div className="showCourse">
        {sortValue=== "course"?
        <Button button type="button" className="btn btn-light shadow-sm sortCourseBt" onClick={(e)=>setSortValue(e.target.value)} style={{borderColor:"#4c5272", backgroundColor:"#b2b6ce"}} value = "professor">교수 이름순 정렬</Button>:
        <Button button type="button" className="btn btn-light shadow-sm sortCourseBt" onClick={(e)=>setSortValue(e.target.value)} style={{borderColor:"#4c5272", backgroundColor:"#b2b6ce"}} value = "course">과목 이름순 정렬</Button> 
        }
        </div>
        <br />
        <select className="searchOption" onChange={handleSearch}>
            <option value = "byCourseName">과목 이름 검색</option>
            <option value="byCourseCode">과목 코드 검색</option>
            <option value="byProfessorName">교수 이름 검색</option>
         </select>
        <input type="text" className="searchField" placeholder="search" name="search" onChange={(e)=>handleValueChange(e)} value={searchValue} required />
        {renderSearch()}
        </div>
        <p className="courseCount">총 {courseList.length} 개의 수업이 있습니다.</p>
        <AdminCourse course={courseList}/>
      </div>
  )
  }
}

export default AdminCourseList;