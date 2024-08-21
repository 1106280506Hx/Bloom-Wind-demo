import constant from "@/constant";
/**
 * 设置LocalStorage
 * @param key 名称
 * @param value 值
 */
export const setLocalStorage = (key: string, value: any) => {
  value = typeof value === "object" ? JSON.stringify(value) : value;
  localStorage.setItem(key, value);
};

/**
 * 读取LocalStorage
 * @param key 名称
 */
export const getLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  } else {
    console.warn(`This local storage cannot be found [${key}]`);
    return void 0;
  }
};

/**
 * 设置token
 * @param token
 */
export const setToken = (token: string) => {
  setLocalStorage(constant.STORE_NAME.TOKEN, token);
};

/**读取token */
export const getToken = () => {
  return getLocalStorage(constant.STORE_NAME.TOKEN);
};
