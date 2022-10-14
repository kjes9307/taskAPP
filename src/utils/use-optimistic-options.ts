import { QueryKey, useQueryClient } from "react-query";
// import { reorder } from "utils/reorder";
// import { Task } from "types/task";

export const useConfig = (
  queryKey: QueryKey,
  // old? 滿足setQueryData 要求
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    async onMutate(target: any) {
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        // 抽出不同部分 as callback
        return callback(target, old);
      });
      return { previousItems };
    },
    // roll back
    onError(error: any, newItem: any, context: any) {
      queryClient.setQueryData(queryKey, context.previousItems);
    },
  };
};

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) => old?.filter((item) => item._id !== target._id) || []
  );
export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.map((item) =>{
       return (item._id === target._id ? { item, ...target } : item)
      }
    ) || []
  );
export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => (old ? [...old, target] : []));
