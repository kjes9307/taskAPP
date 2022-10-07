import {Container, Row, Col, Table, Form , InputGroup } from 'react-bootstrap';
import React, {  useState }  from 'react'
import {Link} from 'react-router-dom'
import { useDebounce  } from 'utils';
import { useProjectsSearchParams } from 'utils/url';
import { useProject } from 'utils/project';
import {useUserInfo} from 'utils/user';
import {useProjectModal} from 'component/useModal'
import {DataType,ItemProps,IfuncProps} from 'utils/type';

export const SearchItem =(props:IfuncProps) =>{
    const [search,setOpen] = useState(false)
    const {open}=useProjectModal()
    const setSearchParam = (value:string) =>{
        props.searchItem({...props.param,name: value})
    }
    return (
        <section className='py-1'>
            <Container fluid='md' >
                <Row >
                    <Col md='5' className='d-flex align-items-center'>
                    <h3>TaskTodo</h3>
                    <span onClick={open} style={{cursor:"pointer"}} className="material-symbols-outlined ms-3">
                        add
                    </span>
                    <span onClick={()=>{setOpen(!search);setSearchParam('')}} style={{cursor:"pointer"}} className="material-symbols-outlined ms-3">
                            search
                    </span>
                    {/* value: 預設值 刷新的時候 不會反白  */}
                    <Form.Select 
                        value={props.param.personId? props.param.personId : '0'} 
                        aria-label="Default select example" className='ms-3' 
                        onChange={(e)=>props.searchItem({...props.param,personId: e.target.value ==='0'? undefined : e.target.value })}
                    >
                    <option value={'0'}>建立者</option>
                    {
                        props.userList?.map(i=>(
                            <option value={i._id} key={i._id}>{i.name}</option>
                        )) || <option key='1'>未知</option>
                    }
                    </Form.Select>
                    </Col>
                    <Col md='7' className='d-flex align-items-center'>
                        { search ? 
                        <InputGroup>
                            <Form.Control
                                placeholder="Search Task"
                                onChange={(e)=> setSearchParam(e.currentTarget.value)}
                            />
                        </InputGroup>
                        : null}
                    </Col>
                </Row>
            </Container> 
        </section>
    )
}
export const ContainBox =(props: DataType) =>{
    const {todoList,userList} =props
    return (
        <>
        <Table hover className='text-dark'>
            <thead>
            <tr className='text-center'>
                <th className='d-none d-sm-block'>ID</th>
                <th>任務名稱</th>
                <th>建立者</th>
                <th>動作</th>
            </tr>
            </thead>
            <tbody>
                {
                    todoList?.length !== 0 ? todoList?.map((item,idx)=>{
                        
                        return (
                            <ContainItem 
                              item={item} 
                              key={item._id}
                              index={idx}
                              creator = {userList?.find(x=> x._id === item.personId)?.name || '未知'}
                            />
                        )
                    })
                    :<tr><th></th><td>No data</td><td></td></tr>
                }
            </tbody>
        </Table>
        </>
    )
}
export const ContainItem = (props:ItemProps) =>{
    const {item,index,creator} =props
    const {starEdit}=useProjectModal()
    const checkedClass = item.pin ? "material-symbols-outlined brand-color" : "material-symbols-outlined "
    return (
        <tr className="fs-6 text-center">
            <th scope="row" className='d-none d-sm-block'>
            #{index as number +1}</th>
            <td><Link to={`task/${item._id}/Event`} className="text-decoration-none">{item?.name}</Link></td>
            <td>{creator}</td>
            <td>
            <div className="d-flex justify-content-center">
                <span 
                    onClick={()=>console.log("checked",item._id)}
                    className={checkedClass}
                    style={{cursor:"pointer"}}
                >
                stars
                </span>
                <span 
                    onClick={()=> starEdit(item?._id || '')}  
                    className="material-symbols-outlined ms-4" 
                    style={{cursor:"pointer"}}
                >
                    edit
                </span>
            </div>
            </td>
        </tr>
    )
}
export const Task = () =>{
    const [param,setParam] = useProjectsSearchParams()
    const {data:todo} = useProject(useDebounce(param,1000))
    const {data:userList} = useUserInfo();
    const searchItem = (newObj:{name?:string,personId?:string}) =>{
        setParam(newObj);
    }
    return (
        <>
        <Container fluid="md">  
        <SearchItem userList={userList || []} searchItem={searchItem} param={param} />
            <Row className='justify-content-center'>
                <Col md="12">
                <ContainBox todoList={todo || []} userList={userList|| []} />
                </Col>
            </Row>         
        </Container>
        </>
    )
}