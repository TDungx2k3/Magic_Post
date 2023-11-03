import clsx from "clsx";
import AOS from 'aos';
import style from "./Footer.module.scss";
import facebookImage from "../../assets/images/facebook.png"
import instagramImage from "../../assets/images/instagram.png"

function Footer() {
    return (
        <div className={clsx(style.footerContainer)}>
            <div className={clsx(style.aboutUs)}>
                About Us
                <span>
                    <a href="#">About Ecom Express</a>
                </span>
                <span>
                    <a href="#">Our Journey</a>
                </span>
                <span>
                    <a href="#">Team</a>
                </span>
                <span>
                    <a href="#">Career</a>
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