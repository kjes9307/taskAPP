import { Container,Row,Col } from 'react-bootstrap';
import {useBoardData} from './util'
import { CardItem } from './cardItem';
export const TaskBoard = ()=>{
  const {data} = useBoardData();
  console.log(data);
  return (
    <>
    <Container fluid='md' className='overflow-hidden'>
    <h1>TaskBoard</h1>
    <Row className='justify-content-start flex-nowrap scroll-kanban'>
    
    {
      data?.map((item)=> {
        return (
        <Col lg="3" className='bg-light py-4 me-3'>
        <div id={item._id}>
        <h2 className='text-center'>{item.kanbanName}</h2>
        {item.alltask.map(x=>
          <CardItem type={x.type} status={x.status} taskName={x.taskName}></CardItem>
          )
        }
        </div>
        </Col>)
      }) 
    }
    <Col lg="2" className='bg-light py-3 me-1'>
    <h2 className='text-center'>Add</h2>
    </Col>
    </Row>
    </Container>
    </>
  )
}