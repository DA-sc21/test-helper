import React,{ useState }  from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Navbar , Nav , NavDropdown , Container , Button,Modal  } from 'react-bootstrap';
import { baseUrl } from "./baseUrl";
import axios from 'axios';

function NavBar(){
  let name = sessionStorage.getItem("name");
  let role = sessionStorage.getItem("role");

  const [showQuestion, setShowQuestion] = useState(false);
  const handleQuestionClose = () => setShowQuestion(false);
  const handleQuestionShow = () => setShowQuestion(true);

  const pro_ass_role = {
    "PROFESSOR": "교수",
    "ASSISTANT": "조교"
  }
  let history = useHistory();
  async function logout(e){
    let response = await fetch(baseUrl+'/sessions',{
      method: 'DELETE',
      credentials : 'include'
    })
    .then( res => {
      console.log("response:", res);
      if(res.status === 200){
        alert("로그아웃 되었습니다.");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem('isAuthorized');
        sessionStorage.clear();
        document.location.href="/login";
        // history.push("/login");
      }
      else{
        alert("로그아웃에 실패했습니다.");
      }
    })
    .catch(error => {console.error('Error:', error)});
  }
  return(
    <Navbar bg="dark" variant="dark" expand="lg" style={{height:"9vh"}}>
      <Container fluid>
        <Navbar.Brand as = {Link} to="/" style={{fontSize:"25px"}}>Test Helper</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
          className="me-auto my-2 my-lg-0"
          style={{ maxHeight: '100px' }}
          navbarScroll
          >
            <Nav.Link as = {Link} to="/" style={{fontSize:"17px", marginTop:"2%"}}> Home </Nav.Link>
            <Nav.Link as = {Link} to="/courses" style={{fontSize:"17px", marginTop:"3%"}}> 강의 </Nav.Link>
            <Nav.Link as = {Link} to="/tests" style={{fontSize:"17px", marginTop:"3%"}}> 시험목록 </Nav.Link>
            <Nav className={"nav-link"} style={{fontSize:"17px", marginTop:"3%", cursor : "pointer"}} onClick={()=>handleQuestionShow()}>문의하기</Nav>
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
          <Navbar.Text style={{fontSize:"17px", marginTop:"0.5%"}}>
          Signed in as: <a href="/mypage" style={{textUnderlinePosition:"under"}}>{name} {pro_ass_role[role]}</a>
          </Navbar.Text>
        </Navbar.Collapse>
        <Button style={{marginLeft:"1%", backgroundColor:"#ffffff00", borderColor:"#b6b6b6", color:"black", color:"#b6b6b6", boxShadow:"1px 1px 1px #b6b6b6"}} onClick={(e)=>logout(e)}>로그아웃</Button>
      </Container>
      <Modal show={showQuestion} onHide={handleQuestionClose} style={{marginTop:"5%"}}>
        <Modal.Header closeButton>
          <Modal.Title>문의하기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{height:"15vh"}}>
          <p style={{fontSize:"18px", marginBottom:"1%"}}>수업 등록 문의 : admin@ajou.ac.kr</p>
          <p style={{fontSize:"18px", marginBottom:"1%"}}>Test-Helper 서비스 문의 : testhelper@naver.com</p>
          </div>
        </Modal.Body>
      </Modal>
    </Navbar>
  )
}
export default NavBar