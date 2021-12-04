import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
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

  useEffect(()=>{
    if(!sessionStorage.getItem("isAdmin")){
        alert("관리자 로그인 후 사용 가능합니다.");
        document.location.href="/admin";
    }

    getDate();
    getCoursesList();
  },[])

//   const enterEvent = (e) => {
//     if (e.key === "Enter") {
//       search();
//     }
//   };

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
    await axios
    .get(baseUrl+'/admin/university/classes',{
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      setCourse(result.data);
      setLoading(true);
    })
    .catch((e)=>{ console.log("실패") })
  }


  function handleSearch(e){
    setSearchOption(e.target.value);
   }

   function handleValueChange(e){
      let nextState = {};
      nextState[e.target.name] = e.target.value;
      setSearchValue(e.target.value);
    } 

    async function createSubject(e){
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

    const courseList = sortCourse(sortValue);

   return(
      <div className="content">
        <div className="content">
          <h1>관리자 페이지</h1>
            <Button className="logout" onClick={(e)=>logout(e)} style={{backgroundColor:"#4c5272", borderColor:"#4c5272"}}>로그아웃</Button>
        </div>
        <div className="content">
        <Button className="sortCourseBt" onClick={(e)=>setSortValue(e.target.value)} style={{backgroundColor:"#4c5272", borderColor:"#4c5272"}} value = "course">과목 이름순 정렬</Button>
        <Button className="sortCourseBt" onClick={(e)=>setSortValue(e.target.value)} style={{backgroundColor:"#4c5272", borderColor:"#4c5272"}} value = "professor">교수 이름순 정렬</Button>
        <select className="searchOption" onChange={handleSearch}>
            <option value = "byCourseName">과목 이름 검색</option>
            <option value="byCourseCode">과목 코드 검색</option>
            <option value="byProfessorName">교수 이름 검색</option>
         </select>
        <input type="text" className="searchField" placeholder="search" name="search" onChange={(e)=>handleValueChange(e)} value={searchValue} required />
        {renderSearch()}
        </div>
        <p className="semester">{year}학년 {semester}학기</p>
        <Button className="sortCourseBt" onClick={(e)=>createSubject(e)} style={{backgroundColor:"#4c5272", borderColor:"#4c5272"}}>과목추가</Button>
        <AdminCourse course={courseList}/>
      </div>
  )
  }
}

export default AdminCourseList;