import { Button, Box, Typography, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading, setProducts } from "../redux/appSlice";
import CategoryService from "../services/CategoryService";
import { toast } from "react-toastify";
import { ProductType } from "../types/Types";
import ProductService from "../services/ProductService";
import Sort from "./Sort";

function Category() {
  const dispatch = useDispatch();

  const [categories, setCategories] = useState<string[]>([]);

  const getAllCategories = async () => {
    try {
      dispatch(setLoading(true));
      const categories: string[] = await CategoryService.getAllCategories();
      setCategories(categories);
    } catch (error) {
      toast.error("Failed to fetch categories. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleCategory = async (category: string) => {
    try {
      dispatch(setLoading(true));
      if (category !== null) {
        const products: ProductType[] =
          await CategoryService.getProductsByCategoryName(category);
        dispatch(setProducts(products));
      } else {
        const products: ProductType[] = await ProductService.getAllProducts();
        dispatch(setProducts(products));
      }
    } catch (error) {
      toast.error("Failed to fetch products. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Box
      className="category-section"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 30px",
        gap: "16px",
        margin: "20px auto",
        maxWidth: "1200px",
        borderRadius: "16px",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        position: "relative",
        zIndex: 1,
        "&:hover": {
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          width: "100%",
          textAlign: "center",
          marginBottom: "8px",
          fontWeight: "600",
          color: "inherit",
        }}
      >
        Kategoriler
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          width: "100%",
        }}
      >
        {categories.map((category, index) => (
          <Button
            key={index}
            sx={{
              flex: "0 1 auto",
              minWidth: "120px",
              maxWidth: "200px",
              backgroundColor: "rgba(255, 107, 53, 0.1)",
              color: "#ff6b35",
              border: "2px solid rgba(255, 107, 53, 0.2)",
              borderRadius: "12px",
              padding: "8px 16px",
              fontSize: "0.9rem",
              fontWeight: "600",
              textTransform: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 107, 53, 0.2)",
                borderColor: "#ff6b35",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
            variant="outlined"
            onClick={() => handleCategory(category)}
          >
            {category}
          </Button>
        ))}
      </Box>

      <Divider
        sx={{
          width: "100%",
          margin: "8px 0",
          borderColor: "rgba(255, 107, 53, 0.2)",
          opacity: 0.6,
        }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: "500",
            color: "inherit",
            opacity: 0.8,
          }}
        >
          Sırala:
        </Typography>
        <Sort />
      </Box>
    </Box>
  );
}

export default Category;
