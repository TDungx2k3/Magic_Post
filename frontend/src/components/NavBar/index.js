import clsx from "clsx";
import AOS from 'aos';
import style from "./NavBar.module.scss"
import logo from '../../assets/icons/logo.png'
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink, animateScroll as scroll, scroller } from 'react-scroll';


function NavBar() {
    return (
        <nav id={clsx(style.navBarContainer)}>
            <ScrollLink to ="top" className={clsx(style.logo)} spy={true} smooth={true} duration={500}>
                <img src={logo} alt="Logo"/>
            </ScrollLink>

            <div className={clsx(style.subNavContainer)}>
                <div>
                    <ScrollLink className={clsx(style.linkToService)} to ="topService" spy={true} smooth={true} duration={500}>Service</ScrollLink>
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

            <div className={clsx(style.rolesBtns)}>
                <div className={clsx(style.forCustomers)}>
                    <Link to ="#">For Customers</Link>
                </div>
        
                <div className={clsx(style.forEmployees)}>
                    <Link to ="/login">For Delivery Partners</Link>
                </div>
            </div>
            
        </nav>
    );
}

export default NavBar;