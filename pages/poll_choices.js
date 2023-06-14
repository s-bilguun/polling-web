import PollChoices from './components/PollChoices';

const PollChoicesPage = ({ pollid }) => {
  return <PollChoices pollid={pollid} />;
};

PollChoicesPage.getInitialProps = ({ query }) => {
  const { pollid } = query;
  return { pollid };
};

export default PollChoicesPage;
