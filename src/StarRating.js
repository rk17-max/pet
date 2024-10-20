import React from 'react';

const StarRating = ({ rating }) => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= rating ? '#FFD700' : '#ccc' }}>
        ★
      </span>
    );
  }

  return <div>{stars}</div>;
};

export default StarRating;
