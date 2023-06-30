  import React, { useState, useEffect } from 'react';
  import dynamic from 'next/dynamic';
  import { useRouter } from 'next/router';
  import Header from '../../Header';
  import axios from 'axios'
  const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

  const Result = ( {id }) => { 
    const router = useRouter();
    const { id: queryId } = router.query;

  const [poll, setPoll] = useState();
    const [answers, setAnswers] = useState([]);
    const [attendance, setAttendance] = useState([]);
    useEffect(() => {
      if (id) {
        axios
          .get(`http://localhost:8001/poll/${id}`)
          .then((res) => {
            const { asuult } = res.data;
            setPoll(res.data);
            console.log(asuult);
          })
          .catch((error) => {
            console.log(error.response.data.error);
          });
      }
      
      const fetchAnswer = async () => {
        try {
          const response = await fetch(`http://localhost:8001/answers/${id}/ans`);
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setAnswers(data);
          } else {
            console.error("Failed to fetch Poll answer");
          }
        } catch (error) {
          console.error("Error fetching poll answer:", error);
        }
      }
      const fetchAttendance = async () => {
        const response = await fetch(`http://localhost:8001/attendance/${id}`);
        if (response.ok) {
          const data = await response.json();
          setAttendance(data);
        } else {
          console.error("failed to fetch attendance");
        }
      };
      
      fetchAnswer();
      fetchAttendance();
    }, [id]);


  const answerLabels = answers;
  const answerCounts = attendance;

  // Define bar chart options and data
  const barChartOptions = {
  chart: {
  type: 'bar',
  },
  xaxis: {
  categories: answerLabels,
  },
  };

  const barChartSeries = [
  {
  name: 'Votes',
  data: answerCounts,
  },
  ];

  // Extract answers and counts for the pie chart
  const pieChartOptions = {
  chart: {
  type: 'pie',
  },
  labels: answerLabels,
  
  };

  const pieChartSeries = answerCounts;

  const handleGoBack = () => {
  const pollId = router.query.id;
  router.push(`/poll/${pollId}`);
  };

  const handleRefresh = async () => {
  try {
  // Simulating API call to fetch new data
  const updatedPollResult = await fetchPollResult(); // Replace with your API call

  // Update the poll result state with new data
  setPollResult(updatedPollResult);
  } catch (error) {
  console.error('Error refreshing results:', error);
  }
  };

  const fetchPollResult = async () => {
  // Simulating API call to fetch new data
  return new Promise((resolve) => {
  setTimeout(() => {
  const updatedResult = {
  id,
  question: 'What is your favorite color?',
  results: [
  { answer: 'Red', count: Math.floor(Math.random() * 20) },
  { answer: 'Blue', count: Math.floor(Math.random() * 20) },
  { answer: 'Green', count: Math.floor(Math.random() * 20) },
  ],
  };

  resolve(updatedResult);
  }, 2000); // Simulate delay for API call
  });
  };

  return (
  <div className="container mx-auto p-4">
      <Header />
      <h1 className="text-3xl font-bold mb-4">Санал асуулгын үр дүн:</h1>

      <h2 className="text-xl font-bold mb-2 poll-question"></h2>
          
      <div className="chart-container">
          <div className="chart">
              <ApexChart options={barChartOptions} series={barChartSeries} type="bar" height={450} width={350} />
          </div>
          <div className="chart">
              <ApexChart options={pieChartOptions} series={pieChartSeries} type="pie" width={450} height={350} />
          </div>
      </div>

      <div className="result-buttons">
          <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleGoBack}>
             Буцах
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleRefresh}
              >
              Refresh Results
          </button>
      </div>
  </div>
  );
  };

  Result.getInitialProps = async (ctx) => {
    const { id } = ctx.query;
    return { id };
  };

  export default Result;