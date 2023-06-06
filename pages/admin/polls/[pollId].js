  import React from 'react';
  import { useRouter } from 'next/router';
  import { Bar } from 'react-chartjs-2';
  import { BarController, BarElement, LinearScale, CategoryScale, Chart } from 'chart.js';



  // Register the LinearScale with Chart.js

  Chart.register(BarController, BarElement, LinearScale, CategoryScale);


  const PollPage = () => {
    const router = useRouter();
    const { pollid } = router.query;

    // Fetch poll details based on pollid and populate the poll object

    const poll = {
      id: pollid,
      question: 'What is your favorite color?',
      options: [
        { id: 1, text: 'Red', votes: 10 },
        { id: 2, text: 'Blue', votes: 15 },
        { id: 3, text: 'Green', votes: 8 },
      ],
    };

    // Function to handle deletion of the poll
    const handleDelete = () => {
      // Delete the poll logic

      // After deletion, navigate back to the admin page
      router.push('/admin');
    };

    // Prepare the data for the chart
    const chartData = {
      labels: poll.options.map((option) => option.text),
      datasets: [
        {
          label: 'Votes',
          data: poll.options.map((option) => option.votes),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };

    // Configure the options for the chart
    const chartOptions = {
      type: 'bar',
      scales: {
        x: {
          type: 'category',
          labels: poll.options.map((option) => option.text),
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    };
    
    return (
      <div>
        <h1>Poll Details</h1>
        <h2>Question: {poll.question}</h2>

        {/* Render poll options with vote counts */}
        <ul>
          {poll.options.map((option) => (
            <li key={option.id}>
              Option: {option.text}, Votes: {option.votes}
            </li>
          ))}
        </ul>

        {/* Chart for displaying the poll results */}
        <div>
          <h3>Poll Results</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Button for deleting the poll */}
        <button onClick={handleDelete}>Delete Poll</button>
      </div>
    );
  };

  export default PollPage;