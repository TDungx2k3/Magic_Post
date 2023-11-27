import clsx from "clsx";
import style from "./Login.module.scss";
import loginBanner from "../../assets/images/loginBanner.png";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../App";

function Login() {
  const navigate = useNavigate();
  // Nhận các thông tin được truyền xuống từ App
  // isLogin để lưu trữ thông tin xem người dùng đã đăng nhập hay chưa
  // setIsLogin là hàm thay đổi trạng thái true/false của isLogin
  // userInfo dùng để lưu thông tin của người dùng khi đăng nhập
  const { isLogin, setIsLogin, userInfo, setUserInfo} = useContext(LoginContext)

  const [passHide, setPassHide] = useState(false); // Trạng thái ẩn/hiện của mật khẩu

  // input phone and password
  const [inputs, setInputs] = useState({
    phone: "",
    password: "",
  });

  let [message, setMessage] = useState("");

  let phoneIn = document.querySelector("." + style.phoneNumberInput); // Element: input điền số điện thoại
  let passIn = document.querySelector("." + style.passInput); // Element: input điền mật khẩu
  let loginBtnRef = useRef();

  // Kiểm tra xem có đúng là số điện thoại không. Dùng để hiển thị lỗi khi blur ra ngoài vùng nhập
  const [isPhone, setIsPhone] = useState(true);
  // Kiểm tra xem có đúng là mật khẩu không. Dùng để hiển thị lỗi khi blur ra ngoài vùng nhập
  const [isPass, setIsPass] = useState(true);


  // Khi message thay đổi thì kiểm tra xem message là gì
  // Nếu message là 'Login successful' nghĩa là đăng nhập thành công
  // Khi đó thay đổi trạng thái đăng nhập isLogin = true
  // Ngược lại hiển thị ra lỗi
  useEffect(() => {
    if (message === "Login successfully") {
      setIsLogin((prev) => {
        prev = true;
        return true;
      });
      if (isLogin === true) {
        loginBtnRef.current.click();
        // loginBtnRef.current.click();
      } else {
        setIsLogin(true);
      }
    } else {
      if (message !== "") {
        alert(message);
        setMessage("");
      }
    }
  }, [message, isLogin]);

  // Sau khi blur ra ngoài vùng điền điện thoại thì kiểm tra xem có đúng là số điện thoại hay không
  // Nếu đúng thì isPhone = true tương đương với đây là số điện thoại
  // Ngược lại thì đây không phải số điện thoại
  // Đúng ròi
  function handlePhoneBlur() {
    if (phoneIn) {
      var phoneno = /^\d{10}$/;
      if (phoneIn.value.match(phoneno)) {
        setIsPhone(true);
      } else {
        setIsPhone(false);
      }
    } else {
      phoneIn = document.querySelector("." + style.phoneNumberInput);
      handlePhoneBlur();
    }
  }

  // Sau khi blur ra ngoài vùng điền mật khẩu thì kiểm tra xem có đúng là mật khẩu hay không
  // Nếu đúng thì isPass = true tương đương với đây là mật khẩu hợp lệ
  // Ngược lại thì đây không phải mật khẩu hợp lệ
  // Đúng ròi
  function handlePassBlur() {
    if (passIn) {
      if (passIn.value.length >= 6) {
        setIsPass(true);
      } else {
        setIsPass(false);
      }
    } else {
      passIn = document.querySelector("." + style.passInput);
      handlePassBlur();
    }
  }

  // Xử lý khi bấm vào ẩn/hiện mật khẩu
  // Đúng ròi
  function handleHide() {
    // console.log(passHide);
    // console.log(passIn);
    setPassHide(!passHide);
    if (!passHide) {
      passIn.type = "text";
    } else {
      passIn.type = "password";
    }
  }

  // Xử lý khi thay đổi lúc nhập các ô input
  // Đúng ròi
  const handleChange = (e) => {
    setInputs((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  // Xử lý khi nhấn nút submit xác nhận đăng nhập
  // Đầu tiên call API để nhận về các thông tin cần thiết của người dùng và message khi đăng nhập
  const handleSubmit = async (e) => {
    try {
      await axios
        .post("http://localhost:8080/account/login", inputs)
        .then((response) => {
          // console.log(response);
          let checkResponseMessage = response.data.message;
          if(checkResponseMessage === 'Login successfully') {
            // console.log(response.data.accounts.account_id);
            // console.log(response.data.accounts.account_name);
            setUserInfo({
              uId: response.data.accounts.account_id,
              uName: response.data.accounts.account_name,
              uPhone: inputs.phone,
              uPassword: response.data.accounts.account_password,
              uRole: response.data.accounts.role_id,
              uUnit: response.data.accounts.unit
            });

            localStorage.setItem('isLogin', JSON.stringify(isLogin));
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            // alert("Login successfully");
          }
          setMessage(response.data.message);
          // console.log(message);
          //alert(message);
        })
        .catch((err) => {
          console.log(err);
          message = "Server error!";
        });
    } catch (err) {
      console.log(err.respone.data);
    }
  };

  // Xử lý khi enter ở các input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handlePassReplication();
    }
  };

  // Dùng để kiểm tra xem các input có lỗi gì không. Nếu có thì không xử lý kiểm tra đăng nhập
  function handlePassReplication() {
    handlePhoneBlur();
    handlePassBlur();
    if (isPass && isPhone && inputs.phone !== "" && inputs.password !== "") {
      handleSubmit();
    }
  }

  // test
  function submit() {
    console.log(inputs);
  }

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
            <input
              className={clsx(style.phoneNumberInput, {
                [style.invalidBorder]: !isPhone,
              })}
              type="text"
              placeholder="Enter your phone"
              name="phone"
              onBlur={handlePhoneBlur}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setIsPhone(true);
              }}
              onChange={handleChange}
            />

            <div className= {style.errContainer}>
              <p className= {clsx({[style.errMessage] : isPhone} )}>Invalid phone number</p>
            </div>
          </section>
          <section className={style.userInputContainer}>
            <div>
              <label htmlFor={style.passInput}>Password</label>
            </div>
            <input
              className={clsx(style.passInput, {[style.invalidBorder] : !isPass})}
              type="password"
              placeholder="Enter your password"
              name="password"
              onBlur={handlePassBlur}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setIsPass(true);
              }}
              onChange={handleChange}
            />
            <i className={clsx(style.hiddenPass, "ti-eye",)} onClick={handleHide}></i>

            <div className= {style.errContainer}>
              <p className= {clsx({[style.errMessage] : isPass} )}>Invalid password</p>
            </div>
          </section>

          <section>
            <Link to="/">
              <button className={style.submitSignInBtn} ref={loginBtnRef}
              onClick={ (e) => {
                handlePassReplication();
                if(message !== "Login successfully") {
                  e.preventDefault();
                }
                else {
                  window.scrollTo(0,0);
                }
              }}
              >SIGN IN</button>
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
