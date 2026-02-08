import { useParams } from 'react-router-dom';
import RegistrationPage from '../pages/RegistrationPage.jsx';

const RegistrationRoute = () => {
  const { eventId } = useParams();
  return <RegistrationPage eventId={eventId} />;
};

export default RegistrationRoute;
