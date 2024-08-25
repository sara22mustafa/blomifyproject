import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";
import { UserContext } from "../../Context/UserContext.js";
import Navbar from "../Navbar/Navbar.jsx";


export default function Layout() {
  let { setUserToken } = useContext(UserContext);
  useEffect(() => {
    if (localStorage.getItem("userToken") !== null) {
      setUserToken(localStorage.getItem("userToken"));
    }
  }, []);
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <Outlet></Outlet>
        <Footer />
      </div>
    </>
  );
}
