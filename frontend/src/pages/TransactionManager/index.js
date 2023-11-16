import clsx from "clsx";
import style from "./TransactionManager.module.scss";
import { Fragment, useState } from "react";
import Header from "../../components/Header";
import TransactionManagerFormCreateAccount from "./component/TransactionManagerFormCreateAccount";
import ManageTransaction from "./component/ManageTransaction";
import Footer from "../../components/Footer";

function TransactionManager() {
    const [isClickCreateAccount, setIsClickCreateAccount] = useState(true);

    // Sau làm component cho statistic sau, lúc đấy thì xử lý hiện cái nào sau
    const handleIsClickCreateAccount = () => {
        setIsClickCreateAccount(true);
    };

    return (
        <Fragment>
            <Header />
            <ManageTransaction onClickCreateAccount={handleIsClickCreateAccount} />
            <TransactionManagerFormCreateAccount className={isClickCreateAccount ? clsx(style.TransactionManagerFormCreateAccount) : clsx(style["TransactionManagerFormCreateAccount-hidden"])} />
            <Footer />
        </Fragment>
    );
}

export default TransactionManager;
