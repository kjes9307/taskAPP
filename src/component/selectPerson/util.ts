import { useQuery } from 'react-query';
import { useHttp } from 'utils/request';

export const useGetMember = (query:string) =>{
  console.log(query);
    const client = useHttp() ;
    return useQuery(['user/getUser',query],()=>client(`user/getUser?q=${query}`),
    {
      select: (data) => data.slice(0, 10).map((item: any) => ({ value: item.name, ...item})) || []
    })
  }
  