
const respContent = ({ response }) => {
  // Display the response here
  // You can customize this to suit your needs
  return (
    <div>
      <h2>API Response:</h2>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
};


export default respContent;
