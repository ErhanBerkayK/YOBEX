export interface UserType {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: number;
  adress: string;
  birthDate: Date;
  password: string;
  balance: number;
}

export interface AppSliceType {
  currentUser: UserType | null;
  loading: boolean;
  basketDrawer: boolean;
  favoriteDrawer: boolean;
  products: ProductType[];
  discountProducts: ProductType[];
}

export interface CheckUserType {
  result: boolean;
  currentUser: UserType | null;
}

export interface ProductType {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
  count: number;
  rating: RatingType;
  _id?: string;
}

interface RatingType {
  rate: number;
  count: number;
}

export interface ProductCardProps {
  product: ProductType;
}

//-------------BasketSlice------------------

export interface BasketSliceType {
  basket: ProductType[];
  totalAmount: number;
  loading: boolean;
  error: string | null;
}

//-------------FavoriteSlice------------------
export interface FavoriteSliceType {
  favorite: ProductType[];
  totalAmount: number;
  loading: boolean;
  error: string | null;
}
