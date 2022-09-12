import {Container, Row, Col, Table, Form , InputGroup } from 'react-bootstrap';
import React, {  useState }  from 'react'
import { useDebounce  } from 'utils';
import { useUrlQueryParam } from 'utils/url';
import { useProject } from 'utils/project';
import {useUserInfo} from 'utils/user';
import {useProjectModal} from 'component/useModal'

interface DataType {
    id?:string,
    _id?:string,
    name?:string,
    done?:boolean
    todoList? : DataType[]
    status?:boolean
}
type ItemProps = {
    item: DataType
    id?: string
    _id?: string
    key?: string
    status?:boolean
    index?: number
}
interface UserDataType {
    _id?:string,
    name?:string,
}
type IfuncProps = {
    searchItem:(newObj:{name:string})=>void
    userList: UserDataType[]
}
export const SearchItem =(props:Pick<IfuncProps,"searchItem"|'userList'>) =>{
    const [search,setOpen] = useState(false)
    const {open}=useProjectModal()
    const setSearchParam = (value:string) =>{
        props.searchItem({name: value})
    }
    return (
        <section className='bg-brand-color py-1'>
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
                    <Form.Select aria-label="Default select example" className='ms-3' onChange={(e)=>console.log(e.target.value)}>
                    <option value="0">建立者</option>
                    {
                        props.userList?.map(i=>(
                            <option key={i._id}>{i.name}</option>
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
    const {todoList} =props
    return (
        <>
        <Table hover>
            <thead>
            <tr className='text-center'>
                <th>ID</th>
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
    const {item,index} =props
    const {starEdit}=useProjectModal()
    return (
        <tr className="fs-6 lh-base p-3 text-center">
            <th scope="row">
            #{index as number +1}</th>
            <td>{item?.name}</td>
            <td></td>
            <td className="px-0 d-flex justify-content-center">
            <span className="material-symbols-outlined" style={{cursor:"pointer"}}>
            stars
            </span>
            <span onClick={()=> starEdit(item?._id || '')}  className="material-symbols-outlined ms-4" style={{cursor:"pointer"}}>
                edit
            </span>
            </td>
        </tr>
    )
}
export const Task = () =>{
    const [param,setParam] = useUrlQueryParam(['name','personId']);
    const debounceParam = useDebounce(param,1000)
    const {isLoading,data:todo} = useProject(debounceParam)
    const {data:userList} = useUserInfo();
    const searchItem = (newObj:{name:string}) =>{
        setParam(newObj);
    }
    return (
        <>
        
        <Container fluid="md">  
        <SearchItem userList={userList || []} searchItem={searchItem} />
            <Row className='justify-content-center'>
                <Col md="12">
                <ContainBox todoList={todo || []} />
                </Col>
            </Row>         
        </Container>
        </>
    )
}