import {Col,Card,Button} from 'react-bootstrap'
import moment from 'moment'
export const Invites = () =>{
    return (
        <Col sm='12' md='5'>
            <Card>
                <Card.Body>
                    <div className='d-flex align-items-center mb-2'>
                        <Card.Title className='mb-0'>
                            <img src="/images/andychen.jpeg" alt="test" className='avatar-img' />
                        </Card.Title>
                        <div className='ms-2'>
                            <span className='text-dark fs-6'>邀請進入Stickers : 活動</span>
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
    )
}