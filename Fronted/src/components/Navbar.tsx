import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { MdFavoriteBorder } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa";

import logo from "../assets/images/logo.png";
import { Badge, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  filterProducts,
  setBasketDrawer,
  setCurrenUser,
  setFavoriteDrawer,
  setProducts,
} from "../redux/appSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RootState } from "../redux/store";
import ProductService from "../services/ProductService";
import { ProductType } from "../types/Types";
import { clearBasket } from "../redux/basketSlice";
import { clearFavorite } from "../redux/FavoriteSlice";

// Helper function to get current balance from localStorage
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

// Helper function to format balance display
const formatBalance = (balance: number): string => {
  return `$${balance.toFixed(2)}`;
};

// Helper function to get user's full name
const getUserFullName = (): string => {
  try {
    const user = localStorage.getItem("user");
    const currentUser = localStorage.getItem("currentUser");

    if (user) {
      const userData = JSON.parse(user);
      return `${userData.name || ""} ${userData.surname || ""}`.trim();
    }

    if (currentUser) {
      const userData = JSON.parse(currentUser);
      return `${userData.name || ""} ${userData.surname || ""}`.trim();
    }

    return "";
  } catch (error) {
    console.error("Error getting user name:", error);
    return "";
  }
};

// Helper function to get user's first name initial
const getUserInitial = (): string => {
  try {
    const user = localStorage.getItem("user");
    const currentUser = localStorage.getItem("currentUser");

    if (user) {
      const userData = JSON.parse(user);
      return userData.name?.charAt(0)?.toUpperCase() || "U";
    }

    if (currentUser) {
      const userData = JSON.parse(currentUser);
      return userData.name?.charAt(0)?.toUpperCase() || "U";
    }

    return "U";
  } catch (error) {
    console.error("Error getting user initial:", error);
    return "U";
  }
};

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state: RootState) => state.app.currentUser);
  const [currentBalance, setCurrentBalance] = useState<number>(
    getCurrentBalance()
  );
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [userFullName, setUserFullName] = useState<string>(getUserFullName());
  const [userInitial, setUserInitial] = useState<string>(getUserInitial());

  // Function to refresh balance from server
  const refreshBalance = async () => {
    if (currentUser?.id) {
      setBalanceLoading(true);
      try {
        const user = localStorage.getItem("user");
        if (user) {
          const userData = JSON.parse(user);
          setCurrentBalance(userData.balance || 0);
        }
      } catch (error) {
        console.error("Error refreshing balance:", error);
      } finally {
        setBalanceLoading(false);
      }
    }
  };

  // Update balance when component mounts and when currentUser changes
  useEffect(() => {
    setCurrentBalance(getCurrentBalance());
    setUserFullName(getUserFullName());
    setUserInitial(getUserInitial());
  }, [currentUser]);

  // Update balance periodically to ensure it's current
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser) {
        setCurrentBalance(getCurrentBalance());
        setUserFullName(getUserFullName());
        setUserInitial(getUserInitial());
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [currentUser]);

  // Listen for balance updates from purchase operations
  useEffect(() => {
    const handleBalanceUpdate = () => {
      setBalanceLoading(true);
      setTimeout(() => {
        setCurrentBalance(getCurrentBalance());
        setUserFullName(getUserFullName());
        setUserInitial(getUserInitial());
        setBalanceLoading(false);
      }, 100);
    };

    // Listen for custom event when balance is updated
    window.addEventListener("balanceUpdated", handleBalanceUpdate);

    // Also listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "currentUser") {
        setBalanceLoading(true);
        setTimeout(() => {
          setCurrentBalance(getCurrentBalance());
          setUserFullName(getUserFullName());
          setUserInitial(getUserInitial());
          setBalanceLoading(false);
        }, 100);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("balanceUpdated", handleBalanceUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const totalBasketCount = useSelector((state: RootState) =>
    (state.basket.basket as { count: number }[]).reduce(
      (total, item) => total + item.count,
      0
    )
  );
  const totalFavoriteCount = useSelector((state: RootState) =>
    (state.favorite.favorite as { count: number }[]).reduce(
      (total, item) => total + item.count,
      0
    )
  );
  const openBasketDrawer = () => {
    dispatch(setBasketDrawer(true));
  };
  const openFavoriteDrawer = () => {
    dispatch(setFavoriteDrawer(true));
  };

  const logOut = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("basket");
    localStorage.removeItem("favorite");
    dispatch(setCurrenUser(null));
    dispatch(clearBasket());
    dispatch(clearFavorite());
    navigate("/login");
    toast.success("Logged out successfully.");
  };

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleFilter = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.value) {
        dispatch(filterProducts(e.target.value));
      } else {
        const products: ProductType[] = await ProductService.getAllProducts();
        dispatch(setProducts(products));
      }
    } catch (error) {
      toast.error("filtering failed. Please try again.");
    }
  };

  // Dark mode state
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const toggleDarkMode = () => {
    setDark((prevDark) => {
      const newDark = !prevDark;
      return newDark;
    });
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "rgba(0,0,0,0.05)",
        boxShadow: "none",
        height: "70px",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img
            src={logo}
            alt="logo"
            style={{ width: "55px", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="default"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {currentUser && [
                <MenuItem
                  key="basket"
                  onClick={() => {
                    openBasketDrawer();
                    setAnchorElNav(null);
                  }}
                >
                  <Badge color="primary" badgeContent={totalBasketCount}>
                    <Typography sx={{ textAlign: "center" }}>
                      <FaCartPlus style={{ fontSize: "20px" }} />
                    </Typography>
                  </Badge>
                </MenuItem>,

                <MenuItem
                  key="favorites"
                  onClick={() => {
                    openFavoriteDrawer();
                    setAnchorElNav(null);
                  }}
                >
                  <Badge color="primary" badgeContent={totalFavoriteCount}>
                    <Typography sx={{ textAlign: "center" }}>
                      <MdFavoriteBorder style={{ fontSize: "20px" }} />
                    </Typography>
                  </Badge>
                </MenuItem>,
              ]}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {currentUser && [
              <Button
                key="basket-desktop"
                sx={{ my: 2, color: "black", display: "block" }}
                onClick={() => openBasketDrawer()}
              >
                <Badge color="primary" badgeContent={totalBasketCount}>
                  <FaCartPlus style={{ fontSize: "20px" }} />
                </Badge>
              </Button>,

              <Button
                key="favorites-desktop"
                sx={{ my: 2, color: "black", display: "block" }}
                onClick={() => openFavoriteDrawer()}
              >
                <Badge color="primary" badgeContent={totalFavoriteCount}>
                  <MdFavoriteBorder style={{ fontSize: "20px" }} />
                </Badge>
              </Button>,
            ]}
          </Box>

          <TextField
            id="search"
            placeholder="Search"
            variant="standard"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFilter(e)
            }
          />

          <Box
            sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 2 }}
          >
            {/* Dark mode toggle button */}
            <button
              style={{
                borderRadius: "50%",
                width: 40,
                height: 40,
                border: "2px solid rgba(0,0,0,0.2)",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                marginRight: "16px",
                transition: "all 0.3s ease",
              }}
              onClick={toggleDarkMode}
              title={dark ? "Aydınlık Mod" : "Koyu Mod"}
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {currentUser ? (
              [
                // User is logged in - show profile menu
                <Tooltip key="tooltip" title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {userInitial}
                    </Avatar>
                  </IconButton>
                </Tooltip>,
                <Menu
                  key="menu"
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {/* User Name - Non-clickable */}
                  <MenuItem
                    sx={{
                      pointerEvents: "none",
                      borderBottom: "1px solid #e0e0e0",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        color: "#333",
                      }}
                    >
                      {userFullName || "User"}
                    </Typography>
                  </MenuItem>

                  {/* Balance - Non-clickable */}
                  <MenuItem
                    sx={{
                      pointerEvents: "none",
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      <b>Balance:</b>{" "}
                      {balanceLoading
                        ? "Loading..."
                        : formatBalance(currentBalance)}
                    </Typography>
                  </MenuItem>

                  {/* Logout - Clickable */}
                  <MenuItem
                    onClick={() => logOut()}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#ffebee",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "#d32f2f",
                        fontWeight: "500",
                      }}
                    >
                      Log Out
                    </Typography>
                  </MenuItem>
                </Menu>,
              ]
            ) : (
              // User is not logged in - show login/signup buttons
              <div>
                <Button
                  variant="text"
                  size="small"
                  sx={{ color: "black" }}
                  onClick={() => navigate("/login")}
                >
                  Log IN
                </Button>
                <Button
                  variant="text"
                  size="small"
                  sx={{ color: "black" }}
                  onClick={() => navigate("/register")}
                >
                  Sign up
                </Button>
              </div>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
