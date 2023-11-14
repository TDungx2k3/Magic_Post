import clsx from "clsx";
import AOS from 'aos';
import style from "./NavBar.module.scss"
import logo from '../../assets/icons/logo.png'
import { useEffect } from "react";
import { Link } from "react-router-dom";


function NavBar() {
    return (
        <nav id={clsx(style.navBarContainer)}>
            <Link to ="#" className={clsx(style.logo)}>
                <img src={logo} alt="Logo"/>
            </Link>

            <div className={clsx(style.subNavContainer)}>
                <div>
                    <Link to ="#">Service</Link>
                </div>
                <div onMouseOver={() => {
                    AOS.refresh();
                }} >
                    <Link to ="#">Company <i style={{marginTop: "4px"}} className="ti-angle-down"></i></Link>
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