import clsx from "clsx"
import { Fragment } from "react";
import Header from "../../components/Header";
import TransactionManagerFormCreateAccount from "./component/TransactionManagerFormCreateAccount";
import Footer from "../../components/Footer";

function TransactionManager() {
    return (
        <Fragment>
            <Header />
            <TransactionManagerFormCreateAccount />
            <Footer />
        </Fragment>
    );
}

export default TransactionManager;