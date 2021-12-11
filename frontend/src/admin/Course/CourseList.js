import React, { useState, useEffect } from 'react';
import { Button} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';
import AdminCourse from './Course';
import "./Course.css"

const AdminCourseList = () => {
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [allCourse, setAllCourse] = useState([]);
  const [course, setCourse] = useState([]);
  const [sortValue, setSortValue] = useState("course");
  const [searchOption, setSearchOption] = useState("byCourseName");
  const [searchValue, setSearchValue] = useState("");
  const [searchFlag, setSearchFlag] = useState(false);
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
    sortCourse(sortValue);
  },[])

  const enterEvent = (e) => {
    if (e.key === "Enter") {
      handleSearch(e.target.value);
    }
  };

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
      setAllCourse(result);
      setCourse(result);
      setLoading(true);
		// 	console.log(result.data)
		  })
		  .catch(error => {console.error('Error:', error)});

  }

  function buttonCss(status) {
      return registerStatus===status ? "primary" : "outline-primary"  
  }

  function buttonSortCss(status) {
    return sortValue===status ? "secondary" : "outline-primary"  
  }
  function imageClick(e){
    setCourse(allCourse);
  }

  function handleSearchOption(e){
    setSearchOption(e.target.value);
  }

  function handleSearch(e){
    setSearchFlag(true);
    if(searchOption==="byCourseName"){
      const filterList = allCourse.filter((data) => {
        return data.name.includes(searchValue);
      });
      console.log(filterList);
      setCourse(filterList);
    }
    else if(searchOption==="byCourseCode"){
      const filterList = allCourse.filter((data) => {
        return data.code.includes(searchValue);
      });
      console.log(filterList);
      setCourse(filterList);
    }
    else{
      const filterList = allCourse.filter((data) => {
        return data.professor.name.includes(searchValue);
      });
      console.log(filterList);
      setCourse(filterList);
    }
    sortCourse(sortValue);
    console.log(searchFlag);
  }

   function handleValueChange(e){
      let nextState = {};
      nextState[e.target.name] = e.target.value;
      setSearchValue(e.target.value);
    } 

    function sortCourse(value){
      setSearchValue("");
      let courseList = course.sort(function(a, b) { 
            if (value==="course"){
                return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
            }
            return a.professor.name < b.professor.name ? -1 : a.professor.name > b.professor.name ? 1 : 0;
        });
        return courseList
    }

    function sortRegister(value){
      setSearchValue("");
      let courseList = allCourse;
      if (value === "register"){
        courseList=courseList.filter((data)=>data.registered === "DONE")
        setCourse(courseList);
      }
      else if(value == "unregister"){
        courseList=courseList.filter((data)=>data.registered === "PENDING")
        setCourse(courseList);
      }
      else{
        setCourse(courseList);
      }

    }

  if(!loading)return(<Loading></Loading>)
   return(
      <div className="adminContent">
        <div className = "logodiv">
        <img src={'/img/admin_logo.png'} className = {"logo"} alt={"admin page"} onClick={(e)=>imageClick(e)}/>
        <Button className="logout" onClick={(e)=>logout(e)} style={{backgroundColor:"#4c5272", borderColor:"#4c5272"}}>로그아웃</Button>
        </div>
        <div className="adminContent">
        <Button variant={buttonCss("all")}  onClick={(e)=>{setResisterStatus(e.target.value); sortRegister(e.target.value);}} style={{borderColor:"#4c5272"}} value = "all"> {year}학년 {semester}학기 모든 수업 조회</Button>
        <select className="searchOption" onChange={handleSearchOption}>
            <option value = "byCourseName">과목 이름 검색</option>
            <option value="byCourseCode">과목 코드 검색</option>
            <option value="byProfessorName">교수 이름 검색</option>
         </select>
        <input type="text" className="searchField" placeholder="search" name="search" onChange={(e)=>handleValueChange(e)} value={searchValue} onKeyPress={(e) => enterEvent(e)} required />
        <Button className={"btn btn-secondary search"} onClick={(e)=>{handleSearch(e.target.value)}} style={{borderColor:"#4c5272"}} value = "professor">search</Button>
        <br />
        <div className="showCourse">
        <span className = {"sortSpan"}> 전체 수업 중 등록된 수업 조회 / 미등록된 수업 조회</span>
        <Button variant={buttonCss("register")} className = {"CourseBt"} onClick={(e)=>{setResisterStatus(e.target.value); sortRegister(e.target.value);}} style={{borderColor:"#4c5272"}} value = "register">등록된 수업 조회</Button>
        <Button variant={buttonCss("unregister")} className = {"CourseBt"} onClick={(e)=>{setResisterStatus(e.target.value); sortRegister(e.target.value);}} style={{borderColor:"#4c5272"}} value = "unregister">등록되지 않은 수업 조회</Button>
        </div>

        <div className="showCourse">
        <span className = {"sortSpan"}>가나다순 정렬</span>
        <Button variant={buttonSortCss("course")} className={"CourseBt"} onClick={(e)=>{setSortValue(e.target.value); sortCourse(e.target.value)}} style={{borderColor:"#4c5272"}} value = "course">과목 이름순 정렬</Button> 
        <Button variant={buttonSortCss("professor")} className={"CourseBt"} onClick={(e)=>{setSortValue(e.target.value); sortCourse(e.target.value)}} style={{borderColor:"#4c5272"}} value = "professor">교수 이름순 정렬</Button>
        </div>
        <br />
        </div>
        <p className="courseCount">총 {course.length} 개의 수업이 있습니다.</p>
        <AdminCourse course={course} change={setAllCourse}/>
      </div>
  )
}

export default AdminCourseList;