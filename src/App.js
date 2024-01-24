import { ThemeProvider, createTheme } from "@mui/material";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import DeshBoard from "./pages/DeshBoard";
import Inbox from "./pages/Inbox";
import Signin from "./pages/Signin";
import { store } from "./store/index";
import { Provider } from "react-redux";
import Error from "./pages/Error";

const theme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Signin />} />
            <Route path='/' element={<Home />}>
              <Route path='overview' element={<DeshBoard />} />
              <Route path='inbox' element={<Inbox />} />
            </Route>
            <Route path='*' element={<Error />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
