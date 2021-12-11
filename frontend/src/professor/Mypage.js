import React, { useEffect, useState } from 'react';
import { Button, Modal, FormControl, InputGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {baseUrl} from "../component/baseUrl";
import Loading from '../component/Loading';

function Mypage(){
  const [state, setState] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(()=>{
  },[])

  function onChangehandler(e){
    let { name , value} = e.target;
    setState({
      ...state,
      [name]: value,
    });
    console.log(state);
  }

  async function changePassword(){
    let data = {
      "email": "yejoon08@ajou.ac.kr",
      "newPassword": state.newPassword,
      "password": state.originPassword
    }
    console.log(data);
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

  return(
    <div style={{textAlign:"center"}}>
      <div style={{fontSize:"28px", marginTop:"1%"}}>마이 페이지</div>
      <div style={{border:"2px solid gray", width: "68%", height:"72vh", marginLeft:"16%", marginTop:"1%", borderRadius:"10px"}}>
        <div style={{marginTop:"12%", marginLeft:"15%", textAlign:"left", fontSize:"22px"}}>
          <span>이름: </span>
        </div>
        <div style={{marginTop:"5%", marginLeft:"15%", textAlign:"left", fontSize:"22px"}}>
          <span>이메일: </span>
        </div>
        <Button style={{marginTop:"20%", width:"50%"}} onClick={()=>handleShow()}>비밀번호 변경</Button>
      </div>
      <Modal show={show} onHide={handleClose} style={{marginTop:"5%"}}>
        <Modal.Header closeButton>
          <Modal.Title>비밀번호 변경</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{height:"35vh"}}>
          <p style={{fontSize:"18px", marginBottom:"1%"}}>기존 비밀번호</p>
          <InputGroup className="mb-3" style={{width:"100%", marginTop:"0%"}}>
            <InputGroup.Text id="basic-addon1">비밀번호</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label="name"
                aria-describedby="basic-addon1"
                name="originPassword" 
                onChange={(e)=>onChangehandler(e)}
            />
          </InputGroup>
          <p style={{fontSize:"18px", marginBottom:"1%", marginTop:"5%"}}>새로운 비밀번호</p>
          <InputGroup className="mb-3" style={{width:"100%", marginTop:"0%"}}>
            <InputGroup.Text id="basic-addon1">비밀번호</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label="name"
                aria-describedby="basic-addon1"
                name="newPassword" 
                onChange={(e)=>onChangehandler(e)}
            />
          </InputGroup>
          <p style={{fontSize:"18px", marginBottom:"1%", marginTop:"2%"}}>새로운 비밀번호 확인</p>
          <InputGroup className="mb-3" style={{width:"100%", marginTop:"0%"}}>
            <InputGroup.Text id="basic-addon1">비밀번호</InputGroup.Text>
              <FormControl
                placeholder=""
                aria-label="name"
                aria-describedby="basic-addon1"
                name="newPasswordConfirm" 
                onChange={(e)=>onChangehandler(e)}
            />
          </InputGroup>
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