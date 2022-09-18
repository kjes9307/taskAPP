import { useLocation } from 'react-router'
import { useMutation, useQuery } from 'react-query';
import {useMemo} from 'react';
import { useHttp } from 'utils/request';
import {useUrlQueryParam} from 'utils/url'
import {cleanObject,useDebounce} from 'utils'
export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  let arr = pathname.split('/')
  const id = arr[2];
  return id;
};
export interface Iprops<K>{
  alltask?: K[] | []
  kanbanName: string
  projectId?: string
  _id?: string
  creator?:string
}
export interface ColumnType {
    taskName : string,
    status: string,
    type: string,
}
export type Iparams={
  [key:string]: unknown
}
export const useBoardData = () =>{
  const id = useProjectIdInUrl();
  const [param]=useTaskSearchParam()
  let debounceValue = useDebounce(param.taskName,1200)
  let searchParams = cleanObject({...param,taskName:debounceValue })
  const client = useHttp() ;
  return useQuery<Iprops<ColumnType>[]>(['task/getKanBan',{...searchParams,id}],()=>client(`task/getKanBan/${id}/Event`,{data:searchParams || {}}),
  {
    enabled: Boolean(id),
    select: (data) => data || []
  })
}

export const useTaskSearchParam = () =>{
  const id = useProjectIdInUrl();
  const [param,setTaskSearchParam] = useUrlQueryParam(['status','type','taskName'])
  return [useMemo(() => ({
    "type": param.type || undefined,
    "status": param.status || undefined,
    "taskName": param.taskName || undefined
  }), [param,id]),
  setTaskSearchParam] as const
}

export const useAddKanban = () =>{
  const client = useHttp()
  const projectId = useProjectIdInUrl();
  return useMutation((params:Iprops<ColumnType>) =>  client(`task/addKanBan`, {
    data: {...params,projectId},
    method: "POST",
  })
  ) 
}