import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { baseUrl } from "../../component/baseUrl";
import axios from 'axios';

function Login(){
  const [state, setState] = useState([]);
  let history = useHistory();
  function onChangehandler(e){
    let { name , value} = e.target;
    setState({
      ...state,
      [name]: value,
    });
    console.log(state);
  }
  const enterEvent = (e) => {
    if (e.key === "Enter") {
      submitForm();
    }
  };

  async function submitForm(e){
    let email = state.username.split('@');
    let response = await fetch(baseUrl+`/sessions?password=${state.password}&username=${email[0]}%40${email[1]}`,{
      method: 'POST',
      credentials : 'include'
    })
    .then( res => {
      console.log("response:", res);
      if(res.status === 200){
        alert("로그인에 성공했습니다.");
        getCookie("da_name");
        getCookie("da_role");
        sessionStorage.setItem("isAuthorized", "true");
        document.location.href="/";
        // history.push("/");
      }
      else{
        alert("로그인에 실패했습니다.");
      }
    })
    .catch(error => {console.error('Error:', error)});
  }

  function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");
    // Loop through the array elements
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        
        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            // console.log(decodeURIComponent(cookiePair[1]));
            if(name === "da_name"){
              sessionStorage.setItem("name", decodeURIComponent(cookiePair[1]));
            }
            else if(name === "da_role"){
              sessionStorage.setItem("role", decodeURIComponent(cookiePair[1]));
            }
            return decodeURIComponent(cookiePair[1]);
        }
    }
    // Return null if not found
    return null;
}

  return(
    <div style={{backgroundColor:"#2a2f38", height:"100vh", textAlign:"center"}}>
      <div style={{color:"white", marginBottom:"2%", paddingTop:"1.5%", textShadow:"2px 2px 2px #3e475c"}}>
      <h1 style={{marginTop:"5%"}}>Test-Helper</h1>
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
        <div style={{textDecoration:"underline", textAlign:"right", marginTop:"5%", marginRight:"13%", fontSize:"17px"}}><Link to="/signup" style={{color:"#525252"}}>회원가입</Link></div>
      </div>
    </div>
  )
}

export default Login;