import React from "react";
import { Modal, Button } from "react-bootstrap";
import {useProjectModal,useProjectsQueryKey} from 'component/useModal'
import { useAddName,useEditName } from "utils/project";
import { useForm, SubmitHandler  } from 'react-hook-form';
type Inputs = {
  name: string,
};

export const ProjectModal = (props: {
    projectModalOpen: boolean;
  }) => {
    const {
      register,
      handleSubmit,
      resetField ,
      setValue ,
      formState: { errors },
    } = useForm<Inputs>();
    const {projectModalOpen,open,close,detailData,isLoading}=useProjectModal()
    const title = detailData? "Edit Item" : "Create Item";
    const useMutateProj = detailData ? useEditName : useAddName
    if(detailData){
      setValue("name",detailData?.[0].name || 'nodata')
    }else{
      setValue('name','');
    }
    

    // 異步操作 之後才能去控制關閉或刷新
    const {mutateAsync,error,isLoading:asyncLoading} = useMutateProj(useProjectsQueryKey())
    
    const onSubmit: SubmitHandler<Inputs> = (values) => {
      mutateAsync({...detailData?.[0],...values}).then(()=>{
        // close();
      })
    }

    
    
    return (
    <>
     
      <Modal show={projectModalOpen} onHide={close}>
      {isLoading?
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        :
        <Modal.Body>
          <h1>{title}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="d-flex align-items-center">
          <input  {...register("name")}/>  
          <Button type="submit" size="sm" className="ms-3">Edit</Button>
          </form>
        </Modal.Body>
      }

        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};