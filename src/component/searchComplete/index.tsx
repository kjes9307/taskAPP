import { FC, useState, ChangeEvent,KeyboardEvent, ReactElement, useEffect, useRef, RefObject} from "react";
import classNames from "classnames";
import  { Input,InputProps } from '../input'
import Icon from 'component/Icon'
import {useDebounce,useClickOutside} from 'utils'
import {useGetMember} from './util'

interface DataSourceObject {
    value: string;
}
export type DataSourceType<T = {}> =  Partial<T & DataSourceObject>

export interface CompleteProps extends Omit<InputProps, 'onSelect'> {
    onSelect?: (item: DataSourceType) => void; //選中誰
    renderOption?: (item: DataSourceType) => ReactElement;
    onClick?: ()=> void
    ref?:RefObject<HTMLElement>
}

export const SearchComplete: FC<CompleteProps> = (props) => {
    const {
        onSelect,
        value,
        renderOption,
        onClick,
        ...restProps
    } = props
    // 組件控制值
    const [ inputValue, setInputValue ] = useState<string>('')
    const [ suggestions, setSuggestions ] = useState<DataSourceType[]>([])
    const [ history, setHistory] = useState<string[]>([])
    const [ highlightIndex, setHighlightIndex ] = useState(-1)
    const triggerSearch = useRef(false)
    const componentRef = useRef<HTMLDivElement>(null)

    const devalue = useDebounce(inputValue,700)
    const {data:fetchData,isError,isLoading} = useGetMember(devalue) 

    // console.log("@",suggestions) 
    //1 改變輸入值
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        setInputValue(value)
        triggerSearch.current = true;

    }
    const rendetSearch = (value:string) =>{
        if(value &&  triggerSearch.current) {
            // 1.1 狀態改變 下拉選單更新
            // 1.2 fetchSuggestions 引入外部清單
            let results = fetchData; // array or promise
            console.log('trigged')
            setSuggestions(results);

        }else {
            setSuggestions([]);
        }
    }
    //4 自訂義 展示模板
    const renderTemplate = (item: DataSourceType) => {
        // 有自訂義模板 就用 沒有就抓 value
        return renderOption ? renderOption(item) : item.value // 簡單結構是value 非是 item.value;
    }
    //6  鍵盤移動
    const highlight = (index: number) => {
        if(index < 0) index = 0;
        if(index >= suggestions.length) {
            index = suggestions.length - 1;
        }
        setHighlightIndex(index);
    }
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        switch(e.keyCode) {
            case 13:
                if(suggestions[highlightIndex]) {
                    handleSelect(suggestions[highlightIndex])
                }
                break;
            case 38:
                highlight(highlightIndex - 1);
                break;
            case 40:
                highlight(highlightIndex + 1);
                break;
            case 27:
                setSuggestions([])
                break;
            default:
                break;
            
        }
    }
    //2 受1.1影響 展示fetchSuggestions提供的搜索清單
     const generateDropdown = () => {
        return (
            <ul className="list-unstyled">
                {suggestions.map((item, index) => {
                    const cnames = classNames('suggestion-item', {
                        'item-highlighted' : index === highlightIndex 
                    })
                    return (
                        <li key={index} onClick={() => handleSelect(item)} className={cnames} style={{cursor:'pointer'}}>
                            {renderTemplate(item)}
                        </li>
                    )
                })}
            </ul>
        )
    }
    // 3 展示清單元素被點擊時 展示元素訊息
    const handleSelect = (item: DataSourceType) => {
        setInputValue(item.value as string)
        setHistory([...history,item.value as string])
        setSuggestions([])
        if ( onSelect ) {
            // 將元素訊息向外傳遞
            onSelect(item);
        }
        triggerSearch.current = false;
    }
    useClickOutside(componentRef, () => { setSuggestions([]);})

    useEffect(()=>{
        rendetSearch(devalue as string)
        setHighlightIndex(-1)
    },[devalue,fetchData])
    return (
        <div className="position-relative" ref={componentRef} >
            <Input
                value={inputValue}
                {...restProps}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                placeholder="Search Member..."
            />
            <div className={inputValue ? `position-absolute select-person` :'d-none'}>
            { isLoading && <ul><Icon icon="spinner" spin/></ul>}
            {( suggestions?.length > 0) && generateDropdown()}
            </div>  
        </div>
    )
}

;
