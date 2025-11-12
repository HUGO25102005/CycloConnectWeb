import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/reset.css";
import { Provider } from "react-redux";
import store from "./store/index";
import { ProConfigProvider } from "@ant-design/pro-components";
import { initAuthListener } from "./store/authListener";

// Inicializar el listener de autenticación de Firebase
initAuthListener(store.dispatch);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ProConfigProvider hashed={false} autoClearCache={true}>
        <App />
      </ProConfigProvider>
    </Provider>
  </React.StrictMode>
);
