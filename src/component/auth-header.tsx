import {Container, Nav ,Navbar ,NavDropdown} from 'react-bootstrap'
import { useAuth } from 'context/userContext';

export const AuthHeader = () =>{
    const {user} = useAuth()
    return (
    <>
    <Navbar bg="white" expand="lg" className="mb-md-3 mb-lg-7">
      <Container fluid="md" >
        <Navbar.Brand href="#" className='brand-color bg-brand-font fs-2'>PROJECT</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" className='border-0 fas fa-bars fa-2x brand-color' />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ms-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="#action1" className='text-secondary fs-6'>任務</Nav.Link>
            <NavDropdown title={user?.name} id="navbarScrollingDropdown" className='text-secondary customize ms-lg-3 fs-6'>
              <NavDropdown.Item href="#action2" className='text-secondary fs-6'>會員資料</NavDropdown.Item>
              <NavDropdown.Item href="#action3" className='text-secondary fs-6'>登出</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Container fluid="md" className='mb-md-3 mb-lg-7'>
    <section className='d-md-flex justify-content-md-between align-items-md-center flex-md-row-reverse bg-light'>
        <img src="images/campaign-creators-gMsnXqILjp4-unsplash.jpg" alt="" className='home-brand-img' />
        <div className='text-secondary text-center mt-2'>
            <h1>任務管理</h1>
            <p>幫助您完成任務</p>
        </div>
    </section>
    </Container>
    </>
    )
}