import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import MovieDetail from "../pages/MovieDetail";
import MovieList from "../pages/MovieList";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Favorites from "../pages/Favorites";
import Reviews from "../pages/Reviews";
import ProtectedRoute from "../components/ProtectedRoute";
import Search from "../pages/Search";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "movies",
        element: <MovieList />,
      },
      {
        path: "movie/:id",
        element: <MovieDetail />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "favorites",
        element: (
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        ),
      },
      {
        path: "reviews",
        element: (
          <ProtectedRoute>
            <Reviews />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "search",
      //   element: <Search />,
      // },
      // {
      //   path: "reviews",
      //   element: <Reviews />,
      // },
      // {
      //   path: "favorites",
      //   element: <Favorites />,
      // },
    ],
  },
]);
