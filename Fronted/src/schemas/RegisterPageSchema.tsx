import * as yup from "yup";

export const RegisterPageSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username can't be longer than 20 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .required("Username is required"),

  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name can't be longer than 50 characters")
    .required("Name is required"),

  surname: yup
    .string()
    .min(2, "Surname must be at least 2 characters")
    .max(50, "Surname can't be longer than 50 characters")
    .required("Surname is required"),

  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone is required"),

  adress: yup
    .string()
    .min(5, "Address must be at least 5 characters")
    .required("Address is required"),

  birthDate: yup
    .date()
    .max(new Date(), "Birthdate cannot be in the future")
    .required("Birth date is required"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});
