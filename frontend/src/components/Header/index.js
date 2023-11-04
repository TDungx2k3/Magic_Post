import { Fragment } from "react";
import NavBar from "../NavBar"
import Slider from "../Slider"
function Header() {
    return (
        <Fragment>
            <NavBar />
            <Slider />
        </Fragment>
    );
}

export default Header;