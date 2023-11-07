import React from "react";
import clsx from "clsx";
import style from "./AboutEcomExpress.module.scss";

function AboutEcomExpress() {
    return (
        <div class={clsx(style.container)}>
            <h1>About Ecom Express</h1>
            <div class={clsx(style.concept)}>
                <p>Ecom Express is a new company established in 2021 with the purpose of providing transportation services. The company's headquarters is located at 144 Xuan Thuy, Cau Giay, Hanoi City. </p>
                <p>Ecom Express is currently present across the country with 63 transaction positions, covering all provinces and cities and 3 gathering positions corresponding to the North, Central and South. We guarantee that when using the service, you will not encounter any difficulties, and we also guarantee the security of customer information because we use information encryption.</p>
                <p>After 3 years of establishment and operation, along with an experienced management team, Ecom Express has been serving customers in the best way possible, helping everyone feel secure in delivering their goods to Ecom. Express. In addition, Ecom Express also tries to learn and develop continuously to become the best service on the current market.</p>
            </div>
        </div>
    );
}

export default AboutEcomExpress;