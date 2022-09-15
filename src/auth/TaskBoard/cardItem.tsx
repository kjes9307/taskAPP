import { useState } from 'react'
import {Card,Modal,Button } from 'react-bootstrap'
import { ColumnType } from "./util"

export const CardItem = (props:ColumnType) =>{
    const {taskName,status} = props
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
      <>
       <Card style={{ cursor:"pointer" }} className="mx-auto mb-3" >
      <Card.Body>
        <Card.Title>{taskName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{status}</Card.Subtitle>
      </Card.Body>
      <Button style={{width:60}} onClick={handleShow}>Edit</Button>
    </Card>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </>
   
    )
}