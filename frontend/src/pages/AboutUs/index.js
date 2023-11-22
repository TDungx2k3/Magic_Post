import React, { useEffect } from "react";
import { Fragment } from "react";
import AboutDDDExpress from "./components/AboutDDDExpress";
import OurJourney from "./components/OurJourney";
import Team from "./components/Team";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function AboutUs() {
    return (
        <Fragment>
            <Header />
            <AboutDDDExpress />
            <OurJourney />
            <Team />
            <Footer />
        </Fragment>
    );
}

export default AboutUs;
