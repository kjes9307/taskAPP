
import { AuthForm } from "context/userContext";
const apiUrl = process.env.REACT_APP_API_URL;

const localStorageKey = "auth_provider_token";
const localStorageKey1 = "__auth_provider_user__";

export const getToken = () => {
  let token = localStorage.getItem(localStorageKey);
  let name = localStorage.getItem(localStorageKey1);
  return {token,name};
}
export const handleUserResponse = (data : { token:string,name:string}) => {
  localStorage.setItem(localStorageKey, data.token || "");
  localStorage.setItem(localStorageKey1, data.name || "");
  return data;
};
// 不直接從provider 中調用login 函數
// 利用context 調用 , 不在context中做 , 就需要依個對頁面加載
export const login = (data: AuthForm) => {
  return fetch(`${apiUrl}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (response) => {
    if (response.ok) {
      let res = await response.json()
      return handleUserResponse(res.data);;
    } 
    else {
      return Promise.reject(await response.json()); // 與auth相關
    }
  });
};
export const register = (data: AuthForm) => {
  return fetch(`${apiUrl}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (response) => {
    if (response.ok) {
      let res = await response.json()
      return res
    } 
    else {
      return Promise.reject(await response.json()); // 與auth相關
    }
  });
};

export const checkToken = (data:string) => {
  return fetch(`${apiUrl}/user/checkToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": data ? `Bearer ${data}` : "",
    }
  }).then(async (response) => {
    if (response.ok) {
      let res = await response.json()
      return res;
    } else {
      return Promise.reject(response.json());
    }
  });
};

export const logout = () =>{// async與auth相關
  console.log("@logout")
  localStorage.removeItem(localStorageKey);
  localStorage.removeItem(localStorageKey1);
}
