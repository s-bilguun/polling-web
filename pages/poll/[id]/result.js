import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Header from "../../Header";
import axios from "axios";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Result = () => {
  const router = useRouter();
  const { id } = router.query;
  const [poll, setPoll] = useState();
  const [answers, setAnswers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8001/poll/${id}`)
        .then((res) => {
          setPoll(res.data);
          console.log(res.data);
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error.response.data.error);
        });
    }
    const fetchAnswer = async () => {
      try {
        const response = await fetch(`http://localhost:8001/answers/${id}`);
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
    };
    const fetchAttendance = async () => {
      const response = await fetch(`http://localhost:8001/attendance/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAttendance(data);
      } else {
        console.error("failed to fetch comments");
      }
    };
    fetchAnswer();
    fetchAttendance();
  }, [id]);

  // Replace with your result data logic
  const initialPollResult = {
    question: poll,
    results: [
      {
        answer: answers,
        count: attendance
      },
    ],
  };

  // State for poll result
  const [pollResult, setPollResult] = useState(initialPollResult);

  // // Extract answers and counts for the bar chart
  const answerLabels = pollResult.results.map((result) => result.answer);
  const answerCounts = pollResult.results.map((result) => result.count);
  // const answerLabels = answers;
  // const answerCounts = attendance;
  // Define bar chart options and data
  const barChartOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: answerLabels,
    },
  };

  const barChartSeries = [
    {
      name: "Votes",
      data: answerCounts,
    },
  ];

  // Extract answers and counts for the pie chart
  const pieChartOptions = {
    chart: {
      type: "pie",
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
      console.error("Error refreshing results:", error);
    }
  };

  const fetchPollResult = async () => {
    // Simulating API call to fetch new data
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedResult = {
          id,
          question: "What is your favorite color?",
          results: [
            { answer: "Red", count: Math.floor(Math.random() * 20) },
            { answer: "Blue", count: Math.floor(Math.random() * 20) },
            { answer: "Green", count: Math.floor(Math.random() * 20) },
          ],
        };

        resolve(updatedResult);
      }, 2000); // Simulate delay for API call
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Header />
      <h1 className="text-3xl font-bold mb-4">Poll Result</h1>

      <h2 className="text-xl font-bold mb-2 poll-question">
        {pollResult.question}
      </h2>

      <div className="chart-container">
        <div className="chart">
          <ApexChart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height={350}
          />
        </div>
        <div className="chart">
          <ApexChart
            options={pieChartOptions}
            series={pieChartSeries}
            type="pie"
            width={350}
            height={250}
          />
        </div>
      </div>

      <div className="result-buttons">
        <button
          className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleGoBack}
        >
          Go Back
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRefresh}
        >
          Refresh Results
        </button>
      </div>
    </div>
  );
};

export default Result;
