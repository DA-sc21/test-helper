import React, { useEffect } from 'react';
import { Button, Col, Form, Card, Row  } from 'react-bootstrap'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseUrl } from '../component/baseUrl';
import axios from 'axios';

function CreateAnswerExample(props) {
  const [show, setShow] = useState(false);
  let [img, setImg] = useState("");
  let [answers, setanswers] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let { testId } = useParams();

  useEffect(()=>{
    getTestAnswerSheet();
  },[]);

   async function getTestAnswerSheet(){
    let temp = [];
    let response = await fetch(baseUrl+'/tests/'+testId+'/answers',{
      method: 'GET',
      credentials : 'include',
      })
      .then((res) => res.json())
      .then((res) => {
        console.log("response:", res);
        setanswers(res)
      })
      .catch(error => {console.error('Error:', error)});
      console.log(temp)
  }

  async function UploadImageToS3(img){

    let preSignedUrl="";
    let testIdPad=String(testId).padStart(5,"0")
  
    let response = await fetch(baseUrl+'/s3-upload-url?objectKey=test/'+testIdPad+'/answer_sheet/001.jpg',{
      method: "GET",
      credentials: "include"
    })
    .then(res => res.text())
    .then((res)=>{
      preSignedUrl=res;
      console.log(res)
    })
    .catch((error)=> {console.log(error)})

     console.log(preSignedUrl);
     const data = {
      "file": "test/"+testIdPad+"/answer_sheet/001.jpg"
    };
     let response2 = await fetch(baseUrl+'/tests/'+testId+'/answers',{
      method: 'POST',
      credentials : 'include',
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
      })
      .then((res) => {
        console.log("response:", res);
      })
      .catch(error => {console.error('Error:', error)});

     await axios
      .put(preSignedUrl,img)
      .then((result)=>{
        getTestAnswerSheet();
        alert("답안 등록이 완료되었습니다.")
        console.log("put성공")
      })
      .catch((e)=>{ console.log(e) })
    
  }
  
  return (
    <>
      <Form>
        <Row>
        <Col sm={10}>
          {img[0]}
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Control type="file" onChange={(e) => {setImg(e.target.files[0])
          }}/>
        </Form.Group>
        </Col>
        <Col sm={2}>
        <Button variant="dark" onClick={()=>{
            let selectedFileName=document.querySelector("#formFile").value
            selectedFileName=null
            if (img===""){
              alert("파일을 선택해주세요")
            }
            else{
              UploadImageToS3(img)
            }
            setImg("")
          }}>답안 등록</Button>
        </Col>
        </Row>
        <Row>

          {answers.map((t,index)=>{
          return (
            <div key={index} className="col-md-6">
              <Card className="mb-3" >
                <Card.Img variant="top" src={t.file} />
                <Card.Footer>
                  <Button className="mx-3" variant="success">답안 수정</Button>
                  <Button  variant="danger">답안 삭제</Button>
                  {/* <ProblemUpdateModal updateProblems={updateProblems} problemNum={problem.problemNum} point={problem.point} question={problem.question}></ProblemUpdateModal> */}
                  {/* <Button variant="danger" onClick={()=>{
                    deleteProblems(problem.problemNum)
                  }}>문제 삭제</Button> */}
                </Card.Footer>
              </Card>
            </div>
            )})}
          </Row>
      </Form>
    </>
  );
}

export default CreateAnswerExample;