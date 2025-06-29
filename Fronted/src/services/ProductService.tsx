import axios from "axios";
import { ProductType } from "../types/Types";

class ProductService {
  BASE_URL_FORALL =
    "https://yobexbackendsonhali.onrender.com/api/listAllProducts";
  BASE_URL_FORID =
    "https://yobexbackendsonhali.onrender.com/api/getProductById/";

  async getAllProducts(): Promise<ProductType[]> {
    try {
      console.log("Fetching products from:", this.BASE_URL_FORALL);
      const response = await axios.get<ProductType[]>(this.BASE_URL_FORALL);
      console.log("getAllProducts response:", response.data);
      console.log("Response status:", response.status);
      return response.data;
    } catch (error: any) {
      console.error("ProductService getAllProducts error:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      throw new Error("Failed to fetch products: " + error.message);
    }
  }

  async getProductById(productId: number): Promise<ProductType> {
    try {
      console.log("Fetching product by ID:", productId);
      const response = await axios.get<ProductType>(
        `${this.BASE_URL_FORID}${productId}`
      );
      console.log("getProductById response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("ProductService getProductById error:", error);
      throw new Error("Failed to fetch product: " + error.message);
    }
  }
}
export default new ProductService();
