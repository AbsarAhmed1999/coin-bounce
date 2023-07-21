import * as yup from "yup";

const passwordPattern = /(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}/;
const errormessage = "use lowercase , upperCase & digits";

const loginSchema = yup.object().shape({
  username: yup.string().min(5).max(30).required("Username is required"),
  password: yup
    .string()
    .min(8)
    .max(25)
    .matches(passwordPattern, { message: errormessage })
    .required(),
});

export default loginSchema;
