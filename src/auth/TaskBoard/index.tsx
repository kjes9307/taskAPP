import { Container,Row,Col,Spinner  } from 'react-bootstrap';
import React,{ useState } from 'react';
import {useBoardData,useAddKanban, ColumnType,Iprops} from './util'
import { CardItem ,DetailModal } from './cardItem';
import { SearchPanel } from './searchPanel';
import {CreateTask} from './createTask';
import {DeleteModal} from './deleteItem';
import { DragDropContext } from 'react-beautiful-dnd';
import { Drop, DropChild ,Drag } from 'component/drag';

export const KanbanCol = React.forwardRef<HTMLDivElement,{kanban:Iprops<ColumnType>}>(({kanban,...props},ref) =>{
  
  return (
    <Col lg='3' className='bg-light py-4 me-3' ref={ref} {...props} >
      <div id={kanban._id} >
      
      <div className='d-flex align-items-center justify-content-between mb-5'>
      <h2 className='text-center'>{kanban.kanbanName}</h2>
      <DeleteModal id={kanban._id || ""} type='kanban' title={kanban?.kanbanName || ""} />
      </div>
      <Drop
          type={"ROW"}
          direction={"vertical"}
          droppableId={kanban._id as string}
        >
        <DropChild>
          {kanban.alltask?.map((x,idx)=>
              <Drag
                key={x?._id}
                index={idx}
                draggableId={"task" + x?._id as string}
              >
                <div className='position-relative'>
                <CardItem idx={idx} length={kanban.alltask?.length} _id={x?._id} taskCreator={x?.taskCreator} type={x.type} status={x.status} taskName={x.taskName}></CardItem>
                </div>
              </Drag>
            )
          }
      </DropChild>
      </Drop>
      <DetailModal />
      </div>
      <CreateTask kanbanId = {kanban._id || ''} />
    </Col>
  )
})
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
      <DragDropContext onDragEnd={(param)=>console.log(param)}>
      <Drop type={"COLUMN"}
                direction={"horizontal"}
                droppableId={"kanban"}>
      <DropChild className='d-flex justify-content-start'>
      {
        data?.map((item,idx)=> {
          return (
            <Drag key={item._id} draggableId={'kanban'+item._id} index={idx}>
              <KanbanCol key={item._id} kanban={item} />
            </Drag> 
          )
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
      </DropChild>
       </Drop>
      </DragDropContext>
      
      </Row>
      </>
      }
      </Container>
    
    </>
  )
}