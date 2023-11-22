import clsx from "clsx";
import AOS from 'aos';
import style from "./NavBar.module.scss"
import logo from '../../assets/icons/logo.png'
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link as ScrollLink, animateScroll as scroll, scroller } from 'react-scroll';
import { LoginContext } from "../../App";


function NavBar() {
    const { isLogin, setIsLogin, userInfo } = useContext(LoginContext);
    console.log(userInfo.uName);
    const navigate = useNavigate();
    return (
        <nav id={clsx(style.navBarContainer)}>
            <Link to ="/" className={clsx(style.logo)}
            onClick={() => {
                navigate("/");
                setTimeout(() => {
                    console.log(2);
                    scroll.scrollTo(document.getElementById('top').offsetTop, {
                        spy: true,
                        smooth: true,
                        duration: 500,
                    });
                }, 10);
            }}
            >

                <img src={logo} alt="Logo"/>
            </Link>

            <div className={clsx(style.subNavContainer)}>
                <div>
                    <Link to = "/"
                    onClick={() => {
                        setTimeout(() => {
                            console.log(2);
                            scroll.scrollTo(document.getElementById('topService').offsetTop, {
                                spy: true,
                                smooth: true,
                                duration: 500,
                            });
                        }, 10);
                    }}
                    >Service</Link>
                </div>
                <div onMouseOver={() => {
                    AOS.refresh();
                }} >
                    <Link to ="">Company <i style={{marginTop: "4px"}} className="ti-angle-down"></i></Link>
                    <ul data-aos="fade-up">
                        <li><Link to ="">About Us</Link></li>
                        <li><Link to ="">Investors</Link></li>
                    </ul>
                </div>
                <div>
                    <Link to ="#">Career</Link>
                </div>
                <div>
                    <Link to ="#">Contact Us</Link>
                </div>
            </div>
            
            <section className={clsx({[style.invalid] : (isLogin)})}>
                <div className={clsx(style.rolesBtns)}>
                    <div className={clsx(style.forCustomers)}>
                        <Link to ="#">For Customers</Link>
                    </div>
            
                    <div className={clsx(style.forEmployees)}>
                        <Link to ="/login">For Delivery Partners</Link>
                    </div>
                </div>
            </section>
            <section className={clsx({[style.invalid] : (!isLogin)}, style.isLoginBtn)}>
                <div className={style.isLoginInfor}>
                    <div><i className="ti-user"></i></div>
                    <div>{userInfo.uName}</div>
                </div>
                <div className={clsx(style.rolesBtns)}>    
                    <div className={clsx(style.forEmployees)}>
                        <a href="/login"> Log Out</a>
                    </div>
                </div>
            </section>             
        </nav>
    );
}

export default NavBar;