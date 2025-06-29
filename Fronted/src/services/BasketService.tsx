import axiosInstance from "../config/axiosConfig";
import { ProductType } from "../types/Types";

export interface CartItemType {
  _id?: string; // MongoDB ObjectId for the cart item
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  quantity: number;
}

export interface CartResponseType {
  userId: string;
  items: CartItemType[];
  _id?: string;
}

class BasketService {
  // Get user's cart
  async getUserBasket(): Promise<CartResponseType> {
    try {
      const userId = this.getUserId();
      const response = await axiosInstance.get(`/cart?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  }

  // Add product to cart
  async addToBasket(
    product: ProductType,
    quantity: number = 1
  ): Promise<CartResponseType> {
    try {
      const userId = this.getUserId();
      const cartItem = {
        userId: userId,
        item: {
          id: product.id.toString(),
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          quantity: quantity,
        },
      };

      const response = await axiosInstance.post("/cart", cartItem);
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  // Update product quantity in cart
  async updateBasketItem(
    itemId: string,
    quantity: number
  ): Promise<CartResponseType> {
    try {
      const userId = this.getUserId();
      const response = await axiosInstance.put(`/cart/${itemId}`, {
        userId: userId,
        quantity: quantity,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  }

  // Remove product from cart
  async removeFromBasket(itemId: string): Promise<CartResponseType> {
    try {
      const userId = this.getUserId();
      const response = await axiosInstance.delete(`/cart/${itemId}`, {
        data: { userId: userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  }

  // Clear entire cart
  async clearBasket(): Promise<void> {
    try {
      const userId = this.getUserId();
      await axiosInstance.delete("/cart", {
        data: { userId: userId },
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }

  // Get cart total
  async getBasketTotal(): Promise<{ totalAmount: number }> {
    try {
      const userId = this.getUserId();
      const response = await axiosInstance.get(`/cart?userId=${userId}`);
      const cart = response.data;
      const totalAmount =
        cart.items?.reduce((total: number, item: CartItemType) => {
          return total + item.price * item.quantity;
        }, 0) || 0;

      return { totalAmount };
    } catch (error) {
      console.error("Error fetching cart total:", error);
      throw error;
    }
  }

  // Helper function to get userId from localStorage
  private getUserId(): string {
    const user = localStorage.getItem("user");
    const currentUser = localStorage.getItem("currentUser");

    if (user) {
      const userData = JSON.parse(user);
      return userData.id || userData.userId || "";
    }

    if (currentUser) {
      const userData = JSON.parse(currentUser);
      return userData.id || userData.userId || "";
    }

    return "";
  }
}

export default new BasketService();
