import "./App.css";
import Spinner from "./components/Spinner";
import RouterConfig from "./config/RouterConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProductType } from "./types/Types";
import { useDispatch } from "react-redux";
import { setProducts, setCurrenUser } from "./redux/appSlice";
import ProductService from "./services/ProductService";
import { useEffect } from "react";

import BasketDetails from "./components/BasketDetails";
import FavoriteDetails from "./components/FavoriteDetails";

function App() {
  const dispatch = useDispatch();

  const getAllProducts = async () => {
    const products: ProductType[] = await ProductService.getAllProducts();
    dispatch(setProducts(products));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      dispatch(setCurrenUser(JSON.parse(storedUser)));
    }
    getAllProducts();
  }, []);

  return (
    <>
      <RouterConfig />
      <ToastContainer autoClose={2000} />
      <Spinner />
      <BasketDetails />
      <FavoriteDetails />
    </>
  );
}

export default App;
