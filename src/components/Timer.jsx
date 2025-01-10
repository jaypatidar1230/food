import React, { useState, useEffect } from 'react';

const Timer = ({ initialTime, onChange }) => {
  const [minutes, setMinutes] = useState(initialTime.minutes);
  const [seconds, setSeconds] = useState(initialTime.seconds);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prevSeconds) => prevSeconds - 1);
      } else if (minutes > 0) {
        setMinutes((prevMinutes) => prevMinutes - 1);
        setSeconds(59);
      } else {
        clearInterval(myInterval);
      }
    }, 1000);
  
    return () => {
      clearInterval(myInterval);
    };
  }, [seconds, minutes]);  // Dependency array triggers an infinite loop
  
  // Only call `onChange` when `minutes` or `seconds` change
  useEffect(() => {
    onChange(minutes, seconds);
  }, [  ]);

  return (
    <div className='text-3xl'>
      {minutes === 0 && seconds === 0 ? null : (
        <h1>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </h1>
      )}
    </div>
  );
};

export default Timer;
