import { Store } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import authTokenSlice from "./features/authTokenSlice";
import usernameSlice from "./features/usernameSlice";

const store: Store = configureStore({
  reducer: { token: authTokenSlice, username: usernameSlice },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;