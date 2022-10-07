import { Modal, Button,Container,Row,Col } from "react-bootstrap";
import {useProjectModal,useProjectsQueryKey} from 'component/useModal'
import { useAddName,useEditName } from "utils/project";
import { useForm, SubmitHandler  } from 'react-hook-form';
import "./modal.scss"
import Icon from 'component/Icon'
type Inputs = {
  name: string,
};

export const ProjectModal = (props: {
    projectModalOpen: boolean;
  }) => {
    const {
      register,
      handleSubmit,
      setValue ,
    } = useForm<Inputs>();
    const {projectModalOpen,close,detailData,isLoading}=useProjectModal()
    const title = detailData? "Edit" : "Create";
    const useMutateProj = detailData ? useEditName : useAddName
    if(detailData){
      setValue("name",detailData?.[0].name || 'nodata')
    }else{
      setValue('name','');
    }
    

    // 異步操作 之後才能去控制關閉或刷新
    const {mutateAsync} = useMutateProj(useProjectsQueryKey())
    
    const onSubmit: SubmitHandler<Inputs> = (values) => {
      mutateAsync({...detailData?.[0],...values}).then(()=>{
        // close();
      })
    }
    
    return (
    <>
      <Modal show={projectModalOpen} onHide={close} contentClassName='modal-layout'>
        <Container>
        <Row>
          <Col sm='12'>
        <Modal.Title className="d-flex justify-content-between flex-row-reverse m-2">
          <Icon icon='x' className="font-color" onClick={close} style={{cursor:"pointer"}} />
          <h1 className="font-color">{title}</h1>
        </Modal.Title>
        {isLoading?
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          :
          <Modal.Body className="pt-0 pb-0">
            <form onSubmit={handleSubmit(onSubmit)}>
            <label className="font-color" htmlFor="taskName">修改名稱</label>
              <div className="d-flex justify-content-between">
                <input id='taskName'  {...register("name")} className='input-outline input-layout border-0 border-bottom' />  
                <Button type="submit" size="sm" className="ms-3 text-white">Edit</Button>
              </div>
            </form>
            <h6 className="font-color mt-2">卡片數量</h6>
          </Modal.Body>
        }
          </Col>
        </Row>
        </Container>
      </Modal>
    </>
  );
};