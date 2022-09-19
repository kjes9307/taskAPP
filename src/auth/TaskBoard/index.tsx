import { Container,Row,Col,Spinner  } from 'react-bootstrap';
import { useState } from 'react';
import {useBoardData,useAddKanban} from './util'
import { CardItem ,DetailModal } from './cardItem';
import { SearchPanel } from './searchPanel';
import {CreateTask} from './createTask';
export const TaskBoard = ()=>{
  const {data,isLoading} = useBoardData();
  const {mutateAsync:addKanbanAsync,isError,error} = useAddKanban()
  const [kanbanName,setKanban] = useState('')
  const [edit,setEdit] = useState(false);
  const handleKeyPress = async(e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key==='Enter') {
      let data = {kanbanName,allTask: []}
      await addKanbanAsync(data)
      setEdit(!edit)
      setKanban('')
    }
  }
  return (
    <>
    
      <Container fluid='md' className='overflow-hidden'>
      {isLoading?  
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      :
      <>
      <h1>TaskBoard</h1>
      <SearchPanel />
      <Row className='d-flex flex-nowrap scroll-kanban'>
      
      {
        data?.map((item)=> {
          return (
          <Col lg='3' className='bg-light py-4 me-3'>
          <div id={item._id}>
          <h2 className='text-center'>{item.kanbanName}</h2>
          {item.alltask?.map(x=>
            <CardItem _id={x?._id} taskCreator={x?.taskCreator} type={x.type} status={x.status} taskName={x.taskName}></CardItem>
            )
          }
          <DetailModal />
          </div>
          <CreateTask kanbanId = {item._id || ''} />
          </Col>)
        }) 
      }
      <Col lg='2' className='bg-light py-3 me-1 d-flex'>
        <div className='d-flex align-items-center flex-column'>
        {isError && kanbanName ? <div className="text-danger">{error as string}</div>:null}
        {
          !edit?<h2 className='text-left' style={{cursor:"pointer"}} onClick={()=>setEdit(!edit)}>+</h2>:
          <div className='d-flex align-items-center'>
          <input className='w-100' value={kanbanName} onKeyPress={e=>handleKeyPress(e)} onChange={(e)=> setKanban(e.target.value)}/>
          <button className='ms-1' onClick={()=> {setKanban('');setEdit(!edit)}}>X</button>
          </div>
        }
        </div>
      </Col>
      </Row>
      </>
      }
      </Container>
    
    </>
  )
}