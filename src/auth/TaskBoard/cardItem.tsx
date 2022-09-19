import React, {useState} from 'react'
import {Card,Modal} from 'react-bootstrap'
import { ColumnType,useTaskModel,useEditTask,useTaskSearchParam } from "./util"
import { DeleteModal } from './deleteItem'
const  TypeSelector =()=> {
  const SetType = (e:React.MouseEvent)=>{
    e.stopPropagation()

  }
  return (
    <div onClick={(e)=>SetType(e)} className="position-absolute top-0 start-0 translate-middle bg-brand-color text-dark d-flex align-items-center" style={{width:24,height:24,zIndex:10}}>
      <span className="material-symbols-outlined">
      question_mark
      </span>
    </div>
  );
}
type Inputs = {
  taskName: string,
};
const Mark = ({name,keyword}:{name:string,keyword:string}) =>{
  if(!keyword){ return <>{name}</>};
  const arr = name.split(keyword)
  return <>
  {
    arr.map((str,idx)=>{
      return <span key={idx}>
        {str}
        {
          idx ===arr.length-1 ?null : <span style={{color:"#f24"}}>{keyword}</span>
        }
      </span>
    })
  }
  </>
}
export const CardItem = (props:ColumnType) =>{
    const {taskName,status,_id} = props
    const {startEdit} = useTaskModel()
    const [param]= useTaskSearchParam()
    const {taskName:keyword} = param
    const handleShow = (e:React.MouseEvent)=>{
      e.stopPropagation()
  
    }
    return (
      <>
      <Card  className="mx-auto mb-3 position-relative p-0" >
        <Card.Body style={{ cursor:"pointer" }} onClick={()=>startEdit(_id || '')}>
        <div className='d-flex align-items-start justify-content-between'>
          <div>
          <Card.Title><Mark keyword={keyword as string} name={taskName  as string} /></Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{status}</Card.Subtitle>
          </div>
          <div className='d-flex align-items-center justify-content-center' style={{width:30,height:30 ,zIndex:10}} onClick={(e)=> handleShow(e)}>
          <DeleteModal id={_id || ""} type='task' title={taskName || ""} />
          </div>
          <TypeSelector />
        </div>
        </Card.Body>
      </Card>
      
      </>
   
    )
}
export const DetailModal = () =>{
  
  const {taskModalOpen,close,data,isError,isLoading:isTaskLoading} = useTaskModel()
  const {taskName,_id,taskCreator,status} = {...data}
  const [open,setOpen] = useState(false)
  const [value,setValue] = useState(taskName)

  const {mutateAsync,isLoading:isEditLoading} = useEditTask()
  
  const isLoading = isEditLoading || isTaskLoading ? true: false;

  const handleInput = async(e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key==='Enter') {
      let data ={
        taskName:e.currentTarget.value,
        taskId: _id,
        status
      }
      await mutateAsync(data)
      setOpen(!open)
    }
  }

  return (<Modal show={taskModalOpen} onHide={close}>
    <div>
    {isLoading?
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>:
      null
    } 
      <Modal.Body>
        {!open?
        <h5 onClick={()=>setOpen(!open)}>{taskName || ''}</h5>:
        <div className='d-flex align-items-center'>
        <input onKeyPress={(e)=>handleInput(e)} value={value} onChange={(e)=> setValue(e.target.value)} style={{height:24}}/>
        <button className='ms-2 btn btn-primary p-0' style={{height:24,width:24}} onClick={()=>setOpen(!open)}>X</button>
        </div>
        }
        
      </Modal.Body>
      <Modal.Body>
      <div>{status}</div>
      <div>{taskCreator?.name}</div>
      </Modal.Body>
      <Modal.Footer>
      
      </Modal.Footer>
      </div>
    </Modal>)
}