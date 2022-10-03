import React, { FC, useState, ChangeEvent,KeyboardEvent, ReactElement, useEffect, useRef} from "react";
import classNames from "classnames";
import  { Input,InputProps } from '../input'
import Icon from 'component/Icon'
import {useDebounce,useClickOutside} from 'utils'
interface DataSourceObject {
    value: string;
}
export type DataSourceType<T = {}> =  Partial<T & DataSourceObject>

export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
    fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>; // 下拉選單
    onSelect?: (item: DataSourceType) => void; //選中誰
    renderOption?: (item: DataSourceType) => ReactElement;
    onClose?: ()=> void
}

export const SearchComplete: FC<AutoCompleteProps> = (props) => {
    const {
        fetchSuggestions,
        onSelect,
        value,
        renderOption,
        onClose,
        ...restProps
    } = props
    // 組件控制值
    const [ inputValue, setInputValue ] = useState<string|number|undefined>('')
    const [ suggestions, setSuggestions ] = useState<DataSourceType[]>([])
    const [ loading, setLoading ] = useState(false)
    const [ highlightIndex, setHighlightIndex ] = useState(-1)
    const triggerSearch = useRef(false)
    const componentRef = useRef<HTMLDivElement>(null)

    const devalue = useDebounce(inputValue,700)
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
            const results = fetchSuggestions(value); // array or promise
            if(results instanceof Promise){
                console.log('trigged')
                setLoading(true)
                results.then(data => {
                    setLoading(false)
                    setSuggestions(data)
                })
            }else{
                setSuggestions(results);
            }
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
                        <li key={index} onClick={() => handleSelect(item)} className={cnames}>
                            {renderTemplate(item)}
                        </li>
                    )
                })}
            </ul>
        )
    }
    // 3 展示清單元素被點擊時 展示元素訊息
    const handleSelect = (item: DataSourceType) => {
        setInputValue(item.value)
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
    },[devalue])
    return (
        <div 
            className="position-relative" 
            ref={componentRef}
        >
            <div className="position-absolute search-data">
                <Input
                    value={inputValue}
                    {...restProps}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    placeholder="Search Member..."
                />
            </div>
            <div className="position-absolute show-search select-person">
            { loading && <ul><Icon icon="spinner" spin/></ul>}
            {( suggestions.length > 0) && generateDropdown()}
            </div>  
        </div>
    )
}

;
