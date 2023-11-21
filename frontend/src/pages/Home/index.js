import axios from "axios";
import { Fragment } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { LoginContext } from "../../App";
import { useContext } from "react";
import clsx from"clsx";
import style from "./Home.module.scss";
import parcelsIcon from "../../assets/icons/parcels_since_inception_50be16b3a9.svg";
import inventoriesIcon from "../../assets/icons/Delivery_center_7ecfe7c729.svg";
import locationIcon from "../../assets/icons/cities_and_town_c0339d4e15.svg";
import memberIcon from "../../assets/icons/people_e34061653e.svg";
import VNMapIcon from "../../assets/icons/vnMap.png";
import shippingService from "../../assets/icons/shipping_services_afa97d2a96.svg";
import fulfillmentService from "../../assets/icons/fulfillment_services_53d479b72c.svg";
import ecomService from "../../assets/icons/magnum_48dfaa6c33.svg";
import digitalService from "../../assets/icons/digital_services_b4b4505fa3.svg";
function Home() {
    const { isLogin, setIsLogin, userInfo } = useContext(LoginContext);

    const getMatchesInfo = async (e) => {
        try {
            await axios.get("http://localhost:8080/account/showAllAccounts")
            .then((response) => {
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
        }
        catch(err) {
            console.log(err.respone.data);
        }
    }

    return (
        <Fragment>
            <div id="top"></div>
            <Header />
            {/* Infomation about system */}
            
            <div className={clsx(style.infoContainer)} data-aos="zoom-in-up"
            data-aos-duration="1500" >
                <div className={clsx(style.blueLayer)}></div>
                <h1 data-aos="fade-up" data-aos-duration="2000">Enablers for your business growth</h1>
                <div className={clsx(style.colsContainer)} >
                    <div className={clsx(style.col1)}>
                        <div className={clsx(style.subCol)}>
                            <img src= {parcelsIcon} alt="" className={clsx(style.imgIcon)} />
                            <div className={clsx(style.info)} onClick={getMatchesInfo}>
                                <h2>1.6+ million</h2>
                                <p>parcel since inception</p>
                            </div>
                        </div>

                        <div className={clsx(style.subCol)}>
                            <img src= {inventoriesIcon} alt="" className={clsx(style.imgIcon)} />
                            <div className={clsx(style.info)}>
                                <h2>3+</h2>
                                <p>Inventories center</p>
                            </div>
                        </div>
                    </div>

                    <div className={clsx(style.col2)}>
                        <div className={clsx(style.subCol)}>
                            <img src= {locationIcon} alt="" className={clsx(style.imgIcon)} />
                            <div className={clsx(style.info)}>
                                <h2>63+</h2>
                                <p>cities and towns</p>
                            </div>
                        </div>

                        <div className={clsx(style.subCol)}>
                            <img src= {memberIcon} alt="" className={clsx(style.imgIcon)} />
                            <div className={clsx(style.info)}>
                                <h2>1000+</h2>
                                <p>employees and assocates</p>
                            </div>
                        </div>
                    </div>

                    <div className={clsx(style.col3)}>
                        <div className={clsx(style.subCol)}>
                            <img src= {VNMapIcon} alt="" className={clsx(style.imgIcon)} />
                            <div className={clsx(style.info)}>
                                <h2>99%</h2>
                                <p>Vietnamese households covered</p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>

            <div id="topService"></div>
            <div className={clsx(style.servicesContainer) } data-aos="zoom-in-up">
                <h1>How our services help your business?</h1>
                <div className={clsx(style.services) }>
                    <div className={clsx(style.shipping) }>
                        <img src={shippingService} alt="" className={clsx(style.serviceImg) }/>
                        <h2>Shipping Services</h2>
                        <ul>
                            <li>Tech-enabled pick-up and delivery services to whole of India</li>
                            <li>Supported by 150+ gateways, hubs and fulfillment centers across 2,700+ cities</li>
                        </ul>
                        <div className={clsx(style.knowMoreBtn)}>Know More <span className="ti-angle-double-right"></span></div>
                    </div>
            
                    <div className={clsx(style.fulfillment) }>
                        <img src={fulfillmentService} alt="" className={clsx(style.serviceImg) }/>
                        <h2>Fulfillment Services</h2>
                        <ul>
                            <li>Tailor-made fulfillment and storage solutions for retail, D2C brands, grocery, e-commerce, consumer goods, consumer electronics, and other industrial categories</li>
                            <li>60+ fulfillment centers strategically located across India</li>
                        </ul>
                        <div className={clsx(style.knowMoreBtn)}>Know More <span className="ti-angle-double-right"></span></div>
                    </div>
            
                    <div className={clsx(style.ecom) }>
                        <img src={ecomService} alt="" className={clsx(style.serviceImg) }/>
                        <h2>Ecom Magnum</h2>
                        <ul>
                            <li>Connect all channels, SKUs and warehouses, and centralise your inventory</li>
                            <li>All orders processed through one platform with features to create custom product combos, real-time dashboarding and reconciliation</li>
                        </ul>
                        <div className={clsx(style.knowMoreBtn)}>Know More <span className="ti-angle-double-right"></span></div>
                    </div>
            
                    <div className={clsx(style.digital) }>
                        <img src={digitalService} alt="" className={clsx(style.serviceImg) }/>
                        <h2>Digital Services</h2>
                        <ul>
                            <li>Fast and secure e-KYC and biometric services</li>
                            <li>Document verification and cash collection through 3,000+ delivery offices</li>
                        </ul>
                        <div className={clsx(style.knowMoreBtn)}>Know More <span className="ti-angle-double-right"></span></div>
                    </div>
                </div>
                
            </div>


            <Footer />
        </Fragment>
    );
}

export default Home;