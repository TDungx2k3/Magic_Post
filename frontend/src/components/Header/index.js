import { Fragment } from "react";
import NavBar from "../NavBar"
import Slider from "../Slider"
import clsx from "clsx";
import style from "./Header.module.scss"
function Header() {
    return (
        <Fragment>
            <NavBar />
            <Slider />
        </Fragment>
    );
}

export default Header;