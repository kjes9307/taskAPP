import { useLocation } from 'react-router'
import { useQuery } from 'react-query';
import {useMemo} from 'react';
import { useHttp } from 'utils/request';
import {useUrlQueryParam} from 'utils/url'
export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  let arr = pathname.split('/')
  const id = arr[2];
  return id;
};
export interface Iprops<K>{
  alltask: K[]
  kanbanName: string
  projectId: string
  _id: string
}
export interface ColumnType {
    taskName : string,
    status: string,
    type: string,
}
export const useBoardData = () =>{
  const id = useProjectIdInUrl();
  const client = useHttp() ;
  return useQuery<Iprops<ColumnType>[]>(['task/getKanBan',id],()=>client(`task/getKanBan/${id}`),
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

