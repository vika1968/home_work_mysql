import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderResults.scss';

const OrderResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchOrderResults = async () => {
      try {
        const response = await axios.get('/orders');
        setResults(response.data);
      } catch (error) {
        console.error('Ошибка при получении результатов заказов:', error);
      }
    };

    fetchOrderResults();
  }, []);

  return (
    <div className="order-results">
      <h2 className="order-results__title">Результаты заказов фильмов</h2>
      <ul className="order-results__list">
        {results.map((result: any) => (
          <li key={result.id} className="order-results__list-item">
            <span>Email: {result.email}</span>
            <span>Movie: {result.movie}</span>
            <span>Seat Number: {result.seatnumber}</span>
            <span>Date: {result.orderdate}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderResults;
