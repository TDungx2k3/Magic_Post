import { Fragment, useContext } from "react";
import NavBar from "../NavBar"
import Slider from "../Slider"
import clsx from "clsx";
import style from "./Header.module.scss"
import { LoginContext } from "../../App";
function Header({showSlider = true}) {

    return (
        <Fragment>
            <NavBar />
            {showSlider && <Slider />}
        </Fragment>
    );
}

export default Header;