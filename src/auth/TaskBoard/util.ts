import { useLocation } from 'react-router'
import { useMutation, useQuery, useQueryClient } from 'react-query';
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
  kanbanName?: string
  projectId?: string
  _id?: string
  creator?:string
  item? : ColumnType
}
export interface ColumnType {
    _id?:string,
    taskName?: string,
    status?: string,
    type?: string,
    kanbanId?:string
    taskCreator?: {[key:string]:string}
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
  const queryClient = useQueryClient()

  return useMutation((params:Iprops<ColumnType>) =>  client(`task/addKanBan`, {
    data: {...params,projectId},
    method: "POST",
  }),{
    onSuccess: () =>queryClient.invalidateQueries(`task/getKanBan`)
  }
  ) 
}

export const useDeleteKanban = () =>{
  const client = useHttp()
  const queryClient = useQueryClient()

  return useMutation((id:string) =>  client(`task/deleteKanBan/${id}`, {
    data: {},
    method: "DELETE",
  }),{
    onSuccess: () =>queryClient.invalidateQueries(`task/getKanBan`)
  }
  ) 
}
export const useAddTask = () =>{
  const client = useHttp()
  const projectId = useProjectIdInUrl();
  const queryClient = useQueryClient()

  return useMutation((params:ColumnType) =>  client(`task/addTask`, {
    data: {...params,projectId},
    method: "POST",
  }),{
    onSuccess: () =>queryClient.invalidateQueries(`task/getKanBan`)
  }
  ) 
}
export const useEditTask = () =>{
  const client = useHttp()
  const queryClient = useQueryClient()

  return useMutation((params:ColumnType) =>  client(`task/editTask`, {
    data: {...params},
    method: "PATCH",
  }),{
    onSuccess: () =>queryClient.invalidateQueries(`task/getKanBan`)
  }
  ) 
}
export const useDeleteTask = () =>{
  const client = useHttp()
  const queryClient = useQueryClient()

  return useMutation((id:string) =>  client(`task/deleteTask/${id}`, {
    data: {},
    method: "DELETE",
  }),{
    onSuccess: () =>queryClient.invalidateQueries(`task/getKanBan`)
  }
  ) 
}
export const useTaskDatail = (id:string) =>{
  const client = useHttp()
  return useQuery<ColumnType>(['task/getTask',id],()=>client(`task/getTask/${id}`),
  {
    enabled: Boolean(id),
    select: (data) => data || []
  })
}
export const useTaskModel = () =>{
  const [{ taskEdit }, setTaskOpen] = useUrlQueryParam([
    "taskEdit",
  ]);
  const {data,isLoading,isError,error} =useTaskDatail(taskEdit)
  const startEdit = (taskId : string) => setTaskOpen({ taskEdit: taskId });
  const close = () => {
    setTaskOpen({ taskEdit: undefined });
  }
  return {
    taskModalOpen : Boolean(taskEdit),
    startEdit,
    close,
    data,
    isLoading,
    isError,
    error
  }
}