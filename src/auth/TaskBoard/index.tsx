import { Container,Row,Col } from 'react-bootstrap';
import {useBoardData} from './util'
import { CardItem } from './cardItem';
export const TaskBoard = ()=>{
  const {data} = useBoardData();
  console.log(data);
  return (
    <>
    <Container fluid="md">
    <h1>TaskBoard</h1>
    <Row className='justify-content-between'>
    <Col lg="4" className='bg-light py-3'>
    <h2 className='text-center'>Idle</h2>
    {
      data?.map((item)=> {
      if(item.status == 'idle')
        return <CardItem type={item.type} status={item.status} taskName={item.taskName}></CardItem>
      })
    }
    </Col>
    <Col lg="4" className='bg-light py-3'>
    <h2 className='text-center'>Ongoing</h2>
    {
      data?.map((item)=> {
      if(item.status == 'ongoing')
        return <CardItem type={item.type} status={item.status} taskName={item.taskName}></CardItem>
      })
    }
    </Col>
    <Col lg="4" className='bg-light py-3'>
    <h2 className='text-center'>Done</h2>
    {
      data?.map((item)=> {
      if(item.status == 'done')
        return <CardItem type={item.type} status={item.status} taskName={item.taskName}></CardItem>
      })
    }
    </Col>
    </Row>
    </Container>
    </>
  )
}