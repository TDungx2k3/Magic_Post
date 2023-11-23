import clsx from "clsx"
import { Fragment, useContext, useEffect } from "react";
import Header from "../../components/Header";
import GatherList from "./components/GatherList";
import Footer from "../../components/Footer";
import style from "./Leader.module.scss";
import { LoginContext } from "../../App";
import { useNavigate } from "react-router-dom";

function Leader() {

    const navigate = useNavigate();
    const { isLogin, setIsLogin, userInfo, setUserInfo} = useContext(LoginContext)
    let cnt = 0;
    useEffect(() => {
        if(!isLogin && cnt === 0) {
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