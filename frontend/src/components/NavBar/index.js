import clsx from "clsx";
import AOS from 'aos';
import style from "./NavBar.module.scss"
import logo from '../../assets/icons/logo.png'
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link as ScrollLink, animateScroll as scroll, scroller } from 'react-scroll';
import { LoginContext } from "../../App";


function NavBar() {
    const { isLogin, setIsLogin, userInfo, setUserInfo } = useContext(LoginContext);
    // console.log(userInfo.uName);
    const navigate = useNavigate();
    const [isSmallSubNav, setIsSmallSubNav] = useState(false);
    const [isSmallCompany, setIsSmallCompany] = useState(false);
    
    return (
        <nav id={clsx(style.navBarContainer)}>
            <Link to ="/" className={clsx(style.logo)}
            onClick={() => {
                navigate("/");
                setTimeout(() => {
                    // console.log(2);
                    scroll.scrollTo(document.getElementById('top').offsetTop, {
                        spy: true,
                        smooth: true,
                        duration: 500,
                    });
                }, 10);
                const storedIsLogin = JSON.parse(localStorage.getItem('isLogin'));
                const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
                console.log(storedIsLogin);
                console.log(storedUserInfo);
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
                        <li><Link to ="/about-us">About Us</Link></li>
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
                <div className={style.isLoginInfor}
                onClick={
                    () => {
                        // console.log(userInfo.uRole === 1);
                        if(userInfo.uRole === 1) {
                            navigate("/leader");
                        }
                        else if(userInfo.uRole === 2) {
                            navigate("/transaction-manager");
                        }
                        else if(userInfo.uRole === 3) {
                            navigate("/transactionTeller");
                        }
                        else if(userInfo.uRole === 5) {
                            navigate("/gather-manager");
                        }
                        else if(userInfo.uRole === 6) {
                            navigate("/gatherTeller")
                        }
                    }
                }
                >
                    <div><i className="ti-user"></i></div>
                    <div>{userInfo.uName}</div>
                </div>
                <div className={clsx(style.rolesBtns)}>    
                    <div className={clsx(style.forEmployees)}>
                        <a href="/login"
                        onClick={() => {
                            setIsLogin(false);
                            setUserInfo({
                                uId : "",
                                uName : "",
                                uPhone : "",
                                uPassword : "",
                                uRole: "",
                                uUnit: ""
                            });
                            localStorage.setItem('isLogin', JSON.stringify(false));
                            localStorage.setItem('userInfo', JSON.stringify({
                                uId : "",
                                uName : "",
                                uPhone : "",
                                uPassword : "",
                                uRole: "",
                                uUnit: ""
                            }));
                        }}
                        > Log Out</a>
                    </div>
                </div>
            </section>   

            <div className={clsx(style.smallNavContainer)}>
                <i className="ti-menu"
                onClick={() => {
                    setIsSmallSubNav(!isSmallSubNav);
                    setIsSmallCompany(false);
                }}
                ></i>
                <div className={clsx(style.smallSubNav, {[style.hidden] : !isSmallSubNav})}
                data-aos="fade-right">
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
                        <Link to =""
                        onClick={() => {
                            setIsSmallCompany(!isSmallCompany);
                            
                        }}
                        >Company <i style={{marginTop: "4px"}} className={clsx("ti-angle-double-right")}></i></Link>
                        <ul data-aos="fade-right" className={clsx({[style.hidden]:!isSmallCompany})}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        >
                            <li><Link to ="/about-us">About Us</Link></li>
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
                
            </div>
        </nav>
    );
}

export default NavBar;