import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/appSlice";
import { toast } from "react-toastify";
import ProductService from "../services/ProductService";
import { ProductType } from "../types/Types";
import Navbar from "../components/Navbar";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa";
import Button from "@mui/material/Button";
import "../css/ProductDeatil.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import { TextField, Box, Chip, Typography } from "@mui/material";
import { addProductToBasketAPI } from "../redux/basketSlice";
import {
  addProductToFavoritesAPI,
  removeProductFromFavoritesAPI,
} from "../redux/FavoriteSlice";
import { RootState, AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { FaPercent } from "react-icons/fa";

function ProductDetail() {
  const { productId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const currentUser = useSelector((state: RootState) => state.app.currentUser);
  const { loading: basketLoading } = useSelector(
    (state: RootState) => state.basket
  );
  const { favorite, loading: favoriteLoading } = useSelector(
    (state: RootState) => state.favorite
  );

  const [product, setProduct] = useState<ProductType | null>(null);
  const [count, setCount] = useState<number>(1);
  const [discountInfo, setDiscountInfo] = useState<any>(null);

  // Check if product is in favorites
  const isInFavorites = product
    ? favorite.some((item) => item.id === product.id)
    : false;

  const addBasket = () => {
    if (!currentUser) {
      toast.error("Please login to add items to basket");
      navigate("/login");
      return;
    }

    if (product) {
      dispatch(addProductToBasketAPI({ product: product, quantity: count }));
    }
  };

  const toggleFavorite = () => {
    if (!currentUser) {
      toast.error("Please login to add items to favorites");
      navigate("/login");
      return;
    }

    if (product) {
      if (isInFavorites) {
        const favoriteItem = favorite.find((item) => item.id === product.id);
        if (favoriteItem && favoriteItem._id) {
          dispatch(removeProductFromFavoritesAPI(favoriteItem._id));
          toast.success(`${product.title} removed from favorites`);
        }
      } else {
        dispatch(addProductToFavoritesAPI(product));
        toast.success(`${product.title} added to favorites`);
      }
    }
  };

  const plusCount = () => {
    setCount(count + 1);
  };

  const minusCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const getProductById = async (productId: number) => {
    try {
      dispatch(setLoading(true));
      const product: ProductType = await ProductService.getProductById(
        productId
      );
      setProduct(product);

      // Check if user came from discount section
      const savedDiscountInfo = localStorage.getItem("discountInfo");
      if (savedDiscountInfo) {
        const discountData = JSON.parse(savedDiscountInfo);
        if (discountData.isFromDiscountSection) {
          setDiscountInfo(discountData);
          // Clear the discount info after reading it
          localStorage.removeItem("discountInfo");
        }
      }
    } catch (error) {
      toast.error(`Product could not be displayed`);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getProductById(Number(productId));
  }, []);

  const displayPrice = discountInfo
    ? discountInfo.discountedPrice
    : product?.price;
  const originalPrice = discountInfo ? discountInfo.originalPrice : null;
  const discountPercentage = discountInfo
    ? discountInfo.discountPercentage
    : null;

  return (
    <div className="ProductDetail">
      <Navbar />
      <Container maxWidth="xl" sx={{ padding: "20px" }}>
        {product && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.02)",
              padding: "20px",
              borderRadius: "10px",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                flex: "1 1 400px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={product.image_url}
                alt={product.title}
                className="product-image"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x400?text=No+Image";
                }}
              />
            </div>

            <div
              style={{
                flex: "1 1 400px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <h1>{product.title}</h1>
              <p>{product.description}</p>

              {currentUser && (
                <div style={{ margin: "5px" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    onClick={() => minusCount()}
                    disabled={count <= 1}
                  >
                    <FaMinus style={{ fontSize: "20px", height: "46px" }} />
                  </Button>
                  <TextField
                    id="Count"
                    label={count}
                    variant="outlined"
                    sx={{
                      width: "50px",
                      margin: "0 5px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#000000",
                        },
                        "&:hover fieldset": {
                          borderColor: "#333333",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#111111",
                        },
                      },
                    }}
                    InputLabelProps={{
                      style: { color: "#000000" },
                    }}
                    InputProps={{
                      style: { color: "#000000" },
                    }}
                  />

                  <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    onClick={() => plusCount()}
                  >
                    <FaPlus style={{ fontSize: "20px", height: "46px" }} />
                  </Button>
                </div>
              )}

              {/* Price Display */}
              <Box sx={{ margin: "20px 0", textAlign: "center" }}>
                {discountInfo ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Chip
                      icon={<FaPercent />}
                      label={`${discountPercentage}% OFF`}
                      sx={{
                        backgroundColor: "#d32f2f",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        height: "28px",
                        "& .MuiChip-icon": {
                          color: "white",
                          fontSize: "1rem",
                        },
                      }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          color: "#666",
                          textDecoration: "line-through",
                          fontWeight: "normal",
                          textDecorationThickness: "2px",
                          textDecorationColor: "#d32f2f",
                        }}
                      >
                        {originalPrice}₺
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          color: "#d32f2f",
                          fontWeight: "bold",
                        }}
                      >
                        {displayPrice.toFixed(0)}₺
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#d32f2f",
                        fontWeight: "bold",
                        backgroundColor: "rgba(211, 47, 47, 0.1)",
                        padding: "4px 12px",
                        borderRadius: "16px",
                      }}
                    >
                      {discountPercentage}% İndirim Kazancı
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    {product.price}₺
                  </Typography>
                )}
              </Box>

              {currentUser ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    onClick={addBasket}
                    disabled={basketLoading}
                  >
                    <FaCartPlus style={{ fontSize: "20px" }} />
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color={isInFavorites ? "error" : "inherit"}
                    onClick={toggleFavorite}
                    disabled={favoriteLoading}
                  >
                    {isInFavorites ? (
                      <MdFavorite
                        style={{ fontSize: "20px", color: "#e91e63" }}
                      />
                    ) : (
                      <MdFavoriteBorder style={{ fontSize: "20px" }} />
                    )}
                  </Button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/login")}
                    sx={{ minWidth: "200px" }}
                  >
                    Login to Purchase
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate("/register")}
                    sx={{ minWidth: "200px" }}
                  >
                    Create Account
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default ProductDetail;
