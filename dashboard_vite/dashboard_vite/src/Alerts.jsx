import React, { useEffect, useState } from 'react';

const Alerts = ({ data, threshold }) => {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    if (data.consumo > threshold){
        setAlerts((prevAlerts) => [...prevAlerts, data]); // Adds the new alert to the list
    }
  }, [data])

    return (
    <div>
      <h3>Alertas de Picos de Consumo</h3>
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}> Alerta: {alert.name} - Consumo: {alert.consumo.toFixed(2)} kWh</li>
          ))}
        </ul>
    </div>
  );
};
export default Alerts;
