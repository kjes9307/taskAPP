import { useState } from "react"
import Icon from 'component/Icon'
import {SearchComplete,DataSourceType} from 'component/searchComplete'
import {useGetMember} from './util'
import './style.scss'
export const SelectPerson = () =>{
    const [open,setOpen] = useState(false)   
    const [query,setQuery] = useState('')
    const handleFetch = async(query: string) => {
        setQuery(query)
        return await fetch(`http://localhost:3000/user/getUser?q=${query}`)
                .then(res => res.json())
                .then(({data}) => {
                    return  data.slice(0, 10).map((item: any) => ({ value: item.name, ...item}))
                })
    }
    const handSelect = (e:DataSourceType) =>{
        console.log(e)
    }
    interface UserProps {
        photo: string;
        name: string;
        login?:string;
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
                        fetchSuggestions={handleFetch}
                        onSelect={handSelect}
                        renderOption = {renderCustom}
                        icon='magnifying-glass'
                    />
                }
            </div>
        </div>
    )
}
