import clsx from "clsx";
import AOS from 'aos';
import style from "./Footer.module.scss";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink, animateScroll as scroll, scroller } from 'react-scroll';
import facebookImage from "../../assets/images/facebook.png";
import instagramImage from "../../assets/images/instagram.png";

function Footer() {
    const scrollToElement = (elementId) => {
        setTimeout(() => {
            scroll.scrollTo(document.getElementById(elementId).offsetTop, {
                spy: true,
                smooth: true,
                duration: 500,
            });
        }, 10);
    };

    return (
        <div id="footer" className={clsx(style.footerContainer)}>
            <div className={clsx(style.aboutUs)}>
                About Us
                <span>
                    <RouterLink to="/about-us" onClick={() => scrollToElement('about-ddd-express')}>
                        About DDD Express
                    </RouterLink>
                </span>

                <span>
                    <RouterLink to="/about-us" onClick={() => scrollToElement('our-journey')}>
                        Our Journey
                    </RouterLink>

                </span>

                <span>
                    <RouterLink to="/about-us" onClick={() => scrollToElement('team')}>
                        Team
                    </RouterLink>

                </span>
                <span>
                    <RouterLink to="/about-us" onClick={() => scrollToElement('career')}>
                        Career
                    </RouterLink>
                </span>
            </div>

            <div className={clsx(style.serviceAndDev)}>
                <div>
                    Services
                    <div>
                    <RouterLink to = "/"
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
                    >Our services</RouterLink>
                    </div>
                </div>

                <div>
                    Developers
                    <div>
                        <RouterLink to = "/api-dev">API reference</RouterLink>
                    </div>
                </div>
            </div>

            <div className={clsx(style.office)}>
                Office
                <span>
                    <a href="#">Our office</a>
                </span>
            </div>

            <div className={clsx(style.socialMedia)}>
                Follow us on
                <span className={clsx(style.facebook)}>
                    <a href="">
                        <img src={facebookImage} alt="" />
                    </a>
                </span>
                <span className={clsx(style.instagram)}>
                    <a href="">
                        <img src={instagramImage} alt="" />
                    </a>
                </span>
            </div>
        </div>
    );
}

export default Footer;
