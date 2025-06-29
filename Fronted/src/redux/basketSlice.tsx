import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { BasketSliceType, ProductType } from "../types/Types";
import BasketService, {
  CartResponseType,
  CartItemType,
} from "../services/BasketService";
import { toast } from "react-toastify";

// Async thunks for API operations
export const fetchUserBasket = createAsyncThunk(
  "basket/fetchUserBasket",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BasketService.getUserBasket();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const addProductToBasketAPI = createAsyncThunk(
  "basket/addProductToBasketAPI",
  async (
    { product, quantity }: { product: ProductType; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await BasketService.addToBasket(product, quantity);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product to cart"
      );
    }
  }
);

export const updateBasketItemAPI = createAsyncThunk(
  "basket/updateBasketItemAPI",
  async (
    { itemId, quantity }: { itemId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await BasketService.updateBasketItem(itemId, quantity);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart item"
      );
    }
  }
);

export const removeProductFromBasketAPI = createAsyncThunk(
  "basket/removeProductFromBasketAPI",
  async (itemId: string, { rejectWithValue }) => {
    try {
      const response = await BasketService.removeFromBasket(itemId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove product from cart"
      );
    }
  }
);

export const clearBasketAPI = createAsyncThunk(
  "basket/clearBasketAPI",
  async (_, { rejectWithValue }) => {
    try {
      await BasketService.clearBasket();
      return null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

const initialState: BasketSliceType = {
  basket: [],
  totalAmount: 0,
  loading: false,
  error: null,
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setBasket: (state, action: PayloadAction<ProductType[]>) => {
      state.basket = action.payload;
      localStorage.setItem("basket", JSON.stringify(state.basket));
    },
    clearBasket: (state) => {
      state.basket = [];
      state.totalAmount = 0;
      localStorage.removeItem("basket");
    },
    calculateBasket: (state) => {
      state.totalAmount = state.basket.reduce((total, product) => {
        return total + product.price * (product.count || 0);
      }, 0);
    },
    addProductToBasket: (state, action: PayloadAction<ProductType>) => {
      const existing = state.basket.find(
        (item) => item.id === action.payload.id
      );

      if (existing) {
        existing.count = (existing.count || 0) + (action.payload.count || 0);

        if (existing.count <= 0) {
          state.basket = state.basket.filter((item) => item.id !== existing.id);
        }
      } else {
        state.basket.push({ ...action.payload });
      }

      localStorage.setItem("basket", JSON.stringify(state.basket));
    },
    removeProductFromBasket: (state, action: PayloadAction<number>) => {
      state.basket = state.basket.filter(
        (product) => product.id !== action.payload
      );
      localStorage.setItem("basket", JSON.stringify(state.basket));
    },
    minusCart: (state, action: PayloadAction<number>) => {
      const product = state.basket.find((item) => item.id === action.payload);
      if (product && product.count > 1) {
        product.count -= 1;
        localStorage.setItem("basket", JSON.stringify(state.basket));
      }
    },
    plusCart: (state, action: PayloadAction<number>) => {
      const product = state.basket.find((item) => item.id === action.payload);
      if (product) {
        product.count += 1;
        localStorage.setItem("basket", JSON.stringify(state.basket));
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user basket
    builder
      .addCase(fetchUserBasket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserBasket.fulfilled,
        (state, action: PayloadAction<CartResponseType>) => {
          state.loading = false;
          // Convert cart items to ProductType format for compatibility
          state.basket = action.payload.items.map(
            (item) =>
              ({
                id: parseInt(item.id),
                title: item.title,
                price: item.price,
                description: item.description,
                category: item.category,
                count: item.quantity,
                image_url: "", // Cart items don't have image_url, we'll need to handle this
                rating: { rate: 0, count: 0 }, // Default rating
                _id: item._id, // Store MongoDB ObjectId for API operations
              } as ProductType & { _id?: string })
          );

          // Calculate total amount
          state.totalAmount = action.payload.items.reduce((total, item) => {
            return total + item.price * item.quantity;
          }, 0);
        }
      )
      .addCase(fetchUserBasket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // Add product to basket
    builder
      .addCase(addProductToBasketAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addProductToBasketAPI.fulfilled,
        (state, action: PayloadAction<CartResponseType>) => {
          state.loading = false;
          state.basket = action.payload.items.map(
            (item) =>
              ({
                id: parseInt(item.id),
                title: item.title,
                price: item.price,
                description: item.description,
                category: item.category,
                count: item.quantity,
                image_url: "", // Cart items don't have image_url
                rating: { rate: 0, count: 0 },
                _id: item._id, // Store MongoDB ObjectId for API operations
              } as ProductType & { _id?: string })
          );

          state.totalAmount = action.payload.items.reduce((total, item) => {
            return total + item.price * item.quantity;
          }, 0);

          toast.success("Product added to cart successfully!");
        }
      )
      .addCase(addProductToBasketAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // Update basket item
    builder
      .addCase(updateBasketItemAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateBasketItemAPI.fulfilled,
        (state, action: PayloadAction<CartResponseType>) => {
          state.loading = false;
          state.basket = action.payload.items.map(
            (item) =>
              ({
                id: parseInt(item.id),
                title: item.title,
                price: item.price,
                description: item.description,
                category: item.category,
                count: item.quantity,
                image_url: "",
                rating: { rate: 0, count: 0 },
                _id: item._id, // Store MongoDB ObjectId for API operations
              } as ProductType & { _id?: string })
          );

          state.totalAmount = action.payload.items.reduce((total, item) => {
            return total + item.price * item.quantity;
          }, 0);
        }
      )
      .addCase(updateBasketItemAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // Remove product from basket
    builder
      .addCase(removeProductFromBasketAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeProductFromBasketAPI.fulfilled,
        (state, action: PayloadAction<CartResponseType>) => {
          state.loading = false;
          state.basket = action.payload.items.map(
            (item) =>
              ({
                id: parseInt(item.id),
                title: item.title,
                price: item.price,
                description: item.description,
                category: item.category,
                count: item.quantity,
                image_url: "",
                rating: { rate: 0, count: 0 },
                _id: item._id, // Store MongoDB ObjectId for API operations
              } as ProductType & { _id?: string })
          );

          state.totalAmount = action.payload.items.reduce((total, item) => {
            return total + item.price * item.quantity;
          }, 0);

          toast.success("Product removed from cart successfully!");
        }
      )
      .addCase(removeProductFromBasketAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // Clear basket
    builder
      .addCase(clearBasketAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearBasketAPI.fulfilled, (state) => {
        state.loading = false;
        state.basket = [];
        state.totalAmount = 0;
        toast.success("Cart cleared successfully!");
      })
      .addCase(clearBasketAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const {
  setBasket,
  clearBasket,
  calculateBasket,
  addProductToBasket,
  removeProductFromBasket,
  minusCart,
  plusCart,
  clearError,
} = basketSlice.actions;

export default basketSlice.reducer;
