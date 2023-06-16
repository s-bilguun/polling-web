import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Header from '../../Header';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Result = () => {
const router = useRouter();
const { id } = router.query;

// Replace with your result data logic
const initialPollResult = {
id,
question: 'What is your favorite color?',
results: [
{ answer: 'Red', count: 10 },
{ answer: 'Blue', count: 15 },
{ answer: 'Green', count: 5 },
],
};

// State for poll result
const [pollResult, setPollResult] = useState(initialPollResult);

// Extract answers and counts for the bar chart
const answerLabels = pollResult.results.map((result) => result.answer);
const answerCounts = pollResult.results.map((result) => result.count);

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
    <h1 className="text-3xl font-bold mb-4">Poll Result</h1>

    <h2 className="text-xl font-bold mb-2 poll-question">{pollResult.question}</h2>

    <div className="chart-container">
        <div className="chart">
            <ApexChart options={barChartOptions} series={barChartSeries} type="bar" height={350} />
        </div>
        <div className="chart">
            <ApexChart options={pieChartOptions} series={pieChartSeries} type="pie" width={350} height={250} />
        </div>
    </div>

    <div className="result-buttons">
        <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleGoBack}>
            Go Back
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleRefresh}>
            Refresh Results
        </button>
    </div>
</div>
);
};

export default Result;
