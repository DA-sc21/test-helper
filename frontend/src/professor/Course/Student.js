import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, InputGroup, FormControl, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';

function Student(props){
  let history = useHistory();
  const path = props.path;
  const path_arr = path.split("/")
  const courseId = path_arr[path_arr.length-1];
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState([]);
  console.log(path,courseId);

  useEffect(()=>{
    console.log(props);
    getStudentInfo();
  },[])

  async function getStudentInfo(){
    await axios
    .get(baseUrl+`/courses/${courseId}/students`,{
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      setStudent(result.data);
      setLoading(true);
    })
    .catch((e)=>{ console.log("실패") })
  }

  if(!loading)return(<Loading></Loading>)
  return(
    <div style={{marginLeft:"7%", marginTop:"2%", width:"70%"}}>
      <h4 style={{marginBottom:"3%", textAlign:"left"}}>학생 정보</h4>
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
          {student.map((data,idx)=>(
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
  )
}

export default Student;