import { AxiosResponse } from "axios";
import axiosInstance from "../config/axiosConfig";

interface RegisterRequestType {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

class RegisterPageService {
  register(newUser: RegisterRequestType): Promise<RegisterResponse> {
    return new Promise((resolve: any, reject: any) => {
      console.log("RegisterPageService sending:", newUser);
      axiosInstance
        .post(`/auth/register`, newUser)
        .then((response: AxiosResponse<RegisterResponse>) => {
          console.log("RegisterPageService response:", response.data);
          resolve(response.data);
        })
        .catch((error: any) => {
          console.error("RegisterPageService error:", error);
          reject(error);
        });
    });
  }
}

export default new RegisterPageService();
