import React, { useEffect } from 'react';
import { Button, Col, Form, Card, Row  } from 'react-bootstrap'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseUrl } from '../component/baseUrl';
import axios from 'axios';

function CreateAnswerExample(props) {
  let [img, setImg] = useState("");
  let [answers, setanswers] = useState([]);
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
    let answerIdPad=String(answers.length+1).padStart(3,"0")
  
    let response = await fetch(baseUrl+'/s3-upload-url?objectKey=test/'+testIdPad+'/answer_sheet/'+answerIdPad+'.jpg',{
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
      "file": "test/"+testIdPad+"/answer_sheet/"+answerIdPad+".jpg"
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
  
  async function deleteAnswer(answerId){

    let response = await fetch(baseUrl+`/tests/`+testId+`/answers/`+answerId,{
      method: 'DELETE',
      credentials : 'include',
    })
    .then( res => {
      console.log("response:", res);
      getTestAnswerSheet();
      if(res.status === 200){
        alert("답안이 삭제되었습니다.");
      }
      else{
        alert("답안 삭제에 실패했습니다.");
      }
      }
    )
    .catch(error => {console.error('Error:', error)});

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

          {answers.map((answer,index)=>{
          return (
            <div key={index} className="col-md-6">
              <Card className="mb-3" >
                <Card.Img variant="top" src={answer.file} />
                <Card.Footer className="d-flex justify-content-end" >
                  <Button variant="outline-danger" onClick={()=>{
                    deleteAnswer(answer.id)
                  }}>답안 삭제</Button>
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