import React, { useEffect } from "react";
import { Fragment } from "react";
import AboutEcomExpress from "./components/AboutEcomExpress";
import OurJourney from "./components/OurJourney";
import Team from "./components/Team";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function AboutUs() {
    return (
        <Fragment>
            <Header />
            <AboutEcomExpress data-aos="zoom-in-up" />
            <OurJourney />
            <Team />
            <Footer />
        </Fragment>
    );
}

export default AboutUs;
