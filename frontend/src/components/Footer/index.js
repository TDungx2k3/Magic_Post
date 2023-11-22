import clsx from "clsx";
import AOS from 'aos';
import style from "./Footer.module.scss";
import { Link as ScrollLink } from 'react-scroll';
import facebookImage from "../../assets/images/facebook.png";
import instagramImage from "../../assets/images/instagram.png";

function Footer() {
    return (
        <div className={clsx(style.footerContainer)}>
            <div className={clsx(style.aboutUs)}>
                About Us
                <span>
                    <ScrollLink to="about-ddd-express" spy={true} smooth={true} duration={500} activeClass={style.activeLink}>
                        About DDD Express
                    </ScrollLink>

                </span>

                <span>
                    <ScrollLink to="our-journey" spy={true} smooth={true} duration={500} activeClass={style.activeLink}>
                        Our Journey
                    </ScrollLink>

                </span>

                <span>
                    <ScrollLink to="team" spy={true} smooth={true} duration={500} activeClass={style.activeLink}>
                        Team
                    </ScrollLink>

                </span>
                <span>
                    <ScrollLink to="career" spy={true} smooth={true} duration={500} activeClass={style.activeLink}>
                        Career
                    </ScrollLink>
                </span>
            </div>

            <div className={clsx(style.serviceAndDev)}>
                <div>
                    Services
                    <div>
                        <a href="#">Our Services</a>
                    </div>
                </div>

                <div>
                    Developers
                    <div>
                        <a href="#">API reference</a>
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
