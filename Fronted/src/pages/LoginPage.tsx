import "../css/LoginPage.css";
import { LoginPageSchema } from "../schemas/LoginPageSchema";

import { Button, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { useFormik } from "formik";
import { FaLock } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

import LoginPageService from "../services/LoginPageService";
import UserService from "../services/UserService";
import { useDispatch } from "react-redux";
import { setLoading, setCurrenUser } from "../redux/appSlice";
import { UserType } from "../types/Types";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (values: any) => {
    try {
      dispatch(setLoading(true));
      const response = await LoginPageService.login({
        email: values.email,
        password: values.password,
      });

      if (response && response.token) {
        // Create user data from email since API doesn't return user info
        const userData: UserType = {
          id: "temp-id",
          username: values.email,
          name: values.email.split("@")[0] || "User",
          surname: "",
          email: values.email,
          phone: 0,
          adress: "",
          birthDate: new Date(),
          password: "",
          balance: 1000, // Default balance for live backend
        };

        console.log("Login successful - userData:", userData);

        dispatch(setCurrenUser(userData));
        localStorage.setItem("currentUser", JSON.stringify(userData));
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const { values, handleSubmit, handleChange, errors, resetForm, touched } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      onSubmit: submit,
      validationSchema: LoginPageSchema,
    });

  return (
    <div className="login">
      <div className="login-main">
        <form onSubmit={handleSubmit}>
          <div className="form-div">
            <TextField
              id="email"
              placeholder="Username or Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoIosMail />
                    </InputAdornment>
                  ),
                },
              }}
              variant="standard"
              helperText={touched.email && errors.email}
              error={touched.email && Boolean(errors.email)}
            />
            <TextField
              id="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock />
                    </InputAdornment>
                  ),
                },
              }}
              variant="standard"
              type="password"
              helperText={touched.password && errors.password}
              error={touched.password && Boolean(errors.password)}
            />
            <div className="buttons">
              <Button
                variant="outlined"
                color="primary"
                className="save-button"
                type="submit"
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                className="clear-button"
                onClick={() => resetForm()}
              >
                Clear
              </Button>
            </div>
            <p
              style={{ marginTop: "5px", cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Don't have an account?
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
