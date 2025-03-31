import axios from "axios";
import { BASE_URL } from "./constants";

const apiRequest = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    // Default headers for all requests
    "Content-Type": "application/json",
  },
});

//An Axios interceptor is a function that automatically modifies every request or response before they are sent or received.
// interceptors.request.use() takes two functions as arguments:
// 1️⃣ A function to modify the request (before it’s sent).
// 2️⃣ A function to handle errors (if something goes wrong).

apiRequest.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
    //config.headers is an object that stores the HTTP headers sent with a request in Axios.
      config.headers.Authorization = `Bearer ${accessToken}`;
    //It tells the server who is making the request by providing a token.
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); //Reject the promise if there's an error
    //If we do not return Promise.reject(error), Axios will not recognize that an error occurred, and the request might proceed with incomplete or incorrect data.
  }
);

export default apiRequest;
