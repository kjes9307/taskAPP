import { useState } from "react"
import classNames from "classnames";
import "./index.scss"


export interface typeSelectProps<K> {
    defaultIndex?: number;
    className?: string;
    onSelect?: (index:number) => void;
    type: K[]
}
export type ItemSelect ={
    textType?:string
    spanName?:string
    index?:number
    name?:string
}
export const IselectType = (props:typeSelectProps<ItemSelect>) =>{
    const { className, type, defaultIndex, onSelect } = props;
    const [value,setOption] = useState(defaultIndex || 0)
    const [open,setOpen] = useState(false)
    
    const handleClick = (id:number) =>{
        if(onSelect){
            onSelect(id as number)
        }
        setOption(id)
        setOpen(!open)
    }
    const layout_class = classNames("d-block typeselect",className)
    const classes = classNames('material-symbols-outlined')
    const classes_open = classNames(!open ? `d-none` : "d-block typedown-menu")
    const class_active=classNames('type-option d-flex align-items-center')
    return (
        <div className={layout_class} data-testid="test-select">
            <div onClick={()=>setOpen(!open)}>
                {
                    type?.map(x=>{
                        if(x.index===value){
                            return (
                                <span key={x.index} className={classes+` ${x.textType}`}>
                                {x.spanName}
                                </span>
                            )
                        }
                    })
                }
            </div>
            <div className={classes_open}>
            {type?.map((x)=>{
                return (
                    <div 
                        key={x.index}
                        onClick={()=>handleClick(x.index as number)}
                        className={x.index===value?`${class_active} active`:`${class_active}`}
                    >
                        <span className={`material-symbols-outlined me-2 ${x.textType}`}>
                        {x.spanName}
                        </span>
                        <span>
                        {x.name}
                        </span>
                    </div>
                )
            })}
            </div>
        </div>
    )
}