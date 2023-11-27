import clsx from "clsx"
import { Fragment, useContext, useEffect } from "react";
import Header from "../../components/Header";
import GatherList from "./components/GatherList";
import Footer from "../../components/Footer";
import style from "./Leader.module.scss";
import { useNavigate } from "react-router-dom";

function Leader() {

    const navigate = useNavigate();
    let nowTime = new Date();
    const storedOutTime = new Date(JSON.parse(localStorage.getItem('outTime')));
    const storedIsLogin = JSON.parse(localStorage.getItem('isLogin'));
    let cnt = 0;
    useEffect(() => {
        if(!storedIsLogin && nowTime - storedOutTime < 3600000 && cnt === 0) {
            cnt ++;
            alert("You have to login before access this page!");
            navigate("/login");
        }
    }, [1])
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