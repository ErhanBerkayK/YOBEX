import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppSliceType, ProductType, UserType } from "../types/Types";

const initialState: AppSliceType = {
  currentUser: null,
  loading: false,
  basketDrawer: false,
  favoriteDrawer: false,
  products: [],
  discountProducts: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state: AppSliceType, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCurrenUser: (
      state: AppSliceType,
      action: PayloadAction<UserType | null>
    ) => {
      state.currentUser = action.payload;
    },
    setBasketDrawer: (state: AppSliceType, action: PayloadAction<boolean>) => {
      state.basketDrawer = action.payload;
    },
    setFavoriteDrawer: (
      state: AppSliceType,
      action: PayloadAction<boolean>
    ) => {
      state.favoriteDrawer = action.payload;
    },
    setProducts: (state: AppSliceType, action: PayloadAction<any>) => {
      state.products = action.payload;
    },
    setDiscountProducts: (state, action) => {
      state.discountProducts = action.payload;
    },

    filterProducts: (state: AppSliceType, action: PayloadAction<string>) => {
      const tempList: ProductType[] = [];
      state.products.map((product: ProductType) => {
        if (
          product.title.toLowerCase().includes(action.payload.toLowerCase())
        ) {
          tempList.push(product);
        }
        state.products = [...tempList];
      });
    },
    sortProducts: (state: AppSliceType, action: PayloadAction<string>) => {
      if (action.payload === "asc") {
        const tempList: ProductType[] = [...state.products];

        tempList.sort((a, b) =>
          a.title.toLowerCase().localeCompare(b.title.toLowerCase())
        );

        state.products = tempList;
      }
    },
    sortProductsDesc: (state: AppSliceType, action: PayloadAction<string>) => {
      if (action.payload === "desc") {
        const tempList: ProductType[] = [...state.products];

        tempList.sort((a, b) =>
          b.title.toLowerCase().localeCompare(a.title.toLowerCase())
        );

        state.products = tempList;
      }
    },
    sortProductsForPriceDesc: (
      state: AppSliceType,
      action: PayloadAction<string>
    ) => {
      if (action.payload === "desc") {
        const tempList: ProductType[] = [...state.products];

        tempList.sort((a, b) => b.price - a.price);

        state.products = tempList;
      }
    },
    sortProductsForPrice: (
      state: AppSliceType,
      action: PayloadAction<string>
    ) => {
      if (action.payload === "asc") {
        const tempList: ProductType[] = [...state.products];

        tempList.sort((a, b) => a.price - b.price);

        state.products = tempList;
      }
    },
  },
});

export const {
  setLoading,
  setCurrenUser,
  setProducts,
  filterProducts,
  sortProducts,
  sortProductsDesc,
  sortProductsForPrice,
  sortProductsForPriceDesc,
  setBasketDrawer,
  setFavoriteDrawer,
  setDiscountProducts,
} = appSlice.actions;
export default appSlice.reducer;
