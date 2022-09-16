import React from "react";
import {Container,Form,Row,Col,Button} from 'react-bootstrap'
import { Path, useForm, UseFormRegister, SubmitHandler } from "react-hook-form";
import {cleanObject} from 'utils'
import {useTaskSearchParam} from './util'
interface IFormValues {
  owner: string;
  Status: string;
  type : string;
  taskName?: string;
  onChange: ()=>void
}

export const SearchPanel = () => {
  const { register, handleSubmit } = useForm<IFormValues>();
  const [param ,setPanelParam]= useTaskSearchParam()
  const onSubmit: SubmitHandler<IFormValues> = data => {
    let res= {...data}
    console.log(cleanObject(res))
  };

  return (
    <Container fluid='md' className="mb-3">
    <Row>
    <Col md='12'>
    <form onSubmit={handleSubmit(onSubmit)}>
     <div className="d-flex align-items-center">
     <Form.Group 
        controlId="exampleForm" 
        className="d-flex align-items-center">
        <Form.Control 
            {...register('taskName')} 
            type="text" 
            placeholder="任務名" 
            onChange={(e)=>setPanelParam({...param,taskName:e.target.value})}
            />
    </Form.Group>
    <Form.Select 
        {...register("Status")} 
        className="w-100p ms-3 h-25p" 
        defaultValue={''} 
        aria-label="Default select example"
        onChange={(e)=>setPanelParam({...param,status:e.target.value})}
        >
        <option value=''>狀態</option>
        <option value="idle">idle</option>
        <option value="ongoing">ongoing</option>
        <option value="done">done</option>
    </Form.Select>
    <Form.Select 
        {...register("type")} 
        className="w-100p ms-3 h-25p" 
        defaultValue={""} 
        aria-label="Default select example"
        onChange={(e)=>setPanelParam({...param,type:e.target.value})}
        >
        <option value=''>任務類型</option>
        <option value="bug">bug</option>
        <option value="issue">issue</option>
        <option value="task">task</option>
        </Form.Select>
      {/* <Select label="負責人" {...register("owner")} /> */}
      <Button type="submit" children='Search' className="ms-4" />
      </div>
    </form>
    </Col>
    </Row>
    </Container>
  );
};