import { useState } from "react"
import Icon from 'component/Icon'
import {useAddMember} from './util'
import {SearchComplete,DataSourceType} from 'component/searchComplete'
type SelectPerson = {
    projectId : string
}
export const SelectPerson = (props:SelectPerson) =>{
    const [open,setOpen] = useState(false)   
    const {projectId} = props
    const {mutateAsync:addMemberAsync} = useAddMember()
    const handSelect = async(e:DataSourceType<UserProps>) =>{
        const {_id:userId} = e ;
        if(userId&&projectId){
            await addMemberAsync({userId,projectId})
        }
    }
    interface UserProps {
        photo: string;
        name: string;
        _id?:string;
        value?: string;
    }
    const renderCustom = (item: DataSourceType<UserProps>) => {
        return (
            <div className="d-flex align-items-center">
            {
            item.photo?
             <img src={item.photo} alt='user-avatar' className="user-avatar test rounded-circle" />
            : 
            <Icon 
                className='Icon-border rounded-circle' 
                icon='circle-question' 
                theme='dark' 
                size='1x' 
                style={{cursor:"pointer"}} 
            />
            }
            <p className="ms-2 mb-0">{item.name}</p>
            </div>
        )
    }

    return (
        <div className="d-flex">
            <div>
            <Icon 
                onClick={()=> setOpen(!open)} 
                className='Icon-move rounded-circle p-2' 
                icon='user-plus' 
                theme='dark' 
                size='1x' 
                style={{cursor:"pointer"}} 
            />
            </div>
            <div className="d-block bg-white ms-1">
                { open &&
                    <SearchComplete
                        onSelect={handSelect}
                        renderOption = {renderCustom}
                        icon='magnifying-glass'
                        onClick={()=> setOpen(!open)} 
                        />
                }
            </div>
        </div>
    )
}
