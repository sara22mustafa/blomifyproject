import React from "react";
import ReactDom from "react-dom/client";
import "./index.css";
import App from "./App";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { QueryClient, QueryClientProvider } from "react-query";
import UserContxtProvider from "./Context/UserContext";
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthContextProvider } from "./Context/AuthContext";
import { Provider } from 'react-redux';
import store from './redux/store';


let root = ReactDom.createRoot(document.getElementById("root"));
let queryclient = new QueryClient();
root.render(
  <QueryClientProvider client={queryclient}>
    <UserContxtProvider>
      <AuthContextProvider>
      <Provider store={store}>
        <App />
      </Provider>,
      </AuthContextProvider>
    </UserContxtProvider>
    <ReactQueryDevtools initialIsOpen="false" position="bottom-right" />
  </QueryClientProvider>
);
