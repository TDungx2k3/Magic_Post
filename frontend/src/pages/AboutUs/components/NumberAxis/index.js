import React, { useState } from 'react';
import './NumberAxis.css';

const NumberAxis = () => {
  // Tạo mảng các năm và ghi chú
  const years = [
    { year: 2023, note: "150+ crore parcels delivered since inception" },
    { year: 2022, note: "1 Lakh+ sellers served since inception Launched DIY portal for customers Experienced 3 million parcels peak handling" },
    { year: 2021, note: "Established 3,000 delivery centers" },
    { year: 2020, note: "Foray into Andaman & Nicobar Deployment of country’s largest automated sorter at INDIA-1 center in Bilaspur, Haryana" }
  ];

  const [activeYear, setActiveYear] = useState(null);

  return (
    <div className="number-axis">
      {years.map((item) => (
        <div key={item.year} className="tick">
          <div className={`note ${activeYear === item.year ? '' : 'note-hidden'}`}>
            {item.note}
          </div>

          <div className='years' onClick={() => setActiveYear(item.year)}>
            {item.year}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NumberAxis;
