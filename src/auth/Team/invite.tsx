import {Col,Card,Button} from 'react-bootstrap'
import { useState } from 'react'
import moment from 'moment'
import { SearchComplete,DataSourceType } from 'component/searchComplete'
import Icon from 'component/Icon'
interface UserProps {
    photo?: string;
    name?: string;
    _id?:string;
}
export const Invites = () =>{
    const [user, setUser] = useState<UserProps[]>([])
    const handSelect = async(e:DataSourceType<UserProps>) =>{
        const {name,_id,photo} = e ;
        const arr = [{name,_id,photo}]
        setUser([...user,...arr])
    }
    const renderCustom = (item: DataSourceType<UserProps>) => {
        return (
            <div className="d-flex align-items-center">
            {
            item.photo?
             <img src={item.photo} alt='user-avatar' className="user-avatar test rounded-circle" />
            : 
            <Icon 
                className='Icon-border rounded-circle' 
                icon='circle-question' 
                theme='dark' 
                size='1x' 
                style={{cursor:"pointer"}} 
            />
            }
            <p className="ms-2 mb-0">{item.name}</p>
            </div>
        )
    }
    return (
        <Col sm='12' md='10'>
            <h2>收到的邀請</h2>
            <Card className='w-45 ms-2 mt-1'>
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
            <div className='d-flex mt-3 align-items-start'>
                <h2 className='mb-0'>邀請別人</h2>
                <div className='d-block'>
                <SearchComplete
                    onSelect={handSelect}
                    renderOption = {renderCustom}
                    icon='magnifying-glass'
                />
                </div>
            </div>
            <div className="flex-wrap d-flex">
                {user.length>0 ? user?.map((x)=> (
                    <Card className='w-45 ms-2 mt-1' key={x._id}>
                        <Card.Body>
                        <div className='d-flex align-items-center mb-2'>
                            <Card.Title className='mb-0'>
                                <img src={x?.photo || '/\images/\joe-shields-dLij9K4ObYY-unsplash.jpg'} alt="test" className='avatar-img' />
                            </Card.Title>
                            <div className='ms-2'>
                                <span className='text-dark fs-6'>{x.name}</span>
                            </div>
                        </div>
                        <Card.Text>
                            Hello , i am here to invite you to join our mission.
                        </Card.Text>
                        <Button className='text-white'>Invite</Button>
                        <Button className='text-white ms-2'>Cancel</Button>
                        </Card.Body>
                    </Card>
                )):null}
            </div>
        </Col>
    )
}