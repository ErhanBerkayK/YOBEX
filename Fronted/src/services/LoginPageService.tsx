import { AxiosResponse } from "axios";
import axiosInstance from "../config/axiosConfig";
import { UserType } from "../types/Types";

interface LoginResponse {
  token: string;
}

class LoginPageService {
  login(credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post("/auth/login", credentials)
        .then((response: AxiosResponse<LoginResponse>) => {
          // Store the token in localStorage
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
          }

          resolve(response.data);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
}

export default new LoginPageService();

//https://yobexbackendsonhali.onrender.com/api/auth/register
