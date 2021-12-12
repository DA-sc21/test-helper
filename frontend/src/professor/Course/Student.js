import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';

function Student(props){
  let history = useHistory();
  const path = props.path;
  const path_arr = path.split("/")
  const courseId = path_arr[path_arr.length-1];
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allStudent, setAllStudent] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchOption, setSearchOption] = useState("name");
  console.log(path,courseId);

  useEffect(()=>{
    console.log(props);
    getStudentInfo();
  },[])

  const enterEvent = (e) => {
    if (e.key === "Enter") {
        searchStudent(e.target.value);
    }
  };

  function onChangehandler(e){
    let { name , value} = e.target;
    setState({
      ...state,
      [name]: value,
    });
    console.log(state);
  }

  function handleSearchOption(e){
    setSearchOption(e.target.value);
  }

  

  async function getStudentInfo(){
    await axios
    .get(baseUrl+`/courses/${courseId}/students`,{
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      setAllStudent(result.data);
      setStudents(result.data);
      setLoading(true);
    })
    .catch((e)=>{ console.log("실패") })
  }



  let searchStudent = (e) => {
      console.log(state,searchOption);
      if(searchOption == "name"){
        const filterList = allStudent.filter((data) => {
            return data.name.toLowerCase().includes(state.search);
          });
          setStudents(filterList);
      }
      else{
        const filterList = allStudent.filter((data) => {
            return data.studentNumber.toLowerCase().includes(state.search);
          });
          setStudents(filterList);
      }
  }

  return(
    <div style={{marginLeft:"7%", marginTop:"2%", width:"70%"}}>
    {loading? 
    <div>
      <h4 style={{marginBottom:"3%", textAlign:"left"}}>학생 정보</h4>
      <div>
      <Button variant="light" style={{marginTop : "10px", marginBottom : "10px", float:"left", color:"black", borderColor:"gray"}} onClick={(e)=>setStudents(allStudent)}>모든 학생 조회</Button>
      <select style= {{marginLeft : "20px", marginTop : "10px", marginBottom : "10px", height : "38px", width: "10vw",float:"left"}} onChange={handleSearchOption}>
            <option value = "name">학생 이름</option>
            <option value="studentNumber">학생 번호</option>
        </select>
        <input style= {{marginLeft : "20px", marginTop : "10px", marginBottom : "10px", height : "38px", width: "20vw",float:"left"}} type="text" placeholder="search" name="search" onChange={(e)=>onChangehandler(e)} onKeyPress={(e) => enterEvent(e)} required / >
        <Button variant="secondary" style={{marginLeft : "20px", marginTop : "10px", marginBottom : "10px",float:"left", borderColor:"#4c5272"}} onClick={(e)=>{searchStudent(e.target.value)}} value = "name">search</Button>
     </div>
      <div style={{width:"85%", height:"70%", borderRadius:"10px"}}>
        <Table striped bordered hover>
          <thead style={{backgroundColor:"#abb8d1"}}>
          <tr>
          <th>#</th>
          <th>이름</th>
          <th>학생번호</th>
          </tr>
          </thead>
          <tbody>
          {students.map((data,idx)=>(
            <tr key={idx}>
            <td>{idx+1}</td>
            <td>{data.name}</td>
            <td>{data.studentNumber}</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </div>
    </div>
    :
      <div>
        <h2 style={{marginRight:"15%", marginTop:"10%"}}>정보를 불러오는 중입니다.</h2>
        <Spinner animation="border" role="status" style={{marginRight:"15%", marginTop:"2%", width:"50px", height:"50px"}}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>}
      </div>
  )
}

export default Student;