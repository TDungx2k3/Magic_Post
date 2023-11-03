import clsx from "clsx";
import AOS from 'aos';
import style from "./NavBar.module.scss"
import { useEffect } from "react";


function NavBar() {
    return (
        <nav id={clsx(style.navBarContainer)}>
            <div className={clsx(style.logo)}>Logo</div>

            <div className={clsx(style.subNavContainer)}>
                <div>
                    <a href="#">Service</a>
                </div>
                <div onMouseOver={() => {
                    AOS.refresh();
                }} >
                    <a  href="#">Company <i style={{marginTop: "4px"}} className="ti-angle-down"></i></a>
                    <ul data-aos="fade-up">
                        <li><a href="">About Us</a></li>
                        <li><a href="">Investors</a></li>
                    </ul>
                </div>
                <div>
                    <a href="#">Career</a>
                </div>
                <div>
                    <a href="#">Contact Us</a>
                </div>
            </div>

            <div className={clsx(style.rolesBtns)}>
                <div className={clsx(style.forCustomers)}>
                    <a href="#">For Customers</a>
                </div>
        
                <div className={clsx(style.forEmployees)}>
                    <a href="#">For Delivery Partners</a>
                </div>
            </div>
            
        </nav>
    );
}

export default NavBar;