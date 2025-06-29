import { ProductCardProps } from "../types/Types";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { addProductToBasketAPI } from "../redux/basketSlice";
import {
  addProductToFavoritesAPI,
  removeProductFromFavoritesAPI,
} from "../redux/FavoriteSlice";
import { toast } from "react-toastify";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

function ProductCard(props: ProductCardProps) {
  const { id, title, price, description, image_url } = props.product;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.app);
  const { loading: basketLoading } = useSelector(
    (state: RootState) => state.basket
  );
  const { favorite, loading: favoriteLoading } = useSelector(
    (state: RootState) => state.favorite
  );

  // Check if user has token for favorites functionality
  const hasToken = !!localStorage.getItem("token");

  // Check if product is in favorites
  const isInFavorites = favorite.some((item) => item.id === id);

  const handleAddToBasket = () => {
    if (!currentUser) {
      toast.error("Please login to add products to basket!");
      return;
    }

    dispatch(addProductToBasketAPI({ product: props.product, quantity: 1 }));
  };

  const handleToggleFavorite = () => {
    if (!currentUser) {
      toast.error("Please login to add products to favorites!");
      return;
    }

    if (!hasToken) {
      toast.error("Authentication required. Please login first.");
      return;
    }

    try {
      if (isInFavorites) {
        const favoriteItem = favorite.find((item) => item.id === id);
        if (favoriteItem && favoriteItem._id) {
          dispatch(removeProductFromFavoritesAPI(favoriteItem._id));
        }
      } else {
        dispatch(addProductToFavoritesAPI(props.product));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites. Please try again.");
    }
  };

  return (
    <Card
      sx={{
        width: 330,
        height: 580,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "20px",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
        },
        position: "relative",
      }}
    >
      {/* Favorite Button */}
      {currentUser && hasToken && (
        <IconButton
          onClick={handleToggleFavorite}
          disabled={favoriteLoading}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
            },
            zIndex: 1,
          }}
        >
          {isInFavorites ? (
            <MdFavorite style={{ color: "#e91e63", fontSize: "24px" }} />
          ) : (
            <MdFavoriteBorder style={{ color: "#666", fontSize: "24px" }} />
          )}
        </IconButton>
      )}

      <img
        src={image_url}
        alt={title}
        height={230}
        width={230}
        style={{ objectFit: "cover", borderRadius: "8px 8px 0 0" }}
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/230x230?text=No+Image";
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" sx={{ fontWeight: "600" }}>
          {title.substring(0, 50)}...
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description.substring(0, 200)}...
        </Typography>
        <hr style={{ width: "100%", margin: "10px 0" }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mt: 1, color: "#ff6b35" }}
        >
          {price} ₺
        </Typography>
      </CardContent>
      <CardActions
        sx={{ display: "flex", justifyContent: "center", gap: 1, pb: 2 }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={() => navigate(`/product-detail/` + id)}
          sx={{
            borderColor: "#ff6b35",
            color: "#ff6b35",
            "&:hover": {
              borderColor: "#e65100",
              backgroundColor: "rgba(255, 107, 53, 0.1)",
            },
          }}
        >
          Detail
        </Button>
        {currentUser && (
          <Button
            size="small"
            variant="contained"
            onClick={handleAddToBasket}
            disabled={basketLoading}
            sx={{
              backgroundColor: "#ff6b35",
              "&:hover": {
                backgroundColor: "#e65100",
              },
              "&:disabled": {
                backgroundColor: "#ccc",
              },
            }}
          >
            Add to Basket
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default ProductCard;
