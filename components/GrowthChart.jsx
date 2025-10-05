import React from 'react';
import { Card } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function GrowthChart({ growthRecords }) {
  const sortedRecords = [...growthRecords].sort((a, b) => 
    new Date(a.recordDate) - new Date(b.recordDate)
  );

  const data = {
    labels: sortedRecords.map(record => 
      new Date(record.recordDate).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Высота растения (см)',
        data: sortedRecords.map(record => record.height),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Динамика роста растения',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Высота (см)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Дата'
        }
      }
    },
  };

  if (growthRecords.length === 0) {
    return (
      <Card className="p-4 text-center">
        <h5>Нет данных для графика</h5>
        <p className="text-muted">Добавьте записи о росте растения</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <Line data={data} options={options} />
    </Card>
  );
}

export default GrowthChart;