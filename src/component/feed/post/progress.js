import React, { useState, useEffect } from 'react';

const CircularProgressBar = ({ progress }) => {
 
  const normalizedProgress = Math.round(progress);
  
  // Circle settings
  const radius = 50;  // Radius of the circle
  const strokeWidth = 10;  // Stroke width for the circle

  // Circumference of the circle
  const circumference = 2 * Math.PI * radius;
  
  // The offset of the stroke based on progress
  const offset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#e6e6e6"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#4db8ff" // Progress color
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)" // Rotate to start from the top
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="20"
        fill="#333"
      >
        {normalizedProgress}%
      </text>
    </svg>
  );
};
export default CircularProgressBar;