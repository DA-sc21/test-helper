import React from 'react'
import { Button, Form } from 'react-bootstrap';

function SignUp(){
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
              <Form.Control type="name" placeholder="name"/>
            </Form.Group>

            <Button style={{float:"right", marginTop:"6.5%", marginRight:"8%", backgroundColor:"#4c5974", borderColor:"#4c5974"}}>인증</Button>

            <Form.Group className="w-75 mb-3" >
              <Form.Label style={{fontWeight:"bold"}}>이메일</Form.Label>
              <Form.Control type="email" placeholder="id@example.com"/>
            </Form.Group>

            <Form.Group className="w-75 mb-3">
              <Form.Label style={{fontWeight:"bold"}}>인증 번호</Form.Label>
              <Form.Control placeholder=""/>
            </Form.Group>

            <Form.Group className="w-75 mb-3">
              <Form.Label style={{fontWeight:"bold"}}>비밀번호</Form.Label>
              <Form.Control type="password" placeholder="password"/>
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
                id="ass"
                style={{float:"right", marginTop:"6.5%", marginRight:"40%"}}  
              />
              <Form.Check
                type="radio"
                label="교수"
                name="role"
                id="pro"
                style={{marginLeft:"15%"}}  
              />
            </Form.Group>
          </Form>
        </div>
        <Button style={{marginTop:"3%", width:"80%", backgroundColor:"#3e475c", borderColor:"#3e475c"}}>회원가입</Button>
      </div>
    </div>
  )
}

export default SignUp;