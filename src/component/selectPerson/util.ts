import { useQuery } from 'react-query';
import { useHttp } from 'utils/request';

export const useGetMember = (query:string) =>{
    const client = useHttp() ;
    return useQuery(['task/getKanBan',query],()=>client(`user/getUser?q=${query}`),
    {
      select: (data) => data.slice(0, 10).map((item: any) => ({ value: item.name, ...item})) || []
    })
  }
  