import { useUrlQueryParam } from "utils/url";
import { useMemo, useState } from "react";
import { useProjectDetail } from "utils/project";

// 项目列表搜索的参数
export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]
    ),
    setParam,
  ] as const;
};

export const useProjectsQueryKey = () => {
  const [param] = useProjectsSearchParams();
  return ["task/project", param];
};
export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]); // 透過url判斷狀態是 add or edit
  const [{ editId }, setEdit] = useUrlQueryParam([
    "editId",
  ]);
  const {data:detailData,isLoading} = useProjectDetail(String(editId))
  const open = () => setProjectCreate({ projectCreate: true });
  const close = () => {
    setProjectCreate({ projectCreate: undefined });
    setEdit({editId: undefined })
  }
  // 接到edit 中項目的id 並設置道url上
  const starEdit = (id:string) => setEdit({ editId : id })
  return {
    projectModalOpen: projectCreate === "true" || Boolean(editId),
    open,
    close,
    starEdit,
    detailData,
    isLoading,
    editId
  };
};