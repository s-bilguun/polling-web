import { useRouter } from 'next/router';
import PollDetails from '../PollDetails';

const Poll = () => {
  const router = useRouter();
  const { id } = router.query;

  return <PollDetails id={id} />;
};

export default Poll;
