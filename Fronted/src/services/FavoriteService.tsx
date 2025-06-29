import axiosInstance from "../config/axiosConfig";
import { ProductType } from "../types/Types";

export interface FavoriteItemType {
  _id?: string; // MongoDB ObjectId for the favorite item
  id: string; // Product ID (backend'den dönen format)
  title: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface FavoriteResponseType {
  userId: string;
  items: FavoriteItemType[];
  _id?: string;
}

class FavoriteService {
  // Get user's favorites from backend
  async getUserFavorites(userId: string): Promise<FavoriteResponseType> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, returning empty favorites");
        return { userId, items: [] };
      }

      const response = await axiosInstance.get(`/favorites?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return { userId, items: [] };
    }
  }

  // Add product to favorites via backend
  async addToFavorites(
    userId: string,
    product: ProductType
  ): Promise<FavoriteResponseType> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please login first.");
      }

      const favoriteItem = {
        userId: userId,
        productId: product.id.toString(),
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image_url: product.image_url,
        rating: product.rating,
      };

      const response = await axiosInstance.post("/favorites", favoriteItem);
      return response.data;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw error;
    }
  }

  // Remove product from favorites via backend
  async removeFromFavorites(
    itemId: string,
    userId: string
  ): Promise<FavoriteResponseType> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please login first.");
      }

      const response = await axiosInstance.delete(`/favorites/${itemId}`, {
        data: { userId: userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error removing from favorites:", error);
      throw error;
    }
  }

  // Clear all favorites via backend
  async clearFavorites(userId: string): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please login first.");
      }

      await axiosInstance.delete("/favorites", {
        data: { userId: userId },
      });
    } catch (error) {
      console.error("Error clearing favorites:", error);
      throw error;
    }
  }

  // Check if product is in favorites
  async isProductInFavorites(
    userId: string,
    productId: string
  ): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return false;
      }

      const response = await axiosInstance.get(`/favorites?userId=${userId}`);
      const favorites = response.data;
      return (
        favorites.items?.some((item: any) => item.id === productId) || false
      );
    } catch (error) {
      console.error("Error checking if product is in favorites:", error);
      return false;
    }
  }
}

export default new FavoriteService();
