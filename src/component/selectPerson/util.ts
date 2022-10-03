import { useQuery } from 'react-query';
import { useHttp } from 'utils/request';
import {useUrlQueryParam} from 'utils/url'

export const useGetMember = (query:string) =>{
    const client = useHttp() ;
    return useQuery(['user/getUser',query],()=>client(`user/getUser?q=${query}`),
    {
      enabled: Boolean(query),
      select: (data) => data.slice(0, 10).map((item: any) => ({ value: item.name, ...item})) || []
    })
 }

export const useSearchTarget = () =>{
  const [{ setSearch }, setSearchOpen] = useUrlQueryParam([
    "setSearch",
  ]);

}