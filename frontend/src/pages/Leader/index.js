import clsx from "clsx"
import { Fragment } from "react";
import Header from "../../components/Header";
import GatherList from "./components/GatherList";
import Footer from "../../components/Footer";
import style from "./Leader.module.scss";

function Leader() {
    return (
        <Fragment>
            <Header />
            <div className={clsx(style.content)}>
                <GatherList />
            </div>
            <Footer />
        </Fragment>
    );
}

export default Leader;