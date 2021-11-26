import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';

function Assistant(props){
  console.log(props);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [assistant, setAssistant] = useState([]);
  const [assistantInfo, setAssistantInfo] = useState([]);
  useEffect(()=>{
    setAssistant(props.assistant);
  },[])
  async function getAllAssistant(){
    await axios
    .get(baseUrl+'/assistants',{
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
    })
    .catch((e)=>{ console.log(e) })
  }
  return(
    <div style={{marginLeft:"7%", marginTop:"2%", width:"70%"}}>
      <Button variant="secondary" style={{float:"right", marginRight:"15%"}} onClick={handleShow}>조교 등록</Button>
      <h4 style={{marginBottom:"3%", textAlign:"left"}}>조교 정보</h4>
      <div style={{width:"85%", height:"70%", borderRadius:"10px"}}>
        <Table striped bordered hover>
          <thead>
          <tr>
          <th>#</th>
          <th>이름</th>
          <th>이메일</th>
          </tr>
          </thead>
          <tbody>
          {assistant.map((data,idx)=>(
            <tr>
            <td>{idx+1}</td>
            <td>{data.name}</td>
            <td>{data.email}</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>조교 등록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{height:"400px"}}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">조교 이름</InputGroup.Text>
              <FormControl
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
            />
          </InputGroup>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            등록
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Assistant;