import React, {useEffect, useState} from 'react'
import {Card,Modal,Container,Row,Col,Toast } from 'react-bootstrap'
import { ColumnType,useTaskModel,useEditTask,useTaskSearchParam } from "./util"
import { DeleteModal } from './deleteItem'
import {TodoList} from "component/todoList"
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
  const [value,setValue] = useState('')

  const {mutateAsync,isLoading:isEditLoading} = useEditTask()
  
  const isLoading = isEditLoading || isTaskLoading ? true: false;

  const handleType = async(e:React.ChangeEvent<HTMLSelectElement>)=>{
      let data ={
        taskId: _id,
        status: e.currentTarget.value
      }
      console.log(data)
      await mutateAsync(data)
  }
  const handleSave = async()=>{
    let data ={
      taskName: value,
      taskId: _id,
      status
    }
    await mutateAsync(data)
  }
  useEffect(()=>{
    setValue(taskName || "")
    return () =>{
      setValue('')
      setOpen(false)
    }
  },[taskName])
  return (<Modal show={taskModalOpen} onHide={close} size='xl'>
    <Modal.Header className='d-flex justify-content-between'>
          <h2 className='fs-3'>
            Task Type :
          </h2>
          <select value={status} onChange={(e)=>{handleType(e)}} className="form-select form-select-lg mb-3 w-25" aria-label=".form-select-lg example">
            <option value="idle">idle</option>
            <option value="ongoing">ongoing</option>
            <option value="done">done</option>
          </select>
    </Modal.Header>
      <div>
      {isLoading?
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>:
        null
      } 
      <div className='d-flex'>
      <div className='w-70'>
      <Modal.Body>
      <div className='divider'>
        <div><span className='text-secondary fs-6'>任務名:</span></div>
        {!open?
          <h1 className='fs-2' onClick={()=>setOpen(!open)}>{taskName || ''}</h1>:
          <div>
            <textarea 
              value={value} 
              onChange={(e)=> setValue(e.target.value)} 
              className="text-modal w-100" 
            />
            <div className='d-flex justify-content-end mt-2'>
              <button 
                className='btn btn-outline-primary' 
                onClick={()=>setOpen(!open)}>Cancel
              </button>
              <button 
                className='btn btn-primary ms-2' 
                onClick={handleSave}>Save
              </button>
            </div>
          </div>
        }
      </div>
        </Modal.Body>
        <Modal.Body>
        <div className='divider'>
          <div><span className='text-secondary fs-6'>創建者:</span></div>
          <div>{taskCreator?.name}</div>
        </div>
        </Modal.Body>
        <Modal.Body>
        <div className='divider'>
          <div><span className='text-secondary fs-6'>代辦清單:</span></div>
          <TodoList />
        </div>
        </Modal.Body>
      </div>
      <div className='w-30'>
        <Modal.Body>
          <div>
          <span className='text-secondary'>處理人員</span>
          <ul className='d-flex align-items-center justify-content-start list-unstyled mt-2'>
            <li className='me-1'>
            <img src="/images/andychen.jpeg" className="rounded-circle avatar-img" alt="avatar" />
            </li>
            <li>
              <div 
                className='avatar-img rounded-circle d-flex align-items-center justify-content-center'
                style={{cursor:"pointer"}}
                >
                <span className="material-symbols-outlined">
                add
                </span>
              </div>
            </li>
          </ul>
          </div>
        <div>
          <span className='text-secondary'>照片上傳</span>
          <ul className='d-flex align-items-center justify-content-start list-unstyled mt-2'>
            <li>
            <div 
              className='upload-img d-flex align-items-center justify-content-center'
              style={{cursor:"pointer"}}
              >
              <span className="material-symbols-outlined">
              add
              </span>
            </div>
            </li>
          </ul>
        </div>
        <div>
        <span className='text-secondary'>討論</span>
        <div className='d-flex align-items-start mt-2'> 
          <img src="/images/andychen.jpeg" className="rounded-circle comment-avatar" alt="avatar" />
          <Toast className='w-90 border shadow-none position-relative ms-3'>
            <Toast.Header closeButton={false}>
              <strong className="me-auto">Andy Chen</strong>
              <small>11mins ago</small>
            </Toast.Header>
            <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
            <div className='triangle'></div>
          </Toast>
        </div>
        <textarea 
          placeholder='輸入評論'
          className='form-control text-addItem mt-3'>
          </textarea>
        </div>
        </Modal.Body>
      </div>
      </div>
      <Modal.Footer>
        
      </Modal.Footer>
      </div>
    </Modal>)
}