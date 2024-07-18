import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import { Toaster } from "react-hot-toast";
import State from "./pages/MasterDataForm/State";
import District from "./pages/MasterDataForm/District";
import Product from "./pages/MasterDataForm/Product";
import Requirements from "./pages/Requirements";
import Approval from "./pages/Approval";
import { useAppContext } from "./contexts/AppContext";
import Finalized from "./pages/Finalized";

const App = () => {
  const { currentUser, isLoggedIn } = useAppContext();
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          ></Route>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/sign-up" element={<SignUp />} />
          {isLoggedIn && currentUser && currentUser.isStatesHandler && (
            <>
              <Route path="/create-state" element={<State />} />
              <Route path="/create-district" element={<District />} />
              <Route path="/create-product" element={<Product />} />
            </>
          )}

          {isLoggedIn && currentUser && currentUser.isStatesHandler ? (
            <Route
              path="/requirement-approval"
              element={
                <Layout>
                  <Approval />
                </Layout>
              }
            />
          ) : (
            <>
              <Route
                path="/view-details"
                element={
                  <Layout>
                    <Requirements />
                  </Layout>
                }
              />
              <Route
                path="/view-finalized"
                element={
                  <Layout>
                    <Finalized />
                  </Layout>
                }
              />
            </>
          )}
        </Routes>
      </Router>
    </>
  );
};

export default App;
