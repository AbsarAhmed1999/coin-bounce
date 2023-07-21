import { useState } from "react";
import styles from "./Login.module.css";
import TextInput from "../../components/TextInput/TextInput";
import loginSchema from "../../schemas/loginSchema";
import { useFormik } from "formik";
import { login } from "../../api/internal";
import { setUser } from "../../store/userSplice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const handleLogin = async () => {
    console.log("HandleLogin");
    const data = {
      username: values.username,
      password: values.password,
    };
    // did not use try catch since we r using it in api/internal file
    const response = await login(data);
    if (response.status === 200) {
      //1. setUser
      const user = {
        _id: response.data.user._id,
        email: response.data.user.username,
        auth: response.data.auth,
      };
      dispatch(setUser(user));
      //2. redirect -> homepage
      navigate("/");
    } else if (response.code === "ERR_BAD_REQUEST") {
      // display error msg
      setError(response.response.data.message);
      console.log(error);
    }
  };

  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
  });

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginHeader}>Login to your account</div>
      <TextInput
        type="text"
        value={values.username}
        name="username"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="username"
        error={errors.username && touched.username ? 1 : undefined}
        errormessage={errors.username}
      />
      <TextInput
        type="password"
        value={values.password}
        name="password"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="password"
        error={errors.password && touched.password ? 1 : undefined}
        errormessage={errors.password}
      />
      <button
        className={styles.logInButton}
        onClick={handleLogin}
        disabled={
          // if username is empty
          !values.username ||
          // if passwrod is empty
          !values.password ||
          errors.username ||
          errors.password
        }
      >
        Log In
      </button>
      <span>
        Dont have an acount ?{" "}
        <button
          className={styles.createAccount}
          onClick={() => navigate("/signup")}
        >
          Register
        </button>
      </span>
      {error !== "" ? <p className={styles.errorMessage}>{error}</p> : ""}
    </div>
  );
}

export default Login;
