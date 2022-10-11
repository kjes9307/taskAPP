import {Container,Row,Col,Card,Button} from 'react-bootstrap'
import moment from 'moment'
export const TeamUp =() =>{
    return (
        <Container>
            <Row>
                <Col sm='2' md='2'>
                <h2 className='font-color'>Group</h2>
                <ul className="list-group">
                    <li className="list-group-item">Your Group</li>
                    <li className="list-group-item">Pending invites</li>
                </ul>
                </Col>
                <Col sm='5' md='5'>
                    <Card>
                        <Card.Body>
                            <div className='d-flex align-items-center mb-2'>
                                <Card.Title className='mb-0'>
                                    <img src="/images/andychen.jpeg" alt="test" className='avatar-img' />
                                </Card.Title>
                                <div className='ms-2'>
                                    <span className='font-color fs-6'>名稱 : 活動</span>
                                    <Card.Subtitle className="text-muted fs-6">{moment(new Date()).format("YYYY.MM.DD HH:mm")}</Card.Subtitle>
                                </div>
                            </div>
                            <Card.Text>
                                Hello , i am here to invite you to join our mission.
                            </Card.Text>
                            <Button className='text-white'>Accept</Button>
                            <Button className='text-white ms-2'>Reject</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}