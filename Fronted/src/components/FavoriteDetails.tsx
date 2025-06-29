import {
  Button,
  Drawer,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { setFavoriteDrawer } from "../redux/appSlice";
import { ProductType } from "../types/Types";
import { useEffect } from "react";
import { toast } from "react-toastify";

import {
  fetchUserFavorites,
  removeProductFromFavoritesAPI,
  clearFavoritesAPI,
} from "../redux/FavoriteSlice";
import { addProductToBasketAPI } from "../redux/basketSlice";

function FavoriteDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const { favoriteDrawer } = useSelector((state: RootState) => state.app);
  const { favorite, totalAmount, loading } = useSelector(
    (state: RootState) => state.favorite
  );

  // Fetch favorites when drawer opens
  useEffect(() => {
    if (favoriteDrawer) {
      try {
        dispatch(fetchUserFavorites());
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("Failed to load favorites. Please try again.");
      }
    }
  }, [favoriteDrawer, dispatch]);

  const closeFavoriteDrawer = () => {
    dispatch(setFavoriteDrawer(false));
  };

  const handleAddToBasket = (product: ProductType) => {
    try {
      dispatch(addProductToBasketAPI({ product, quantity: 1 }));
    } catch (error) {
      console.error("Error adding to basket:", error);
      toast.error("Failed to add to basket. Please try again.");
    }
  };

  const handleRemoveFromFavorites = (productId: number) => {
    try {
      const favoriteItem = favorite.find((item) => item.id === productId);
      if (favoriteItem && favoriteItem._id) {
        dispatch(removeProductFromFavoritesAPI(favoriteItem._id));
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast.error("Failed to remove from favorites. Please try again.");
    }
  };

  const handleClearFavorites = () => {
    if (favorite.length > 0) {
      try {
        dispatch(clearFavoritesAPI());
      } catch (error) {
        console.error("Error clearing favorites:", error);
        toast.error("Failed to clear favorites. Please try again.");
      }
    }
  };

  return (
    <div>
      <Drawer
        open={favoriteDrawer}
        onClose={closeFavoriteDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: "100%",
            maxWidth: 400,
            height: "auto",
            maxHeight: "80vh",
            margin: "0 auto",
            padding: 2,
            boxSizing: "border-box",
            overflowY: "auto",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h2">
            Your Favorites
          </Typography>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClearFavorites}
            disabled={loading || favorite.length === 0}
          >
            Clear All
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : favorite.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Your favorites list is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Add some products to your favorites!
            </Typography>
          </Box>
        ) : (
          <>
            {favorite.map((product: ProductType) => (
              <div
                style={{
                  padding: 15,
                  border: "2px solid #e0e0e0",
                  borderRadius: 8,
                  marginBottom: 15,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 15,
                  flexWrap: "wrap",
                  backgroundColor: "#fafafa",
                }}
                key={product.id}
              >
                <div style={{ flexShrink: 0 }}>
                  <img
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                    }}
                    src={product.image_url}
                    alt={product.title}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/80x80?text=No+Image";
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      marginBottom: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.title}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Price: <b>{product.price}₺</b>
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleAddToBasket(product)}
                      disabled={loading}
                    >
                      Add to Basket
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveFromFavorites(product.id)}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  </Box>
                </div>
              </div>
            ))}

            <Box
              sx={{
                borderTop: "2px solid #e0e0e0",
                pt: 2,
                mt: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h6">
                Total Value: <b>{totalAmount.toFixed(2)}₺</b>
              </Typography>
            </Box>
          </>
        )}
      </Drawer>
    </div>
  );
}

export default FavoriteDetails;
