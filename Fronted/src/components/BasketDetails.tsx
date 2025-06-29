import {
  Button,
  Drawer,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { setBasketDrawer } from "../redux/appSlice";
import { ProductType } from "../types/Types";
import { useEffect } from "react";
import {
  removeProductFromBasketAPI,
  updateBasketItemAPI,
  clearBasketAPI,
  fetchUserBasket,
} from "../redux/basketSlice";
import { toast } from "react-toastify";
import PurchaseService, {
  PurchaseRequestType,
} from "../services/PurchaseService";

function BasketDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const { basketDrawer } = useSelector((state: RootState) => state.app);
  const { basket, totalAmount, loading } = useSelector(
    (state: RootState) => state.basket
  );

  // Fetch basket when drawer opens
  useEffect(() => {
    if (basketDrawer) {
      try {
        dispatch(fetchUserBasket());
      } catch (error) {
        console.error("Error fetching basket:", error);
        toast.error("Failed to load basket. Please try again.");
      }
    }
  }, [basketDrawer, dispatch]);

  // Listen for balance updates
  useEffect(() => {
    const handleBalanceUpdate = () => {
      // Force re-render to update balance display
      window.location.reload();
    };

    window.addEventListener("balanceUpdated", handleBalanceUpdate);

    return () => {
      window.removeEventListener("balanceUpdated", handleBalanceUpdate);
    };
  }, []);

  // Get current balance
  const getCurrentBalance = (): number => {
    try {
      const user = localStorage.getItem("user");
      const currentUser = localStorage.getItem("currentUser");

      if (user) {
        const userData = JSON.parse(user);
        return userData.balance || 0;
      }

      if (currentUser) {
        const userData = JSON.parse(currentUser);
        return userData.balance || 0;
      }

      return 0;
    } catch (error) {
      console.error("Error getting balance:", error);
      return 0;
    }
  };

  const currentBalance = getCurrentBalance();
  const hasSufficientBalance = currentBalance >= totalAmount;

  const buy = async () => {
    if (basket.length === 0) {
      toast.error("Your basket is empty!");
      return;
    }

    try {
      // Get current user
      const user = localStorage.getItem("user");
      const currentUser = localStorage.getItem("currentUser");

      let userData = null;
      if (user) {
        userData = JSON.parse(user);
      } else if (currentUser) {
        userData = JSON.parse(currentUser);
      }

      if (!userData) {
        toast.error("User not found. Please login again.");
        return;
      }

      const userId = userData.id || userData.userId;
      const currentBalance = userData.balance || 0;

      // Check if user has sufficient balance
      if (currentBalance < totalAmount) {
        toast.error(
          `Insufficient balance! You have $${currentBalance.toFixed(
            2
          )} but need $${totalAmount.toFixed(2)}`
        );
        return;
      }

      // Prepare purchase data
      const purchaseData: PurchaseRequestType = {
        userId: userId,
        totalAmount: totalAmount,
        items: basket.map((item) => ({
          productId: item.id.toString(),
          title: item.title,
          price: item.price,
          quantity: item.count || 1,
        })),
      };

      // Process purchase
      const result = await PurchaseService.processPurchase(purchaseData);

      if (result.success) {
        // Update user balance in localStorage
        userData.balance = result.newBalance;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("currentUser", JSON.stringify(userData));

        // Clear basket
        dispatch(clearBasketAPI());
        dispatch(setBasketDrawer(false));

        // Show success message
        toast.success(
          `Purchase successful! New balance: $${result.newBalance.toFixed(2)}`
        );

        // Dispatch custom event to notify other components about balance update
        window.dispatchEvent(
          new CustomEvent("balanceUpdated", {
            detail: { newBalance: result.newBalance },
          })
        );
      }
    } catch (error: any) {
      console.error("Error processing purchase:", error);
      toast.error(
        error.message || "Failed to process purchase. Please try again."
      );
    }
  };

  const closeBasketDrawer = () => {
    dispatch(setBasketDrawer(false));
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove product if quantity is 0 or less
      const basketItem = basket.find((item) => item.id === productId);
      if (basketItem && basketItem._id) {
        dispatch(removeProductFromBasketAPI(basketItem._id));
      }
    } else {
      // Update quantity
      const basketItem = basket.find((item) => item.id === productId);
      if (basketItem && basketItem._id) {
        dispatch(
          updateBasketItemAPI({
            itemId: basketItem._id,
            quantity: newQuantity,
          })
        );
      }
    }
  };

  const handleRemoveProduct = (productId: number) => {
    const basketItem = basket.find((item) => item.id === productId);
    if (basketItem && basketItem._id) {
      dispatch(removeProductFromBasketAPI(basketItem._id));
    }
  };

  const handleClearBasket = () => {
    if (basket.length > 0) {
      dispatch(clearBasketAPI());
    }
  };

  return (
    <div>
      <Drawer
        open={basketDrawer}
        onClose={closeBasketDrawer}
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
            Your Basket
          </Typography>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClearBasket}
            disabled={loading || basket.length === 0}
          >
            Clear All
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : basket.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Your basket is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Add some products to get started!
            </Typography>
          </Box>
        ) : (
          <>
            {basket.map((product: ProductType) => (
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

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: "32px", width: "32px", height: "32px" }}
                      onClick={() =>
                        handleQuantityChange(
                          product.id,
                          (product.count || 1) - 1
                        )
                      }
                      disabled={loading}
                    >
                      -
                    </Button>
                    <Typography
                      variant="body2"
                      sx={{ minWidth: "40px", textAlign: "center" }}
                    >
                      {product.count || 1}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: "32px", width: "32px", height: "32px" }}
                      onClick={() =>
                        handleQuantityChange(
                          product.id,
                          (product.count || 1) + 1
                        )
                      }
                      disabled={loading}
                    >
                      +
                    </Button>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Price: <b>{product.price}₺</b>
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Total:{" "}
                    <b>
                      {(product.price * (Number(product.count) || 1)).toFixed(
                        2
                      )}
                      ₺
                    </b>
                  </Typography>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveProduct(product.id)}
                    disabled={loading}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <Box
              sx={{
                borderTop: "2px solid #e0e0e0",
                pt: 2,
                mt: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* User Balance Display */}
              <Box sx={{ textAlign: "center", mb: 1 }}>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Your Balance: <b>${currentBalance.toFixed(2)}</b>
                </Typography>
                {!hasSufficientBalance && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    Insufficient balance! Need $
                    {(totalAmount - currentBalance).toFixed(2)} more
                  </Typography>
                )}
              </Box>

              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Total Amount: <b>{totalAmount.toFixed(2)}₺</b>
              </Typography>

              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={buy}
                disabled={
                  loading || basket.length === 0 || !hasSufficientBalance
                }
              >
                {loading ? <CircularProgress size={24} /> : "Buy Now"}
              </Button>
            </Box>
          </>
        )}
      </Drawer>
    </div>
  );
}

export default BasketDetails;
