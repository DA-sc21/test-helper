import React, { useState, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap';
import { baseUrl } from "../../component/baseUrl";
import axios from 'axios';

function SignUp(){
  const [state, setState] = useState([]);
  const [timerId, setTimerId] = useState(false);
  const [minutes, setMinutes] = useState(3);
  const [seconds, setSeconds] = useState(0);

  function onChangehandler(e){
    let { name , value} = e.target;
    setState({
      ...state,
      [name]: value,
    });
    console.log(state);
  }

  async function submitForm(e){
    let data = {
      "email": state.email,
      "name": state.name,
      "password": state.password,
      "role": state.role
    }
    console.log(JSON.stringify(data));
    await axios
    .post(baseUrl+'/users', JSON.stringify(data),{
      headers: { "Content-Type": `application/json`}
        })
    .then((result)=>{
      console.log(result.data);
    })
    .catch(()=>{ console.log("실패") })
  }

  async function verifyEmail(e){
    console.log(state.email);
    let data = {
      email : state.email
    }
    console.log(JSON.stringify(data));
    await axios
    .post(baseUrl+'/users/email/validate', JSON.stringify(data),{
      headers: { "Content-Type": `application/json`}
        })
    .then((result)=>{
      console.log(result.data);
      setMinutes(3);
      setSeconds(0);
      setTimerId(true);
    })
    .catch((e)=>{ console.log(e) })
  }

  async function confirmEmail(e){
    let data = {
      "code": state.verificationCode,
      "email": state.email
    }
    console.log(JSON.stringify(data));
    await axios
    .post(baseUrl+'/users/email/confirm', JSON.stringify(data),{
      headers: { "Content-Type": `application/json`}
        })
    .then((result)=>{
      console.log(result.data);
      if(result.data.result === true){
        alert("이메일 인증이 완료되었습니다.");
      }
    })
    .catch(()=>{ console.log("실패") })
  }

  useEffect(()=>{
    const countdown = setInterval(() => {
      console.log(minutes, seconds)
      if(seconds > 0){
        setSeconds(seconds-1);
      }
      else if(seconds === 0 ){
        if(minutes ===0 ){
          clearInterval(countdown);
          setTimerId(false);
        }
        else{
          setMinutes(minutes-1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => clearInterval(countdown);
  },[timerId,minutes,seconds])

  return(
    <div style={{backgroundColor:"#2a2f38", height:"100vh", textAlign:"center"}}>
      <div style={{color:"white", marginBottom:"0", paddingTop:"1.5%", textShadow:"2px 2px 2px #3e475c"}}>
      <h1>Test-Helper</h1>
      </div>
      <div style={{width:"40%", height:"87%", backgroundColor:"white", display:"inline-block", marginTop:"0%", borderRadius:"10px"}}>
        <div style={{textAlign:"left", marginTop:"4%", marginLeft:"14%"}}>
          <Form>
            <Form.Group className="w-75 mb-3">
              <Form.Label style={{fontWeight:"bold"}}>이름</Form.Label>
              <Form.Control type="name" placeholder="name" name="name" onChange={(e)=>onChangehandler(e)}/>
            </Form.Group>

            <Button style={{float:"right", marginTop:"6%", marginRight:"8%", backgroundColor:"#4c5974", borderColor:"#4c5974"}} onClick={(e)=>verifyEmail(e)}>인증</Button>

            <Form.Group className="w-75 mb-3" >
              <Form.Label style={{fontWeight:"bold"}}>이메일</Form.Label>
              <Form.Control type="email" placeholder="id@example.com" name="email" onChange={(e)=>onChangehandler(e)}/>
            </Form.Group>
            
            <Button style={{float:"right", marginTop:"6%", marginRight:"8%", backgroundColor:"#4c5974", borderColor:"#4c5974"}} onClick={(e)=>confirmEmail(e)}>확인</Button>

            <Form.Group className="w-75 mb-3">
              <Form.Label style={{fontWeight:"bold"}}>인증 번호 {timerId? <span style={{color:"#162f5f"}}> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span> : <span></span>}</Form.Label>
              <Form.Control placeholder="" name="verificationCode" onChange={(e)=>onChangehandler(e)}/>
            </Form.Group>

            <Form.Group className="w-75 mb-3">
              <Form.Label style={{fontWeight:"bold"}}>비밀번호</Form.Label>
              <Form.Control type="password" placeholder="password" name="password" onChange={(e)=>onChangehandler(e)}/>
            </Form.Group>

            <Form.Group className="w-75 mb-3">
              <Form.Label style={{fontWeight:"bold"}}>비밀번호 확인</Form.Label>
              <Form.Control type="password" placeholder="password"/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{fontWeight:"bold"}}>역할</Form.Label>
              <Form.Check
                type="radio"
                label="조교"
                name="role"
                value="ASSISTANT"
                style={{float:"right", marginTop:"6%", marginRight:"40%"}}
                onChange={(e)=>onChangehandler(e)}  
              />
              <Form.Check
                type="radio"
                label="교수"
                name="role"
                value="PROFESSOR"
                style={{marginLeft:"15%"}}
                onChange={(e)=>onChangehandler(e)}  
              />
            </Form.Group>
          </Form>
        </div>
        <Button style={{marginTop:"3%", width:"80%", backgroundColor:"#3e475c", borderColor:"#3e475c"}} onClick={(e)=>submitForm(e)}>회원가입</Button>
      </div>
    </div>
  )
}

export default SignUp;