import React from 'react';
import './ResultItem.scss';


interface OrderItemProps {
    email: string;
    string: string;
    movie: string;
    seatnumber: number;
    orderdate: string;
  }

  const OrderItem: React.FC< OrderItemProps> = ({ email , movie, seatnumber , orderdate }) => {
  return (
    <div className="result-item">
      <div className="result-item__email">{email}</div>
      <div className="result-item__movie">{movie}</div>
      <div className="result-item__seat-number">{seatnumber}</div>
      <div className="result-item__date">{orderdate}</div>
    </div>
  );
};


export default OrderItem;

