import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { baseUrl } from "../../component/baseUrl";

function AdminLogin(){
  let history = useHistory();
  const [state, setState] = useState([]);

  const enterEvent = (e) => {
    if (e.key === "Enter") {
      submitForm();
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
  
  async function submitForm(e){
    let email = state.username.split('@');
    let response = await fetch(baseUrl+`/admin/sessions?password=${state.password}&username=${email[0]}%40${email[1]}`,{
      method: 'POST',
      credentials : 'include'
    })
    .then( res => {
      console.log("response:", res);
      if(res.status === 200){
        alert("관리자 로그인에 성공했습니다.");
        sessionStorage.setItem("isAuthorized", "true");
        history.push("/admin/courses");
      }
      else{
        alert("올바른 정보를 입력해주세요.");
      }
    })
    .catch(error => {console.error('Error:', error)});
  }

  return(
    <div style={{backgroundColor:"#2a2f38", height:"100vh", textAlign:"center"}}>
      <div style={{color:"white", marginBottom:"2%", paddingTop:"1.5%", textShadow:"2px 2px 2px #3e475c"}}>
      <h1 style={{marginTop:"5%"}}>Test-Helper admin page</h1>
      </div>
      <div style={{width:"40%", height:"52%", backgroundColor:"white", display:"inline-block", marginTop:"0%", borderRadius:"10px"}}>
        <div style={{textAlign:"left", marginTop:"10%", marginLeft:"17%"}}>
          <Form>
            <Form.Group className="w-75 mb-3">
              <Form.Label style={{fontWeight:"bold"}}>이메일</Form.Label>
              <Form.Control type="email" placeholder="" name="username" onKeyPress={(e) => enterEvent(e)} onChange={(e)=>onChangehandler(e)}/>
            </Form.Group>

            <Form.Group className="w-75 mb-3">
              <Form.Label style={{fontWeight:"bold"}}>비밀번호</Form.Label>
              <Form.Control type="password" placeholder="" name="password" onKeyPress={(e) => enterEvent(e)} onChange={(e)=>onChangehandler(e)}/>
            </Form.Group>
          </Form>
        </div>
        <Button style={{marginTop:"7%", width:"75%", backgroundColor:"#3e475c", borderColor:"#3e475c"}} onClick={(e)=>submitForm(e)}>로그인</Button>
      </div>
    </div>
  )
}


export default AdminLogin;
