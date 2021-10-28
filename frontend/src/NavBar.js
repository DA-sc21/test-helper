import React from 'react'
import { Link } from 'react-router-dom';
import { Navbar , Nav , NavDropdown , Container  } from 'react-bootstrap';

function NavBar(){
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
            <Nav.Link as = {Link} to="/tests/students" >대학생시험준비(완료 후 navbar에선 삭제예정)</Nav.Link>
            <Nav.Link as = {Link} to="/kinesis" >kinesis 테스트</Nav.Link>
            <NavDropdown title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
              Something else here
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
          Signed in as: <a href="#login">000 교수</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
export default NavBar