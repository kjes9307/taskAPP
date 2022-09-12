import {useQuery } from 'react-query';
import {cleanObject} from 'utils';
import {useHttp} from 'utils/request';


interface UserDataType {
    id?:string,
    name?:string,
}
export const useUserInfo = (param?:Partial<UserDataType>) =>{
    const client = useHttp() ;
    // 第一參數為 監控key值
    // return useQuery<UserDataType[]>(['user/getUser',param],()=>client('user/getUser',{data:cleanObject(param || {})}))
    return useQuery<UserDataType[]>(['user/getUser'],()=>client('user/getUser'))
}