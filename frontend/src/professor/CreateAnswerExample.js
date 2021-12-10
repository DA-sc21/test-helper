import React, { useEffect } from 'react';
import { Button, Col, Form, Modal, Row  } from 'react-bootstrap'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseUrl } from '../component/baseUrl';
import axios from 'axios';

function CreateAnswerExample(props) {
  const [show, setShow] = useState(false);
  let [img, setImg] = useState("");
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
        temp=res;
      })
      .catch(error => {console.error('Error:', error)});

    // let url = [];
    // for(let i =0; i<temp.length; i++){
    //   url.push(temp[i].file);
    //   if(i==0){
    //     setTestAnswerSheetImgUrl(temp[i].file);
    //   }
    // }
    // console.log(url);
    // setTestAnswerSheetUrl(url);
  }

  async function UploadImageToS3(img){

    let preSignedUrl="";
    testId=String(testId).padStart(5,"0")
  
    let response = await fetch(baseUrl+'/s3-upload-url?objectKey=test/'+testId+'/answer_sheet/001.jpg',{
      method: "GET",
      credentials: "include"
    })
    .then(res => res.text())
    .then((res)=>{
      preSignedUrl=res;
      console.log(res)
      // console.log(preSignedUrl);
    })
    .catch((error)=> {console.log(error)})

     console.log(preSignedUrl);

     await axios
      .put(preSignedUrl,img)
      .then((result)=>{
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
            let point=document.querySelector("#formFile").value
            point=null
            console.log(point)
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
      </Form>
    </>
  );
}

export default CreateAnswerExample;