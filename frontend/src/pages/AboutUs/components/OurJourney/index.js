import React, { useState } from 'react';
import clsx from 'clsx';
import style from './OurJourney.module.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';

function OurJourney() {
  const years = [
    { year: 2023, concept: "Our company has expanded its branches nationwide with 63 transaction positions and 3 gathering positions" },
    { year: 2022, concept: "Our company has expanded its branches throughout the North" },
    { year: 2021, concept: "Our company was established" },
  ];

  const [activeYear, setActiveYear] = useState(null);

  return (
    <div className={clsx(style.container)} data-aos="zoom-in-up" id="our-journey">
      <h1>Our Journey</h1>
      <div className={clsx(style['our-journey'])}>
        {years.map((item) => (
          <div key={item.year} className={clsx(style.concept)}>
            <div className={clsx(style.note, { [style['note-hidden']]: activeYear !== item.year })}>
              <p>{item.concept}</p>
            </div>

            <div className={clsx(style.years)} onClick={() => setActiveYear(item.year)}>
              {item.year}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurJourney;
