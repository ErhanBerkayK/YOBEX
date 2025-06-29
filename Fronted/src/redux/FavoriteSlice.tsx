import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { FavoriteSliceType, ProductType } from "../types/Types";
import FavoriteService, {
  FavoriteResponseType,
  FavoriteItemType,
} from "../services/FavoriteService";
import { toast } from "react-toastify";

// Helper function to get userId from localStorage
const getUserId = (): string => {
  const user = localStorage.getItem("user");
  const currentUser = localStorage.getItem("currentUser");

  if (user) {
    const userData = JSON.parse(user);
    return userData.id || userData.email || "";
  }

  if (currentUser) {
    const userData = JSON.parse(currentUser);
    return userData.id || userData.email || "";
  }

  return "";
};

// Helper function to check if user has token
const hasToken = (): boolean => {
  return !!localStorage.getItem("token");
};

// Helper function to get favorites from localStorage
const getLocalFavorites = (): ProductType[] => {
  try {
    const userId = getUserId();
    if (!userId) return [];

    const favorites = localStorage.getItem(`favorites_${userId}`);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error getting local favorites:", error);
    return [];
  }
};

// Async thunks for API operations
export const fetchUserFavorites = createAsyncThunk(
  "favorite/fetchUserFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      if (!hasToken()) {
        console.warn("No token found, returning empty favorites");
        return { userId, items: [] };
      }

      const response = await FavoriteService.getUserFavorites(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch favorites"
      );
    }
  }
);

export const addProductToFavoritesAPI = createAsyncThunk(
  "favorite/addProductToFavoritesAPI",
  async (product: ProductType, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      if (!hasToken()) {
        throw new Error("Authentication required. Please login first.");
      }

      const response = await FavoriteService.addToFavorites(userId, product);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to add product to favorites"
      );
    }
  }
);

export const removeProductFromFavoritesAPI = createAsyncThunk(
  "favorite/removeProductFromFavoritesAPI",
  async (itemId: string, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      if (!hasToken()) {
        throw new Error("Authentication required. Please login first.");
      }

      const response = await FavoriteService.removeFromFavorites(
        itemId,
        userId
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to remove product from favorites"
      );
    }
  }
);

export const clearFavoritesAPI = createAsyncThunk(
  "favorite/clearFavoritesAPI",
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      if (!hasToken()) {
        throw new Error("Authentication required. Please login first.");
      }

      await FavoriteService.clearFavorites(userId);
      return null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to clear favorites"
      );
    }
  }
);

const initialState: FavoriteSliceType = {
  favorite: getLocalFavorites(),
  totalAmount: getLocalFavorites().reduce(
    (total, item) => total + item.price,
    0
  ),
  loading: false,
  error: null,
};

const FavoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    setFavorite: (state: FavoriteSliceType, action: PayloadAction<any>) => {
      state.favorite = action.payload;
    },
    clearFavorite: (state) => {
      state.favorite = [];
    },
    calculateFavorite: (state: FavoriteSliceType) => {
      let totalAmount: number = 0;
      state.favorite &&
        state.favorite.map((product: ProductType) => {
          if (product.count) {
            totalAmount += product.price * product.count;
          }
        });
      state.totalAmount = totalAmount;
    },
    addProductToFavorite: (
      state: FavoriteSliceType,
      action: PayloadAction<any>
    ) => {
      if (state.favorite.length == 0) {
        state.favorite.push(action.payload);
      } else {
        const findProduct = state.favorite.find(
          (item) => item.id === action.payload.id
        );
        if (findProduct) {
          if (findProduct.count && action.payload.count) {
            findProduct.count = findProduct.count + action.payload.count;

            state.favorite = state.favorite.map((product: ProductType) => {
              return product.id === findProduct.id ? findProduct : product;
            });
          }
        } else {
          state.favorite.push(action.payload);
        }
      }
      localStorage.setItem("favorite", JSON.stringify(state.favorite));
    },
    removeProductFromFavorite: (
      state: FavoriteSliceType,
      action: PayloadAction<number>
    ) => {
      state.favorite = [
        ...state.favorite.filter(
          (product: ProductType) => product.id !== action.payload
        ),
      ];
      localStorage.setItem("favorite", JSON.stringify(state.favorite));
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user favorites
    builder
      .addCase(fetchUserFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserFavorites.fulfilled,
        (state, action: PayloadAction<FavoriteResponseType>) => {
          state.loading = false;
          // Convert favorite items to ProductType format for compatibility
          state.favorite = action.payload.items.map(
            (item) =>
              ({
                id: parseInt(item.id),
                title: item.title,
                price: item.price,
                description: item.description,
                category: item.category,
                count: 1, // Favorites don't have quantity
                image_url: item.image_url,
                rating: item.rating,
                _id: item._id, // Store MongoDB ObjectId for API operations
              } as ProductType & { _id?: string })
          );

          // Calculate total amount
          state.totalAmount = action.payload.items.reduce((total, item) => {
            return total + item.price;
          }, 0);
        }
      )
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // Add product to favorites
    builder
      .addCase(addProductToFavoritesAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addProductToFavoritesAPI.fulfilled,
        (state, action: PayloadAction<FavoriteResponseType>) => {
          state.loading = false;
          state.favorite = action.payload.items.map(
            (item) =>
              ({
                id: parseInt(item.id),
                title: item.title,
                price: item.price,
                description: item.description,
                category: item.category,
                count: 1,
                image_url: item.image_url,
                rating: item.rating,
                _id: item._id,
              } as ProductType & { _id?: string })
          );

          state.totalAmount = action.payload.items.reduce((total, item) => {
            return total + item.price;
          }, 0);

          toast.success("Product added to favorites successfully!");
        }
      )
      .addCase(addProductToFavoritesAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // Remove product from favorites
    builder
      .addCase(removeProductFromFavoritesAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeProductFromFavoritesAPI.fulfilled,
        (state, action: PayloadAction<FavoriteResponseType>) => {
          state.loading = false;
          state.favorite = action.payload.items.map(
            (item) =>
              ({
                id: parseInt(item.id),
                title: item.title,
                price: item.price,
                description: item.description,
                category: item.category,
                count: 1,
                image_url: item.image_url,
                rating: item.rating,
                _id: item._id,
              } as ProductType & { _id?: string })
          );

          state.totalAmount = action.payload.items.reduce((total, item) => {
            return total + item.price;
          }, 0);

          toast.success("Product removed from favorites successfully!");
        }
      )
      .addCase(removeProductFromFavoritesAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });

    // Clear favorites
    builder
      .addCase(clearFavoritesAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearFavoritesAPI.fulfilled, (state) => {
        state.loading = false;
        state.favorite = [];
        state.totalAmount = 0;
        toast.success("Favorites cleared successfully!");
      })
      .addCase(clearFavoritesAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const {
  setFavorite,
  clearFavorite,
  calculateFavorite,
  addProductToFavorite,
  removeProductFromFavorite,
  clearError,
} = FavoriteSlice.actions;
export default FavoriteSlice.reducer;
