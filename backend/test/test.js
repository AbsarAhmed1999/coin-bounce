const axios = require("axios");

const registerUser = async () => {
  const url = "http://localhost:3000/register"; // Replace with your actual registration endpoint URL
  const userData = {
    username: "exampleUser",
    name: "John Doe",
    email: "john.doe@example.com",
    password: "ThisIsMyPassword@321",
    confirmPassword: "ThisIsMyPassword@321",
  };

  try {
    const response = await axios.post(url, userData);
    console.log("User registration successful:", response.data);
  } catch (error) {
    console.error("User registration failed:", error.response.data);
  }
};

registerUser();
