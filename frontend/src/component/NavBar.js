import React from 'react'
import { Link } from 'react-router-dom';
import { Navbar , Nav , NavDropdown , Container , Button  } from 'react-bootstrap';
import { baseUrl } from "./baseUrl";
import axios from 'axios';

function NavBar(){
  async function logout(e){
    await axios
    .delete(baseUrl+'/sessions',{
      withCredentials : true
    })
    .then((result)=>{
      console.log(result.data);
      if(result.data.result === true){ //로그아웃 성공
        sessionStorage.removeItem('username');
        document.location.href = '/';
      }
    })
    .catch(()=>{ console.log("실패") })
  }
  return(
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand as = {Link} to="/">Test Helper</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
          className="me-auto my-2 my-lg-0"
          style={{ maxHeight: '100px' }}
          navbarScroll
          >
            <Nav.Link as = {Link} to="/" > Home </Nav.Link>
            <Nav.Link as = {Link} to="/tests" > 시험목록 </Nav.Link>
            {/* <Nav.Link as = {Link} to="/tests/1/students/1" >1번대학생시험준비(완료 후 navbar에선 삭제예정)</Nav.Link> */}
            {/* <NavDropdown title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
              Something else here
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
          Signed in as: <a href="#login">윤대균 교수</a>
          </Navbar.Text>
        </Navbar.Collapse>
        <Button style={{marginLeft:"1%", backgroundColor:"#eeeeee", borderColor:"#eeeeee", color:"black", boxShadow:"1px 1px 1px #d4d4d4"}} onClick={(e)=>logout(e)}>로그아웃</Button>
      </Container>
    </Navbar>
  )
}
export default NavBar