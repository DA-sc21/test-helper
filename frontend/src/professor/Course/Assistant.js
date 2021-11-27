import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, InputGroup, FormControl, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {baseUrl} from "../../component/baseUrl";
import Loading from '../../component/Loading';

function Assistant(props){
  let history = useHistory();
  const path = props.path;
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {setShow(true);setAssistantInfo([]);}
  const [state, setState] = useState([]);
  const [assistant, setAssistant] = useState([]);
  const [assistantInfo, setAssistantInfo] = useState([]);

  useEffect(()=>{
    console.log(props);
    setAssistant(props.assistant);
  },[])

  function onChangehandler(e){
    let { name , value} = e.target;
    setState({
      ...state,
      [name]: value,
    });
    console.log(state);
  }

  async function searchAssistantInfo(){
    let email = state.email.split('@');

    await axios
    .get(baseUrl+`/assistants?email=${email[0]}%40${email[1]}`,{
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      setAssistantInfo(result.data);
    })
    .catch((e)=>{ console.log(e) })
  }

  async function submitForm(e){
    await axios
    .put(baseUrl+path+'/assistants?assistants='+state.assistantId,{
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      alert("조교 등록이 완료되었습니다");
      setShow(false);
      setLoading(false);
      // history.push(path+'/assistants');
      updateAssistantList();
    })
    .catch((e)=>{ console.log(e) })
  }

  async function updateAssistantList(){
    await axios
    .get(baseUrl+path,{
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      setAssistant(result.data.assistants);
      setLoading(true);
    })
    .catch((e)=>{ console.log(e.response.data) })
  }

  if(!loading)return(<Loading></Loading>)
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
            <tr key={idx}>
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
          <div style={{height:"380px"}}>
          <Button variant="secondary" style={{float:"right"}} onClick={(e)=>searchAssistantInfo(e)}>검색</Button>
          <InputGroup className="mb-3" style={{width:"87%"}}>
            <InputGroup.Text id="basic-addon1">조교 이메일</InputGroup.Text>
              <FormControl
                placeholder="email"
                aria-label="email"
                aria-describedby="basic-addon1"
                name="email" 
                onChange={(e)=>onChangehandler(e)}
            />
          </InputGroup>
          <div style={{overflow: "auto"}}>
          <Table striped bordered hover>
            <thead>
            <tr>
            <th>#</th>
            <th>이름</th>
            <th>이메일</th>
            <th>Check</th>
            </tr>
            </thead>
            <tbody>
            {assistantInfo.map((data,idx)=>(
                <tr key={idx}>
                <td>{idx+1}</td>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td><Form style={{marginLeft:"12%"}}>
                    <Form.Check
                    inline
                    name="assistantId"
                    value={data.id}
                    onChange={(e)=>onChangehandler(e)}
                    />
                    </Form>
                </td>
                </tr>
            ))}
          </tbody>
        </Table>
          </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={(e)=>submitForm(e)}>
            등록
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Assistant;