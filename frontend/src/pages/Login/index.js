import clsx from "clsx";
import style from "./Login.module.scss";
import loginBanner from "../../assets/images/loginBanner.png";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className={clsx(style.loginContainer)}>
      <div className={clsx(style.loginBannerImg)}>
        <img className={style.loginImg} src={loginBanner} alt=""></img>
      </div>
      <div className={clsx(style.loginContent)}>
        <div>
          <h1>Login</h1>
          <section className={style.userInputContainer}>
            <div>
              <label htmlFor={style.phoneNumberInput}>Phone</label>
            </div>
            <input className={style.input} />
          </section>
          <section className={style.userInputContainer}>
            <div>
              <label htmlFor={style.passInput}>Password</label>
            </div>
            <input className={style.input}/>
          </section>

          <section>
            <Link to="/">
              <button className={style.submitSignInBtn}>SIGN IN</button>
            </Link>
            <p className={style.contact}>
              New to VnExpress?
              <Link to="/"> Contact with manager</Link>
            </p>
            <p className={style.copyright}>Copyright © 2023 VnExpress. </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Login;
