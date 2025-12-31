// import axios from "axios";

// const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

// export const instance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "https://ваш-бекент.com/api",
//   withCredentials: true,
// });

import axios from "axios";

export const instance = axios.create({
  baseURL: "",
  withCredentials: true,
});
