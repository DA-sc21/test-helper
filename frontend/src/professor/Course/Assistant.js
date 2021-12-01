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
  const [checkList, setCheckList] = useState([]);

  useEffect(()=>{
    console.log(props);
    setAssistant(props.assistant);
    sortAssistant(props.assistant);
  },[])

  function checkBoxHandler(checked,id){
    if(checked){
      setCheckList([...checkList, id]);
    }
    else{
      setCheckList(checkList.filter((el) => el !== id));
    }
    console.log(checkList);
  }

  function onChangehandler(e){
    let { name , value} = e.target;
    setState({
      ...state,
      [name]: value,
    });
    console.log(state);
  }

  function sortAssistant(data){
    let arr = [];
    for(let i=0; i<data.length; i++){
      arr.push(data[i].id);
    }
    console.log(arr);
    setCheckList(arr);
  }

  async function searchAssistantInfo(){
    await axios
    .get(baseUrl+`/assistants?email=${state.email}`,{
        withCredentials : true
      })
    .then((result)=>{
      console.log(result.data);
      setAssistantInfo(result.data);
    })
    .catch((e)=>{ console.log(e) })
  }

  async function submitForm(e){
    let assistantList = "";
    for(let i=0; i<checkList.length; i++){
      if(i==0){
        assistantList+=String(checkList[i]);
      }
      else{
        assistantList+=','+String(checkList[i]);
      }
    }
    console.log(assistantList);
    let response = await fetch(baseUrl+path+`/assistants?assistants=${assistantList}`,{
      method: 'PUT',
      credentials : 'include',
    })
    .then( res => {
      console.log("response:", res);
      if(res.status === 200){
        alert("조교 등록이 완료되었습니다");
        setShow(false);
        setLoading(false);
        // history.push(path+'/assistants');
        updateAssistantList();
      }
      else{
        alert("조교 등록에 실패했습니다.");
      }
    })
    .catch(error => {console.error('Error:', error)}); 
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
                    // onChange={(e)=>onChangehandler(e)}
                    onChange={(e)=>checkBoxHandler(e.currentTarget.checked, data.id)}
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