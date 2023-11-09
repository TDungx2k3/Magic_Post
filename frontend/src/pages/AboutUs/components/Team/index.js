import clsx from "clsx";
import style from "./Team.module.scss";

function Team() {
    return (
        <div className={clsx(style.container)}>
            <h1>Organization Structure</h1>
            <div className={clsx(style["members-container"])}>
                <div className={clsx(style["specific-member"])}>
                    <img src="https://prodwebimage.ecomexpress.in/Rectangle_1_0deec69ea4.png" alt="" />
                    <div className={clsx(style["name-member"])}>Dang Tien Dung</div>
                </div>
                <div className={clsx(style["specific-member"])}>
                    <img src="https://prodwebimage.ecomexpress.in/Rectangle_1_0deec69ea4.png" alt="" />
                    <div className={clsx(style["name-member"])}>Truong Quang Dat</div>
                </div>
                <div className={clsx(style["specific-member"])}>
                    <img src="https://prodwebimage.ecomexpress.in/Rectangle_1_0deec69ea4.png" alt="" />
                    <div className={clsx(style["name-member"])}>Nguyen Cao Duc</div>
                </div>
            </div>
        </div>
    );
}

export default Team;
