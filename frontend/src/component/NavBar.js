import React from 'react'
import { Link } from 'react-router-dom';
import { Navbar , Nav , NavDropdown , Container  } from 'react-bootstrap';

function NavBar(){
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
          Signed in as: <a href="#login" style={{textUnderlinePosition:"under"}}>윤대균 교수</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
export default NavBar