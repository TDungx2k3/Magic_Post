import React, { useEffect } from "react";
import { Fragment } from "react";
import AboutEcomExpress from "./components/AboutEcomExpress";
import OurJourney from "./components/OurJourney";
import Team from "./components/Team";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import header_about_us from "../../assets/images/header_about_us.jpg";

function AboutUs() {
    return (
        <Fragment>
            <NavBar />
            <img src={header_about_us} alt="Header Image" />
            <AboutEcomExpress data-aos="zoom-in-up" />
            <OurJourney />
            <Team />
            <Footer />
        </Fragment>
    );
}

export default AboutUs;
