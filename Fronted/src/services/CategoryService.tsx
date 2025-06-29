import axios, { AxiosResponse } from "axios";
import { ProductType } from "../types/Types";

class CategoryService {
  BASE_URL = "https://yobexbackendsonhali.onrender.com/api";
  getAllCategories(): Promise<string[]> {
    return new Promise((resolve: any, reject: any) => {
      console.log(
        "Fetching categories from:",
        `${this.BASE_URL}/listCategories`
      );
      axios
        .get(`${this.BASE_URL}/listCategories`)
        .then((response: AxiosResponse<any, any>) => {
          console.log(
            "CategoryService getAllCategories response:",
            response.data
          );
          console.log("Response status:", response.status);
          resolve(response.data);
        })
        .catch((error: any) => {
          console.error("CategoryService getAllCategories error:", error);
          console.error("Error response:", error.response);
          console.error("Error message:", error.message);
          reject(error);
        });
    });
  }
  getProductsByCategoryName(categoryName: string): Promise<ProductType[]> {
    return new Promise((resolve: any, reject: any) => {
      console.log("Fetching products by category:", categoryName);
      axios
        .get(
          `${this.BASE_URL}/filterProductsByCategory?category=${categoryName}`
        )
        .then((response: AxiosResponse<any, any>) => {
          console.log(
            "CategoryService getProductsByCategoryName response:",
            response.data
          );
          resolve(response.data);
        })
        .catch((error: any) => {
          console.error(
            "CategoryService getProductsByCategoryName error:",
            error
          );
          reject(error);
        });
    });
  }
}

export default new CategoryService();
