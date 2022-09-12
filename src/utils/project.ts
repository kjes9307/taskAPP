import {useQuery,useMutation, QueryKey } from 'react-query';
import {cleanObject} from 'utils';
import {useHttp} from 'utils/request';
import { useAddConfig, useEditConfig } from './use-optimistic-options';
interface DataType {
    id?:string,
    _id?:string,
    name?:string,
    done?:boolean
    todoList? : DataType[]
    status?:boolean
}
export const useProject = (param?:Partial<DataType>) =>{
    const client = useHttp() ;
    // 第一參數為 監控key值
    return useQuery<DataType[]>(['task/project',param],()=>client('task/project',{data:cleanObject(param || {})}))

}

export const useEditName = (queryKey :QueryKey) => {
    const client = useHttp();

    return useMutation((params:Partial<DataType>) =>  client(`task/editProject/${params._id}`, {
            data: params,
            method: "PATCH",
        }),
        useEditConfig(queryKey)
    ) 
};
export const useAddName = (queryKey :QueryKey) => {
    const client = useHttp();

    return useMutation((params:Partial<DataType>) =>  client(`task/addTask`, {
            data: params,
            method: "POST",
        }),
        useAddConfig(queryKey)
    ) 
};
export const useProjectDetail = (id?: string) => {
    const client = useHttp();
    return useQuery<DataType[]>(
      ['task/project', { id }],
      () => client(`task/project/${id}`),
      {
        enabled: Boolean(id),//沒有id就不請求
      }
    );
  };