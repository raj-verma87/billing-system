import React, { useState, useEffect } from "react";
import { fetchProducts, fetchBills, fetchBillById } from "./services/api";
import ProductList from "./components/Product/ProductList";
import AddProduct from "./components/Product/AddProduct";
import GenerateBill from "./components/Bill/GenerateBill";
import BillHistory from "./components/Bill/BillHistory";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ShowCurrentBill from "./components/Bill/ShowCurrentBill";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import "./App.css";
import Return from './components/Payment/Return';
import Cancel from './components/Payment/Cancel';


const App = () => {
  const [products, setProducts] = useState([]);
  const [bill, setBill] = useState(null); // State to hold the bill data

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location (pathname)
  const showNavigation = location.pathname !== '/show-bill';

  // Fetch products initially
  useEffect(() => {
    const token = localStorage.getItem("token");
    const registered = localStorage.getItem("registered");

    if (token) {
      setIsAuthenticated(true);
    }

    if (registered) {
      setIsRegistered(true);
    }

    const loadProducts = async () => {
      try {
        const { data } = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    loadProducts();
    // console.log("products...",products);
  }, []);

  // Fetch bill data when the user navigates to "/show-bill"
  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await fetchBills();
        // Log the data directly
        const alldata = response.data;

        if (alldata && alldata.length > 0) {
          const { data } = await fetchBillById(alldata[0].id);
          setBill(data);
        } else {
          console.log("No bills found");
        }
      } catch (err) {
        console.error("Error fetching bill:", err);
      }
    };

    if (location.pathname === "/show-bill") {
      fetchBill();
    }
  }, [location.pathname]); // Fetch bill when the route changes

  useEffect(() => {
    console.log("Products updated:", products);
  }, [products]);

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(location.search);
    const authStatus = params.get('isAuthenticated');

    // Update state based on query parameter
    if (authStatus) {
      setIsAuthenticated(authStatus === 'true');
    }
  }, [location]);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    // <Router>
    <div style={{ marginLeft: "40px", padding: "1px" }}>
      {showNavigation &&
      <h1>Billing Application</h1>
      }
      {/* Navigation Links */}
      <nav style={{ padding: "1px" }}>
        
        {isAuthenticated && showNavigation && (
          <>
            <button className="button-style">
              <Link to="/">Home</Link>
            </button>
            <button className="button-style">
              <Link to="/add-product">Add Product</Link>
            </button>
            <button className="button-style">
              <Link to="/generate-bill">Generate Bill</Link>
            </button>
            <button className="button-style">
              <Link to="/bill-history">Bill History</Link>
            </button>
            <button className="button-style">
              <Link to="/show-bill">Current Bill</Link>
            </button>
            <button className="button-style" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
        {!isAuthenticated && (
          <button className="button-style">
            <Link to="/register">Register</Link>
          </button>
        )}
      </nav>

      {/* Routes */}
      <Routes>
        {isAuthenticated ? (
          <Route path="*" element={<Navigate to="/add-product" />} />
        ) : isRegistered ? (
          <Route path="*" element={<Navigate to="/" />} />
        ) : (
          <Route path="*" element={<Navigate to="/register" />} />
        )}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div>
                <AddProduct setProducts={setProducts} />
                <ProductList products={products} setProducts={setProducts} />
              </div>
            ) : (
              <LoginPage setIsAuthenticated={setIsAuthenticated}/>
            )
          }
        />
        <Route
          path="/add-product"
          element={
            <div>
              <AddProduct setProducts={setProducts} />
              <ProductList products={products} setProducts={setProducts} />
            </div>
          }
        />
        <Route path="/generate-bill" element={<GenerateBill />} />
        <Route path="/bill-history" element={<BillHistory />} />
        <Route path="/show-bill" element={<ShowCurrentBill bill={bill} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/return" element={<Return />} />
        <Route path="/cancel" element={<Cancel />} />
      </Routes>
    </div>
    //</Router>
  );
};

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
