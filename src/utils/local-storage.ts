export const getLocalStorageValue = (key: string) => {
  const data = window?.localStorage?.getItem(key);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
};

export const setLocalStorageValue = <T>(key: string, value: T): void => {
  window.localStorage.setItem(key, JSON.stringify(value));
};
