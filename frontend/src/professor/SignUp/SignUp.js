import React, { useState, useEffect } from 'react'
import { Button, Form,Modal } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { baseUrl } from "../../component/baseUrl";
import axios from 'axios';

function SignUp(){
  const emailValidation = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
  const pwValidation = /^.*(?=^.{8,16}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[~,!,@,#,$,*,(,),=,+,_,.,|]).*$/;
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [confirmCode, setConfirmCode] = useState();
  const [code, setCode] = useState();
  const [state, setState] = useState([]);
  const [timerId, setTimerId] = useState(false);
  const [minutes, setMinutes] = useState(3);
  const [seconds, setSeconds] = useState(0);
  let history = useHistory();

  const [showQuestion, setShowQuestion] = useState(false);
  const handleQuestionClose = () => setShowQuestion(false);
  const handleQuestionShow = () => setShowQuestion(true);

  function onChangehandler(e){
    let { name , value} = e.target;
    setState({
      ...state,
      [name]: value,
    });
    console.log(state);
  }

  async function checkEmail(){
    if(emailValidation.test(state.email) === false){
      setEmail(false);
      return false;
    }
    else{
      setEmail(true);
      return true;
    }
  }
  async function checkPassword(){
    if(pwValidation.test(state.password) === false){
      setPassword(false);
      return false;
    }
    else{
      setPassword(true);
      return true;
    }
  }
  async function checkConfirmPassword(){
    if(state.password != state.confirmpassword){
      setConfirmPassword(false);
      return false;
    }
    else{
      setConfirmPassword(true);
      return true;
    }
  }
  async function checkConfirmCode(){
    if(confirmCode === false || confirmCode === undefined){
      setCode(false);
      return false;
    }
    else{
      setCode(true);
      return true;
    }
  }

  async function submitForm(e){
    let isEmail = await checkEmail();
    let isPassword = await checkPassword();
    let isConfirmPassword = await checkConfirmPassword();
    let isConfirmCode = await checkConfirmCode();

    let data = {
      "email": state.email,
      "password": state.password,
    }
    console.log(JSON.stringify(data));
    console.log(isEmail,isPassword,isConfirmPassword,isConfirmCode,confirmCode);
    if(isEmail && isPassword && isConfirmPassword && isConfirmCode && confirmCode){
      await axios
      .post(baseUrl+'/users', JSON.stringify(data),{
        headers: { "Content-Type": `application/json`}
          })
      .then((result)=>{
        console.log(result.data);
        alert("회원가입에 성공했습니다.");
        history.push("/login");

      })
      .catch(()=>{ 
        console.log("실패");
        alert("회원가입에 실패했습니다.");
      })
    }
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
    .then((res)=>{
      // response 이미 있는 경우, 성공한 경우, 실패한 경우에 따라 다르게 처리 필요
      console.log(res);
      alert("이메일을 전송하였습니다.");
      setMinutes(3);
      setSeconds(0);
      setTimerId(true);
    })
    .catch((e)=>{ 
      alert(e.response.data.errorMessage);
    })
    
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
        setConfirmCode(true);
        alert("이메일 인증에 성공했습니다.");
      }
    })
    .catch((e)=>{ 
      console.log("실패");
      alert(e.response.data.errorMessage);
     })
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
      <div style={{color:"white", marginBottom:"2%", paddingTop:"1.5%", textShadow:"2px 2px 2px #3e475c"}}>
      <h1>Test-Helper</h1>
      </div>
      <div style={{width:"40%", height:"75%", backgroundColor:"white", display:"inline-block", marginTop:"0%", borderRadius:"10px"}}>
        <div style={{textAlign:"left", marginTop:"10%", marginLeft:"15%"}}>
          <Form>
            <Button style={{float:"right", marginTop:"6%", marginRight:"8%", backgroundColor:"#4c5974", borderColor:"#4c5974"}} onClick={(e)=>verifyEmail(e)}>인증</Button>

            <Form.Group className="w-75 mb-0" >
              <Form.Label style={{fontWeight:"bold"}}>이메일</Form.Label>
              <Form.Control type="email" placeholder="id@example.com" name="email" onChange={(e)=>onChangehandler(e)}/>
            </Form.Group>
            {email === false ? <p style={{marginTop:"0", marginBottom:"0", color:"red", fontSize:"14px"}}>이메일은 @를 포함한 영문, 숫자만 가능합니다</p>: <p style={{marginTop:"0", marginBottom:"0", fontSize:"14px"}}>&nbsp;</p>}
            
            <Button style={{float:"right", marginTop:"6%", marginRight:"8%", backgroundColor:"#4c5974", borderColor:"#4c5974"}} onClick={(e)=>confirmEmail(e)}>확인</Button>

            <Form.Group className="w-75 mb-0">
              <Form.Label style={{fontWeight:"bold"}}>인증 번호 {timerId? <span style={{color:"#162f5f"}}> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span> : <span></span>}</Form.Label>
              <Form.Control placeholder="" name="verificationCode" onChange={(e)=>onChangehandler(e)}/>
            </Form.Group>
            {code === false ? <p style={{marginTop:"0", marginBottom:"0", color:"red", fontSize:"14px"}}>이메일 인증이 필요합니다</p>: <p style={{marginTop:"0", marginBottom:"0", fontSize:"14px"}}>&nbsp;</p>}

            <Form.Group className="w-75 mb-0">
              <Form.Label style={{fontWeight:"bold"}}>비밀번호</Form.Label>
              <Form.Control type="password" placeholder="password" name="password" onChange={(e)=>onChangehandler(e)}/>
            </Form.Group>
            {password === false ? <p style={{marginTop:"0", marginBottom:"0", color:"red", fontSize:"14px"}}>비밀번호는 8~16자의 영문, 숫자, 특수문자를 모두 사용해야합니다</p>: <p style={{marginTop:"0", marginBottom:"0", fontSize:"14px"}}>&nbsp;</p>}

            <Form.Group className="w-75 mb-0">
              <Form.Label style={{fontWeight:"bold"}}>비밀번호 확인</Form.Label>
              <Form.Control type="password" placeholder="password" name="confirmpassword" onChange={(e)=>onChangehandler(e)}/>
            </Form.Group>
            {confirmPassword === false ? <p style={{marginTop:"0", marginBottom:"0", color:"red", fontSize:"14px"}}>비밀번호가 일치하지 않습니다</p>: <p style={{marginTop:"0", marginBottom:"0", fontSize:"14px"}}>&nbsp;</p>}

          </Form>
        </div>
        <Button style={{marginTop:"3%", width:"80%", backgroundColor:"#3e475c", borderColor:"#3e475c"}} onClick={(e)=>submitForm(e)}>회원가입</Button>
        <div style={{textDecoration:"underline", textAlign:"right", marginTop:"6%", marginRight:"11%", fontSize:"17px"}}><Link to="/login" style={{color:"#525252"}}>로그인</Link></div>
      </div>
      <br />
      <img src={'/img/question.png'} className = {"question"} alt={"question mark"} onClick={()=>handleQuestionShow()}/>
      <Modal show={showQuestion} onHide={handleQuestionClose} style={{marginTop:"5%"}}>
        <Modal.Header closeButton>
          <Modal.Title>문의하기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{height:"15vh"}}>
          <p style={{fontSize:"18px", marginBottom:"1%"}}>관리자 문의 : admin@ajou.ac.kr</p>
          <p style={{fontSize:"18px", marginBottom:"1%"}}>Test-Helper 서비스 사용 문의 : testhelper@naver.com</p>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default SignUp;