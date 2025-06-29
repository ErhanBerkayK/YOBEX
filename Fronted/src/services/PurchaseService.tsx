import axiosInstance from "../config/axiosConfig";

export interface PurchaseRequestType {
  userId: string;
  totalAmount: number;
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
  }>;
}

export interface PurchaseResponseType {
  success: boolean;
  message: string;
  newBalance: number;
  orderId?: string;
}

class PurchaseService {
  // Helper function to get user from localStorage
  private getUserFromStorage(): any {
    const user = localStorage.getItem("user");
    const currentUser = localStorage.getItem("currentUser");

    if (user) {
      return JSON.parse(user);
    }

    if (currentUser) {
      return JSON.parse(currentUser);
    }

    return null;
  }

  // Helper function to update user balance in localStorage
  private updateUserBalanceInStorage(newBalance: number): void {
    const user = this.getUserFromStorage();
    if (user) {
      user.balance = newBalance;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  }

  // Process purchase and deduct balance using localStorage
  async processPurchase(
    purchaseData: PurchaseRequestType
  ): Promise<PurchaseResponseType> {
    try {
      const user = this.getUserFromStorage();
      if (!user) {
        throw new Error("User not found");
      }

      const currentBalance = user.balance || 0;

      if (currentBalance < purchaseData.totalAmount) {
        throw new Error("Insufficient balance");
      }

      // Deduct balance
      const newBalance = currentBalance - purchaseData.totalAmount;
      this.updateUserBalanceInStorage(newBalance);

      // Generate order ID
      const orderId = `order_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Store purchase history in localStorage
      const purchaseHistory = JSON.parse(
        localStorage.getItem("purchaseHistory") || "[]"
      );
      const newPurchase = {
        orderId,
        userId: purchaseData.userId,
        totalAmount: purchaseData.totalAmount,
        items: purchaseData.items,
        purchaseDate: new Date().toISOString(),
      };
      purchaseHistory.push(newPurchase);
      localStorage.setItem("purchaseHistory", JSON.stringify(purchaseHistory));

      return {
        success: true,
        message: "Purchase completed successfully!",
        newBalance,
        orderId,
      };
    } catch (error) {
      console.error("Error processing purchase:", error);
      throw error;
    }
  }

  // Get user's current balance from localStorage
  async getUserBalance(userId: string): Promise<{ balance: number }> {
    try {
      const user = this.getUserFromStorage();
      if (!user) {
        throw new Error("User not found");
      }

      return { balance: user.balance || 0 };
    } catch (error) {
      console.error("Error fetching user balance:", error);
      throw error;
    }
  }

  // Update user balance in localStorage
  async updateUserBalance(
    userId: string,
    newBalance: number
  ): Promise<{ balance: number }> {
    try {
      this.updateUserBalanceInStorage(newBalance);
      return { balance: newBalance };
    } catch (error) {
      console.error("Error updating user balance:", error);
      throw error;
    }
  }

  // Get purchase history from localStorage
  async getPurchaseHistory(userId: string): Promise<any[]> {
    try {
      const purchaseHistory = JSON.parse(
        localStorage.getItem("purchaseHistory") || "[]"
      );
      return purchaseHistory.filter(
        (purchase: any) => purchase.userId === userId
      );
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      return [];
    }
  }
}

export default new PurchaseService();
