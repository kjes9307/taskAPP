import { useMemo} from "react"
import { useSearchParams , URLSearchParamsInit } from "react-router-dom"
import {cleanObject} from "utils"

export const useUrlQueryParam = <K extends string>(keys:K[] ) =>{
    // 內建的HOOK
    const [searchParmas,setSearchParam] = useSearchParams()
    // console.log(searchParmas.get('name'))
    // 每一次都創造新對象
    return [
    useMemo(()=>keys.reduce((prev,  key )=>{
        // KEY 值必須要是某幾種值
        return {...prev,[key]:searchParmas.get(key) || ''}
    },{} as {[key in K] : string}), [searchParmas]) ,
    
    // setSearchParam
    // 改成函數限制傳入的key 值 // 只接受參數中的key
    (param:Partial<{[key in K] : unknown}>)=> {
        // entries 讀取一個iterator並轉成obj
        const o = cleanObject({...Object.entries(searchParmas),...param}) as URLSearchParamsInit
        return setSearchParam(o)
    }
    
    ] as const
}
export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  return [
    useMemo(
      // personId is not number here
      () => ({ ...param, personId: param.personId || undefined }),
      [param]
    ),
    setParam,
  ] as const;
};


// 使用K的原因是 讓返回值滿足param 需求
// export const useUrlQueryParam = <K extends string>(keys:K[] ) =>{
//     const [searchParmas,setSearchParam] = useSearchParams()
//     return [
//     // 每次改變都產新對象
//     // 剛好又是useEffect的dep 導致比對狀況產生\

//     // 步要讓組件渲染的時候 重新render
//     // key not in dep 可以用state 控制
//     useMemo(()=> keys.reduce((prev,  key )=>{
//         return {...prev,[key]:searchParmas.get(key) || ''}
//     },{} as {[key in K] : string}) 
//     ,[searchParmas]) ,
    
//     // 改成函數限制傳入的key 值
//     (param:Partial<{[key in K] : unknown}>)=> {
//         const o = cleanObject({...Object.entries(searchParmas),...param}) as URLSearchParamsInit
//         return setSearchParam(o)
//     }
//     ] as const
// }


   
