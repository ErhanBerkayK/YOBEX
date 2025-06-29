import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductType, UserType } from "../types/Types";
import {
  setCurrenUser,
  setLoading,
  setProducts,
  setDiscountProducts,
} from "../redux/appSlice";
import ProductService from "../services/ProductService";
import { toast } from "react-toastify";
import { RootState } from "../redux/store";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Category from "../components/Category";
import DiscountProductCard from "../components/DiscountProductCard";
import { Box, Typography } from "@mui/material";

function HomePage() {
  const dispatch = useDispatch();
  const { products, discountProducts } = useSelector(
    (state: RootState) => state.app
  );

  const getAllProducts = async () => {
    try {
      dispatch(setLoading(true));
      const response: ProductType[] = await ProductService.getAllProducts();
      if (response) {
        dispatch(setProducts(response));
      }
    } catch (error) {
      toast.error("Failed to fetch products. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getDiscountProducts = async () => {
    try {
      dispatch(setLoading(true));
      const response: ProductType[] = await ProductService.getAllProducts();
      if (response) {
        const min = 5;
        const max = Math.min(20, response.length - 4);
        const startIndex = Math.floor(Math.random() * (max - min + 1)) + min;

        const selectedProducts = response.slice(startIndex, startIndex + 4);

        const discountedProducts = selectedProducts.map((product) => ({
          ...product,
          isDiscounted: true,
          discountRate: Math.floor(Math.random() * 31) + 10,
        }));

        dispatch(setDiscountProducts(discountedProducts));
      }
    } catch (error) {
      toast.error("Failed to fetch discounted products. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const result = localStorage.getItem("currentUser");
    if (result) {
      const currentUser: UserType = JSON.parse(result);
      dispatch(setCurrenUser(currentUser));
    }
  }, []);

  useEffect(() => {
    getAllProducts();
    getDiscountProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <Category />

      {/* Discount Products Section */}
      <Box sx={{ margin: "20px 0" }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            textAlign: "center",
            color: "#ff6b35",
            fontWeight: "bold",
            marginBottom: "20px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          🔥 Special Offers
        </Typography>

        {discountProducts.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              padding: "0 20px",
              overflowX: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#ff6b35 #f5f5f5",
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f5f5f5",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#ff6b35",
                borderRadius: "4px",
                "&:hover": {
                  background: "#e65100",
                },
              },
            }}
          >
            {discountProducts.map((product: ProductType, index: number) => (
              <Box
                key={`discount-${index}`}
                sx={{
                  flexShrink: 0,
                  minWidth: "280px",
                }}
              >
                <DiscountProductCard product={product} />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* All Products Section */}
      <Box sx={{ margin: "40px 0" }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            textAlign: "center",
            color: "#333",
            fontWeight: "bold",
            marginBottom: "30px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          All Products
        </Typography>

        <div
          className="home"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            padding: "20px",
            gap: "20px",
          }}
        >
          {products &&
            products.map((product: ProductType, index: number) => (
              <ProductCard key={`product-${index}`} product={product} />
            ))}
        </div>
      </Box>
    </div>
  );
}

export default HomePage;
