import style from "./Slider.module.scss"
import clsx from 'clsx';
import img1 from '../../assets/images/slideB1.png'
import { Fragment, useEffect, useRef, useState } from "react";

const MAX_INDEX = 2; // số lượng slide tối đa
let imageSrcs = [img1,img1]

function Slider() {
    const [index, setIndex] = useState(0); // số thứ tự cua slide
    let autoIndex = 0; // dùng để fix setTimeOut để không tạo ra nhiều setTimeOut
    
    let timerSet = useRef(); // Chỉ tồn tại 1 timer

    // Thay đổi timer sau mỗi lần index thay đổi, tạo thêm 1 lần showNextSlide sau 2 giây
    useEffect(() => {
        timerSet.current = setTimeout(() => {
            showNextSlide();
        }, 2000);
        
    }, [index])

    function showNextSlide() {
        clearTimeout(timerSet.current)
        if(index !== autoIndex) { 
            autoIndex = index;
            
            showNextSlide();
        }
        else if(index === MAX_INDEX - 1) {
            setIndex(0);
            autoIndex = 0;
        }
        else {
            autoIndex++;
            setIndex(index + 1);
        }
    }

    function showPrevSlide() {
        clearTimeout(timerSet.current)
        if(index !== autoIndex) {
            autoIndex = index;
            return;
        }
        if(index === 0) {
            setIndex(MAX_INDEX - 1);
            autoIndex = MAX_INDEX - 1;
        }
        else {
            setIndex(index => index -1);
            autoIndex--;
        }
    }

    return(
        <Fragment>
            <div className={clsx(style.sliderContainer)}>
                {
                    imageSrcs.map((pathImg, pathIndex) => {
                        return (
                            <div key={pathIndex} className={clsx(style.sliderPage, style.fadeAnimation, {[style.hidden] : (index !== pathIndex)})} >
                                <img className={style.sliderImg} src={pathImg} alt="" />
                            </div>
                        );
                        
                    })
                }
                
                <div className={clsx(style.prevBtn, "ti-angle-left")} onClick={showPrevSlide}></div>
                <div className={clsx(style.nextBtn, "ti-angle-right")} onClick={showNextSlide}></div>

                <div style={{textAlign: 'center'}}>
                    {
                        imageSrcs.map((pathImg, pathIndex) => {
                            return (
                                <span key={pathIndex} className={clsx(style.dot, {[style.dotActive] : index === pathIndex})} onClick={() => {
                                    setIndex(pathIndex)
                                    clearTimeout(timerSet.current)
                                }}></span>
                            );
                        })
                    }
                </div>
            </div>
        </Fragment>
        
    );

}

export default Slider;