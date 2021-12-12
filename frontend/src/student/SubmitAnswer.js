import React, { useState } from 'react'
import { Button } from 'react-bootstrap';

function SubmitAnswer(props) {
    
    return (
      <div style={{backgroundColor:"#2a2f38", height:"73vh", textAlign:"center"}}>
      <div style={{color:"white", marginBottom:"2%", paddingTop:"1.5%", textShadow:"2px 2px 2px #3e475c"}}>
      <h1 style={{marginTop:"5%"}}>Test-Helper</h1>
      </div>
      <div style={{width:"40%", height:"52%", backgroundColor:"white", display:"inline-block", borderRadius:"10px"}}>
        <div className="mt-5">
          <h4>시험이 종료되었습니다. </h4>
          <br></br>
          <h4>모바일 화면에서 답안 제출을 진행해주세요 </h4>
        </div>
        <Button className="col-md-4 mt-5"variant="secondary" onClick={props.handleClose} >시험 종료</Button>
      </div>
    </div>
    );
  }


export default SubmitAnswer 