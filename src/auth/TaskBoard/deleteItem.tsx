import {useState} from 'react'
import {Modal,Button} from 'react-bootstrap'
import { useDeleteTask,useDeleteKanban } from './util';
export const DeleteModal = ({title,type,id}:{title:string,type:string,id:string})=>{
    const [show, setShow] = useState(false);
    const useDelete = type === 'kanban' ? useDeleteKanban : useDeleteTask;
    const {mutateAsync} = useDelete()
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const submit = async () =>{
        await mutateAsync(id)
        setShow(false);
    }
    let alert = type==='kanban' ? <Modal.Title>Delete : {title} 看板!?</Modal.Title> : <Modal.Title>Delete : {title} 任務!?</Modal.Title> 
    return (
      <>
        <span className="material-symbols-outlined" onClick={handleShow} style={{cursor:"pointer"}}>
        more_horiz
        </span>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            {alert}
          </Modal.Header>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={submit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}