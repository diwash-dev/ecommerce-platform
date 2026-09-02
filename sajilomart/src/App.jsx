// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Home from "./page/Home";
// import Navbar from "./components/ui/navbar/Navbar";
// import { ThemeProvider } from "./components/provider/theme-provider";

// export default function App() {
//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: (
//         <>
//           <Navbar />
//            <Home />
//         </>
//       ),
//     },
//   ]);

//   return (
//     <>
//     <ThemeProvider>
//       <RouterProvider router={router} />
//       </ThemeProvider>
//     </>
//   );
// }

{
  /*----------------------React Router and theme imports ------------------*/
}

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./page/Home";
import About from "./page/About";
import Services from "./page/Services";
import Products from "./page/Products";
import Navbar from "./components/ui/navbar/Navbar";
import { ThemeProvider } from "./components/provider/theme-provider";
import Footer from "./components/ui/navbar/Footer";
import Signup from "./page/Signup";
import Login from "./page/Login";
import Product from "./page/Product";
import Checkout from "./page/Checkout";
import AdminLogin from "./page/AdminLogin";
import ErrorPage from "./page/ErrorPage";
import Success from "./page/Paymentsuccess";
import Dashboard from "./SiteLayout/Dashboard";

import AddProducts from "./components/ui/navbar/AddProducts";
import ProductManagement from "./components/ui/navbar/ProductManagement";
import PerformanceMatrix from "./components/ui/navbar/PerformanceMatrix";
import Notifications from "./components/ui/navbar/Notifications";
import StoreSettings from "./components/ui/navbar/StoreSettings";
import OrderManagement from "./components/ui/navbar/OrderManagement";

import { store } from "./Redux/Store";
import Myorder from "./page/Myorder";
import PaymentSuccess from "./page/Paymentsuccess";
import ForgotPassword from "./page/ForgotPassword";
import { Toaster } from "./components/ui/toaster";
import { Provider } from "react-redux";
import Routes from "./components/ui/navbar/Routes";
import StartupLoader from "./components/ui/navbar/StartupLoader";

export default function App() {
  const [showStartupLoader, setShowStartupLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStartupLoader(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  {
    /*----------------------React Router configuration ------------------*/
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Routes>
          <>
            <Navbar /> {/* Navbar component common to all pages */}
            <Home /> {/* Home page component */}
            <Footer /> {/* Footer component common to all pages */}
          </>
        </Routes>
      ),
    },
    {
      path: "/About",
      element: (
        <Routes>
          <>
            <Navbar />
            <About />
            <Footer />
          </>
        </Routes>
      ),
    },
    {
      path: "/Services",
      element: (
        <Routes>
          <>
            <Navbar />
            <Services />
            <Footer />
          </>
        </Routes>
      ),
    },
    {
      path: "/Login", // User login page
      element: (
        <Routes>
          <>
            <Navbar />
            <Login />
            <Footer />
          </>
        </Routes>
      ),
    },

    {
      path: "/Signup", // User signup page
      element: (
        <Routes>
          <>
            <Navbar />
            <Signup />
            <Footer />
          </>
        </Routes>
      ),
    },
    {
      path: "/forgot-password", // Forgot password page
      element: (
        <Routes>
          <>
            <Navbar />
            <ForgotPassword />
            <Footer />
          </>
        </Routes>
      ),
    },
    {
      path: "/products", // Products browsing page
      element: (
        <Routes>
          <>
            <Navbar />
            <Products />
            <Footer />
          </>
        </Routes>
      ),
    },
    {
      path: "/product/:prodname", // Product detail page
      element: (
        <>
          <Navbar />
          <Product />
          <Footer />
        </>
      ),
    },
    {
      path: "/checkout", // Checkout page
      element: (
        <Routes>
          <>
            <Navbar />
            <Checkout />
            <Footer />
          </>
        </Routes>
      ),
    },
    {
      path: "/adminlogin", // Admin login page
      element: (
        <Routes>
          <>
            <Navbar />
            <AdminLogin />
            <Footer />
          </>
        </Routes>
      ),
    },
    {
      path: "/order", // My order page
      element: (
        <Routes>
          <>
            <Navbar />
            <Myorder />
            <Footer />
          </>
        </Routes>
      ),
    },

    {
      path: "/*", // Catch-all route for invalid URLs
      element: (
        <Routes>
          <>
            <Navbar />
            <ErrorPage />
            <Footer />
          </>
        </Routes>
      ),
    },
    {
      path: "/payment-success", // Success page after payment
      element: (
        <>
          <PaymentSuccess /> {/* Only content, no Navbar/Footer */}
        </>
      ),
    },

    {
      path: "/dashboard", // Dashboard page for admin
      // element:<DashboardLayout children={<h1>hello</h1>} />,
      element: (
        <Routes>
          <>
            {/* <Navbar /> */}
            <Dashboard />
            {/* <Footer /> */}
          </>
        </Routes>
      ),
    },

    {
      path: "/dashboard/orderManagement", // Orders management page
      element: (
        <Routes>
          <Dashboard children={<OrderManagement />} />
        </Routes>
      ),
    },
    {
      path: "/dashboard/addproducts", // Add products page
      element: (
        <Routes>
          {" "}
          <Dashboard children={<AddProducts />} />
        </Routes>
      ),
    },
    {
      path: "/dashboard/productsmanagement", // Products management page
      element: (
        <Routes>
          {" "}
          <Dashboard children={<ProductManagement />} />
        </Routes>
      ),
    },
    {
      path: "/dashboard/performanceMatrix", // Performance matrix page
      element: (
        <Routes>
          {" "}
          <Dashboard children={<PerformanceMatrix />} />
        </Routes>
      ),
    },
    {
      path: "/dashboard/notifications", // Notifications page
      element: (
        <Routes>
          {" "}
          <Dashboard children={<Notifications />} />
        </Routes>
      ),
    },

    {
      path: "/dashboard/storesettings", // Store settings page
      element: (
        <Routes>
          {" "}
          <Dashboard children={<StoreSettings />} />
        </Routes>
      ),
    },
  ]);

  // now wrap your application with the Provider component and pass the store as a prop
  return (
    <ThemeProvider>
      <Provider store={store}>
        {showStartupLoader && <StartupLoader />}
        {/* Global toaster component for notifications */}
        <Toaster />
        {/* Parent div ma background class add garne */}
        <div className="dark:bg-zinc-700 bg-slate-200 min-h-screen">
          <RouterProvider router={router} />
        </div>
      </Provider>
    </ThemeProvider>
  );
}
