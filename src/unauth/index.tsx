import React, { useState } from "react";
import {Container, Row, Col } from 'react-bootstrap';
import {UnAuthHeader} from 'component/unauth-header';
import {UnAuthFooter} from 'component/unauth-footer';
import {LoginForm} from "unauth/login";
import {RegisterForm} from "unauth/register";

export const UnAuthScreen = () => {
    const [mode,setMode] = useState(false);
    const setModeChange = () =>{
        setMode(!mode)
    }
    return (
      <Container fluid="md">
        <UnAuthHeader />
        <Row>
          <Col lg={5}>
          <img src='/images/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg' alt="images" className="d-none d-lg-inline login-img" />
          </Col>
          <Col lg={7} className="d-lg-flex justify-content-center flex-column">
            {!mode?<LoginForm setMode={setModeChange} /> : <RegisterForm setMode={setModeChange} />}
          </Col>
        </Row>
        <UnAuthFooter />
      </Container>
    );
  };