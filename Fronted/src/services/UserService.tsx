import axiosInstance from "../config/axiosConfig";
import { UserType } from "../types/Types";

export interface UserBalanceResponse {
  balance: number;
  message?: string;
}

class UserService {
  // Get user's current balance
  async getUserBalance(userId: string): Promise<UserBalanceResponse> {
    try {
      const response = await axiosInstance.get(
        `/user/balance?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user balance:", error);
      throw error;
    }
  }

  // Update user balance
  async updateUserBalance(
    userId: string,
    newBalance: number
  ): Promise<UserBalanceResponse> {
    try {
      const response = await axiosInstance.put(`/user/balance`, {
        userId,
        balance: newBalance,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user balance:", error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<UserType> {
    try {
      const response = await axiosInstance.get(
        `/user/profile?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(
    userId: string,
    userData: Partial<UserType>
  ): Promise<UserType> {
    try {
      const response = await axiosInstance.put(`/user/profile`, {
        userId,
        ...userData,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }
}

export default new UserService();
