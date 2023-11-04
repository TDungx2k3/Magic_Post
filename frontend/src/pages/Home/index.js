import { Fragment } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer"
import clsx from"clsx"
import style from "./Home.module.scss"
import parcelsIcon from "../../assets/icons/parcels_since_inception_50be16b3a9.svg"
import inventoriesIcon from "../../assets/icons/Delivery_center_7ecfe7c729.svg"
import locationIcon from "../../assets/icons/cities_and_town_c0339d4e15.svg"
import memberIcon from "../../assets/icons/people_e34061653e.svg"
import VNMapIcon from "../../assets/icons/vnMap.png"
function Home() {
    return (
        <Fragment>
            <Header />
            <div className={clsx(style.infoContainer)}>
                <h1>Enablers for your business growth</h1>
                <div className={clsx(style.colsContainer)}>
                    <div className={clsx(style.col1)}>
                        <div className={clsx(style.subCol)}>
                            <img src= {parcelsIcon} alt="" className={clsx(style.imgIcon)} />
                            <div className={clsx(style.info)}>
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
            <Footer />
        </Fragment>
    );
}

export default Home;