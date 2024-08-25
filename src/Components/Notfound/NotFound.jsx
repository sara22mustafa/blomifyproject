import React from "react";
import Style from "./NotFound.module.css";
import { Link } from "react-router-dom";
import {Helmet} from "react-helmet";

const NotFound = () => {
  return (
    <>
      <section className="py-5">
        <div
          className="d-flex justify-content-center 
              align-items-center flex-column 
              text-center w-100"
        >
          <div className={`${Style.bg_img} w-50`}></div>
          <div>
            <p className="display-4">Looks Like You're Lost</p>
            <p className="mb-10">
              The page you are looking for not available...
            </p>
            <Link
              to={"/"}
              className="text-white px-4 py-3  mt-10 rounded bg-deep-burgundy"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </section>
      <Helmet>
        <title>not found</title>
    </Helmet>
    </>
  );
};

export default NotFound;
