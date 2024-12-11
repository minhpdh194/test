import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/partials/Layout";
import Home from "./pages/Home";
import Earn from "./pages/Earn";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
import Bonus from "./pages/Bonus";
import Rating from "./pages/Rating";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,

    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "friends",
        element: <Friends />,
      },
      {
        path: "earn",
        element: <Earn />,
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "bonus",
        element: <Bonus />
      },
      {
        path: "rating",
        element: <Rating />
      }
    ],
  },
]);

export default router;
