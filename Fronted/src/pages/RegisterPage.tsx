import "../css/RegisterPage.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import { FaUserCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa";
import { FaHouseUser } from "react-icons/fa";
import { FaBirthdayCake } from "react-icons/fa";
import { useFormik } from "formik";
import { RegisterPageSchema } from "../schemas/RegisterPageSchema";
import RegisterPageService from "../services/RegisterPageService";
import { UserType } from "../types/Types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoginPageService from "../services/LoginPageService";
import { useDispatch } from "react-redux";
import { setCurrenUser } from "../redux/appSlice";

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submit = async (values: any) => {
    try {
      // Only send required fields to the live backend
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
      };

      console.log("Sending registration payload:", payload);

      const response = await RegisterPageService.register(payload);

      if (response && response.message) {
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error registering user. Please try again.");
      }
    }
  };

  const { values, handleSubmit, handleChange, errors, resetForm, touched } =
    useFormik({
      initialValues: {
        username: "",
        name: "",
        surname: "",
        email: "",
        phone: "",
        adress: "",
        birthDate: "",
        password: "",
      },
      onSubmit: submit,
      validationSchema: RegisterPageSchema,
    });

  return (
    <div className="register">
      <div className="register-main">
        <form onSubmit={handleSubmit}>
          <div className="form-div">
            <TextField
              id="username"
              placeholder="Username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUserCircle />
                    </InputAdornment>
                  ),
                },
              }}
              variant="standard"
              helperText={touched.username && errors.username}
              error={touched.username && Boolean(errors.username)}
            />
            <div className="name-surname">
              <TextField
                id="name"
                placeholder="Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaUserCircle />
                      </InputAdornment>
                    ),
                  },
                }}
                variant="standard"
                helperText={touched.name && errors.name}
                error={touched.name && Boolean(errors.name)}
              />
              <TextField
                id="surname"
                placeholder="Surname"
                value={values.surname}
                onChange={handleChange}
                onBlur={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaUserCircle />
                      </InputAdornment>
                    ),
                  },
                }}
                variant="standard"
                helperText={touched.surname && errors.surname}
                error={touched.surname && Boolean(errors.surname)}
              />
            </div>

            <TextField
              id="email"
              placeholder="Email"
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
              id="phone"
              placeholder="Phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaPhone />
                    </InputAdornment>
                  ),
                },
              }}
              variant="standard"
              type="number"
              helperText={touched.phone && errors.phone}
              error={touched.phone && Boolean(errors.phone)}
            />

            <TextField
              id="adress"
              placeholder="Address"
              sx={{ width: "219px" }}
              multiline
              value={values.adress}
              onChange={handleChange}
              onBlur={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaHouseUser />
                    </InputAdornment>
                  ),
                },
              }}
              variant="standard"
              helperText={touched.adress && errors.adress}
              error={touched.adress && Boolean(errors.adress)}
            />

            <TextField
              id="birthDate"
              placeholder="Birth Date"
              type="date"
              sx={{ width: "219px" }}
              value={values.birthDate}
              onChange={handleChange}
              onBlur={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaBirthdayCake />
                    </InputAdornment>
                  ),
                },
              }}
              variant="standard"
              helperText={touched.birthDate && errors.birthDate}
              error={touched.birthDate && Boolean(errors.birthDate)}
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
              onClick={() => navigate("/login")}
            >
              Do you have an account?
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
