import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import Alerts from './Alerts';
import AverageConsumption from './AvarageConsumption';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [dauleData, setDauleData] = useState([]);
  const [samborondonData, setSamborondonData] = useState([]);
  const [timeStamps, setTimeStamps] = useState([]);
  const [currentData,setCurrentData] = useState([])
  const chartRef = useRef(null);  // Add a ref for the chart

  // WebSocket setup
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:6789');

    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socket.onmessage = (event) => {
      console.log('Message received:', event.data);

      // Process the incoming message
      const message = event.data.split(', ');
      const timestamp = message[0];
      const city = message[1];
      const consumption = parseFloat(message[2]);
      setCurrentData({
        name: city,
        consumo: consumption,
        time: timestamp
      })

      // Update state with incoming message
      setMessages((prevMessages) => [...prevMessages, event.data]);

      if (city === 'Daule') {
        setDauleData((prevData) => [...prevData, consumption]);
      } else if (city === 'Samborondon') {
        setSamborondonData((prevData) => [...prevData, consumption]);
      }

      // Update timestamps for X-axis
      setTimeStamps((prevTimestamps) => [...prevTimestamps, timestamp]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket closed:', event);
    };

    // Cleanup WebSocket connection when component unmounts
    return () => {
      socket.close();
    };
  }, []);

  // Prepare the data for the chart
  const chartData = {
    labels: timeStamps,
    datasets: [
      {
        label: 'Daule',
        data: dauleData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Samborondon',
        data: samborondonData,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  return (
<div className="dashboard-container">
  <div className="chart-container">
    <Alerts data={currentData} threshold={7}></Alerts>
    <Line ref={chartRef} data={chartData} />
    <AverageConsumption data={dauleData} title={"Daule"}></AverageConsumption>
    <AverageConsumption data={samborondonData} title={"Samborondon"}></AverageConsumption>
  </div>
</div>
  );
};

export default Dashboard;
