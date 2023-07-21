import { configureStore } from "@reduxjs/toolkit";
import user from "./userSplice";

const store = configureStore({
  reducer: { user },
});

export default store;
