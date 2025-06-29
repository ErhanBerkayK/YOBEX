import { ProductCardProps } from "../types/Types";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Box, Chip } from "@mui/material";
import { FaPercent } from "react-icons/fa";

function DiscountProductCard(props: ProductCardProps) {
  const { id, title, price, description, image_url } = props.product;
  const navigate = useNavigate();

  // Calculate discount percentage (assuming 20% discount as per original code)
  const discountPercentage = 20;
  const discountedPrice = (price * (100 - discountPercentage)) / 100;

  const handleDetailClick = () => {
    // Add discount information to localStorage so ProductDetail can access it
    const discountInfo = {
      originalPrice: price,
      discountedPrice: discountedPrice,
      discountPercentage: discountPercentage,
      isFromDiscountSection: true,
    };
    localStorage.setItem("discountInfo", JSON.stringify(discountInfo));
    navigate(`/product-detail/` + id);
  };

  return (
    <Card
      sx={{
        width: 280,
        height: 420,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "12px",
        background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
        border: "2px solid #e65100",
        borderRadius: "16px",
        boxShadow: "0 8px 25px rgba(255, 107, 53, 0.3)",
        transition: "all 0.3s ease-in-out",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 35px rgba(255, 107, 53, 0.4)",
        },
      }}
    >
      {/* Discount Badge */}
      <Box
        sx={{
          position: "absolute",
          top: "8px",
          right: "8px",
          zIndex: 2,
        }}
      >
        <Chip
          icon={<FaPercent />}
          label={`${discountPercentage}% OFF`}
          sx={{
            backgroundColor: "#d32f2f",
            color: "white",
            fontWeight: "bold",
            fontSize: "0.75rem",
            height: "24px",
            "& .MuiChip-icon": {
              color: "white",
              fontSize: "0.8rem",
            },
          }}
        />
      </Box>

      {/* Product Image */}
      <Box
        sx={{
          width: "100%",
          height: "180px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "12px",
          position: "relative",
        }}
      >
        <img
          src={image_url}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "12px",
            border: "2px solid rgba(255, 255, 255, 0.3)",
          }}
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/200x180?text=No+Image";
          }}
        />
      </Box>

      {/* Product Content */}
      <CardContent
        sx={{
          flex: 1,
          width: "100%",
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "white",
              fontSize: "1rem",
              lineHeight: 1.3,
              marginBottom: "8px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.8rem",
              lineHeight: 1.4,
              marginBottom: "12px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description}
          </Typography>
        </Box>

        {/* Price Section */}
        <Box sx={{ textAlign: "center", marginTop: "auto" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              marginBottom: "8px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                textDecoration: "line-through",
                fontSize: "1rem",
                fontWeight: "bold",
                textDecorationThickness: "2px",
                textDecorationColor: "#d32f2f",
              }}
            >
              {price}₺
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "1.4rem",
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              {discountedPrice.toFixed(0)}₺
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "#d32f2f",
              fontWeight: "bold",
              fontSize: "0.9rem",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "2px 8px",
              borderRadius: "12px",
              display: "inline-block",
            }}
          >
            {discountPercentage}% İndirim
          </Typography>
        </Box>
      </CardContent>

      {/* Action Button */}
      <CardActions sx={{ padding: "8px 16px 16px", width: "100%" }}>
        <Button
          variant="contained"
          size="small"
          fullWidth
          onClick={handleDetailClick}
          sx={{
            backgroundColor: "white",
            color: "#ff6b35",
            fontWeight: "bold",
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "0.9rem",
            padding: "8px 16px",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              transform: "scale(1.02)",
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default DiscountProductCard;
