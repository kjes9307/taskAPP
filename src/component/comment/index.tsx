import { useState, useEffect} from 'react'
import { Toast } from 'react-bootstrap'
import { CommentProp , useEditComment } from './util';
import { useDebounce } from 'utils'
export const Comment = (props:CommentProp) =>{
    const {user,comment,_id:postid} = props
    const [mode,setEdit] = useState(false)
    const [newcomment,setComment] = useState<string|null>(null)
    const commentValue=useDebounce(newcomment,800)
    const {mutateAsync:editCommentAsync}=useEditComment()
    const handComment = async() =>{
        await editCommentAsync({ 
          comment: commentValue as string ,
          postid: postid 
        })
    }
    useEffect(()=>{
      setComment(comment)
      setEdit(false)
      return ()=>{
        setComment(null)
      }
    },[])
    useEffect(()=>{
        if(commentValue){
          handComment()
        }
      },[commentValue])
    return(
        <div className='d-flex align-items-start mt-2'>
         <img src={user.photo} className="rounded-circle comment-avatar" alt="avatar" />
          <Toast className='w-100 border shadow-none position-relative ms-3'>
            <Toast.Header closeButton={false}>
              <strong className="me-auto fs-6">{user.name}</strong>
              <small>11mins ago</small>
            </Toast.Header>
            <Toast.Body>
              {mode === false?<span onClick={()=>setEdit(true)}>{comment}</span>:
              <textarea 
                className='border-0 border-bottom input-outline w-100 text-addItem' 
                value={newcomment || ''} 
                autoFocus
                onBlur={()=>setEdit(false)} 
                onChange={(e)=> setComment(e.target.value)}
                onKeyDown={(e)=>{
                  if(e.key==="Enter"){
                    setEdit(false)
                  }
                }}
              />
              }
            </Toast.Body>
            <div className='triangle'></div>
          </Toast>
        </div>
    )
}