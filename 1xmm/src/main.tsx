import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "./index.css";
import Providers from "./providers.tsx";

import "./i18n.tsx";

const picNb = Math.round(1 + Math.random() * 13);

const linkToPreload = (picNb: number):string => {
  switch (picNb) {
    case 1:
      return "/images/splash-screen/pic__1.webp";
    case 2:
      return "/images/splash-screen/pic__2.webp";
    case 3:
      return "/images/splash-screen/pic__3.webp";
    case 4:
      return "/images/splash-screen/pic__4.webp";
    case 5:
      return "/images/splash-screen/pic__5.webp";
    case 6:
      return "/images/splash-screen/pic__6.webp";
    case 7:
      return "/images/splash-screen/pic__7.webp";
    case 8:
      return "/images/splash-screen/pic__8.webp";
    case 9:
      return "/images/splash-screen/pic__9.webp";
    case 10:
      return "/images/splash-screen/pic__10.webp";
    case 11:
      return "/images/splash-screen/pic__11.webp";
    case 12:
      return "/images/splash-screen/pic__12.webp";
    case 13:
      return "/images/splash-screen/pic__13.webp";
    case 14:
      return "/images/splash-screen/pic__14.webp";
    default:
      return "/images/splash-screen/pic__1.webp";
  };
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Providers>
    <link rel="preload" as="image" href={linkToPreload(picNb)} type="image/webp" />
    <App picNb={picNb} />
  </Providers>
);
