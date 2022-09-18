import {useState,useEffect} from 'react';
import {Card,Button } from 'react-bootstrap'
import { useAddTask } from './util';
export const CreateTask = (props:{kanbanId:string}) =>{
    const {kanbanId} = props
    const [task,setTask] = useState('')
    const {mutateAsync:asyncAddTask} = useAddTask()
    const [mode,setMode] = useState(false)
    const handleSubmit = async(e:React.KeyboardEvent<HTMLInputElement>) =>{
        if(e.key==="Enter"){
            await asyncAddTask({kanbanId,taskName:task || ''})
            setMode(false);
            setTask('')
        }
    }
    
    useEffect(()=>{
        if(!mode){
            setTask('')
        }
    },[mode])

    if(!mode){
        return (
            <div onClick={()=>setMode(!mode)}>add Task +</div>
        )
    }

    return (
        <>
        <Card style={{ cursor:"pointer" }} className="mx-auto mb-3" >
            <input value={task} placeholder="輸入任務" onChange={(e)=> setTask(e.target.value)} onKeyPress={(e)=>handleSubmit(e)} className="w-100" />
            {/* <Button  onClick={()=> setMode(!mode)}>close</Button> */}
        </Card>
        </>
    )
}