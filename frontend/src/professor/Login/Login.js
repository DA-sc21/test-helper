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
  async function submitForm(e){
    await axios
    .post(baseUrl+'/sessions', null, { params:{
        password: state.password,
        username: state.username
      }},{withCredentials : true})
    .then((result)=>{
      console.log(result.data);
      if(result.data.result === true){ //로그인 성공
        // sessionStorage.setItem('username', state.username);
        // history.push("/");
        // document.location.href = '/';
      }
    })
    .catch(()=>{ console.log("실패") })
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
              <Form.Control type="email" placeholder="" name="username" onChange={(e)=>onChangehandler(e)}/>
            </Form.Group>

            <Form.Group className="w-75 mb-3">
              <Form.Label style={{fontWeight:"bold"}}>비밀번호</Form.Label>
              <Form.Control type="password" placeholder="" name="password" onChange={(e)=>onChangehandler(e)}/>
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