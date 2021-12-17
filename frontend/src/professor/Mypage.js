import React, { useEffect, useState } from 'react';
import { Button, Modal, FormControl, InputGroup, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {baseUrl} from "../component/baseUrl";
import Loading from '../component/Loading';

function Mypage(){
  const pwValidation = /^.*(?=^.{8,16}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[~,!,@,#,$,*,(,),=,+,_,.,|]).*$/;
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [state, setState] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {setShow(true);setPassword(true);setConfirmPassword(true);}
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(()=>{
    getUserInfo();
  },[])

  function onChangehandler(e){
    let { name , value} = e.target;
    setState({
      ...state,
      [name]: value,
    });
    console.log(state);
  }

  async function getUserInfo(){
    let response = await fetch(baseUrl+'/account',{
      method: 'GET',
      credentials : 'include',
    })
    .then((res) => res.json())
    .then((res) => {
      if(res.errorMessage != undefined){ //error
        console.log(res.errorMessage);
      }
      else{ //success
        setName(res.name);
        setEmail(res.email);
        setRole(res.role);
      }
      console.log("response:", res);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }

  async function checkPassword(){
    if(pwValidation.test(state.newPassword) === false){
      setPassword(false);
      return false;
    }
    else{
      setPassword(true);
      return true;
    }
  }

  async function checkConfirmPassword(){
    if(state.newPassword != state.newPasswordConfirm){
      setConfirmPassword(false);
      return false;
    }
    else{
      setConfirmPassword(true);
      return true;
    }
  }

  async function changePassword(){
    let isPassword = await checkPassword();
    let isConfirmPassword = await checkConfirmPassword();

    let data = {
      "email": email,
      "newPassword": state.newPassword,
      "password": state.originPassword
    }
    console.log(data, isPassword, isConfirmPassword);
    if(isPassword && isConfirmPassword){
      let response = await fetch(baseUrl+'/users/password',{
        method: 'PUT',
        credentials : 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then((res) => res.json())
      .then((res) => {
        if(res.errorMessage != undefined){ //error
          alert(res.errorMessage);
        }
        else{ //success
          alert("비밀번호가 변경되었습니다.");
        }
        console.log("response:", res);
        console.log(res.result);
        console.log(res.errorMessage);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      handleClose();
    }
  }

  return(
    <div style={{textAlign:"center"}}>
      <div style={{fontSize:"28px", marginTop:"1%"}}>마이 페이지</div>
      <div style={{border:"2px solid gray", width: "68%", height:"72vh", marginLeft:"16%", marginTop:"1%", borderRadius:"10px"}}>
        <div style={{marginTop:"12%", textAlign:"left", fontSize:"25px", width:"100%", textAlign:"center"}}>
          <span style={{display:"inlineBlock"}}>이름: {name}</span>
        </div>
        <div style={{marginTop:"5%", textAlign:"left", fontSize:"25px", width:"100%", textAlign:"center"}}>
          <span style={{display:"inlineBlock"}}>이메일: {email}</span>
        </div>
        <Button style={{marginTop:"18%", width:"50%", backgroundColor:"#2e384b", borderColor:"#2e384b"}} onClick={()=>handleShow()}>비밀번호 변경</Button>
      </div>
      <Modal show={show} onHide={handleClose} style={{marginTop:"5%"}}>
        <Modal.Header closeButton>
          <Modal.Title>비밀번호 변경</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{height:"39vh"}}>
          <Form.Group className="w-100 mb-0">
              <Form.Label style={{fontSize:"18px", fontWeight:"bold"}}>기존 비밀번호</Form.Label>
              <Form.Control type="password" placeholder="password" name="originPassword" onChange={(e)=>onChangehandler(e)}/>
          </Form.Group>

          <Form.Group className="w-100 mb-0">
              <Form.Label style={{fontSize:"18px", fontWeight:"bold", marginTop:"5%"}}>새로운 비밀번호</Form.Label>
              <Form.Control type="password" placeholder="password" name="newPassword" onChange={(e)=>onChangehandler(e)}/>
          </Form.Group>
          {password === false ? <p style={{marginTop:"0", marginBottom:"0", color:"red", fontSize:"14px"}}>비밀번호는 8~16자의 영문, 숫자, 특수문자를 모두 사용해야합니다</p>: <p style={{marginTop:"0", marginBottom:"0", fontSize:"14px"}}>&nbsp;</p>}

          <Form.Group className="w-100 mb-0">
              <Form.Label style={{fontSize:"18px", fontWeight:"bold", marginTop:"2%"}}>새로운 비밀번호 확인</Form.Label>
              <Form.Control type="password" placeholder="password" name="newPasswordConfirm" onChange={(e)=>onChangehandler(e)}/>
          </Form.Group>
          {confirmPassword === false ? <p style={{marginTop:"0", marginBottom:"0", color:"red", fontSize:"14px"}}>비밀번호가 일치하지 않습니다</p>: <p style={{marginTop:"0", marginBottom:"0", fontSize:"14px"}}>&nbsp;</p>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" style={{width:"100%"}} onClick={()=>changePassword()}>
            변경하기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Mypage;