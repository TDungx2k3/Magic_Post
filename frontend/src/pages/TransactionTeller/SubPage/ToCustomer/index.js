import { Fragment } from "react";
import Footer from "../../../../components/Footer";
import Header from "../../../../components/Header";
import OrderList from "../../components/OrderList";

function ToCustomer() {
    return (
        <Fragment>
            <Header />
            <div className={clsx(style.content)}>
                <OrderList />
            </div>
            <Footer />
        </Fragment>
    );
}

export default ToCustomer;
