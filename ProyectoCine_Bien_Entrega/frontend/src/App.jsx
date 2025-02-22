import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { router } from "./router";

const App = () => {

  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </ThemeProvider>
  ) ;
};

export default App;
