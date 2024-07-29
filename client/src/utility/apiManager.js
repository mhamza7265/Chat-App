import axios from "axios";
import { BASE_URL } from "./config";

const sendRequest = (method, url, payload, contentType, userType) => {
  return new Promise((resolve, reject) => {
    axios
      .request(setRequestOptions(method, url, payload, contentType, userType))
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err.response?.data.error));
  });
};

const setRequestOptions = (method, url, payload, contentType, userType) => {
  const storedItem =
    userType == "admin"
      ? localStorage.getItem("admin_user")
      : localStorage.getItem("currentUser");
  const storedData = JSON.parse(storedItem);
  let header = {};
  if (contentType && contentType == "formData") {
    header = {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: storedData?.token,
      },
    };
  } else {
    header = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: storedData?.token,
      },
    };
  }

  header["method"] = method;
  header["url"] = `${BASE_URL}/${url}`;

  if (method !== "GET") {
    header["data"] = payload;
  } else {
    header["params"] = payload;
  }
  // console.log("headers", header);
  return header;
};

export default sendRequest;
