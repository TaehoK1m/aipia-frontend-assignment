import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import App from "./App";
import "./styles.css";

// 서비스워커 등록 시 콜백 명시 (bfcache, 캐싱 충돌 방지)
registerSW({
  immediate: true,
  onNeedRefresh() {
    // 새 버전 감지 시 새로고침 요청 등 가능
    console.log("New content available. Please refresh.");
  },
  onOfflineReady() {
    console.log("App ready for offline use.");
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
