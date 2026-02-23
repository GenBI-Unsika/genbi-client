import { useNavigate, useParams } from 'react-router-dom';
import ProkerDetailPage from '../pages/ProkerDetailPage.jsx';

const ProkerDetailRoute = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const onNavigate = (key) => {
    switch (key) {
      case 'home':
        return navigate('/');
      case 'proker':
        return navigate('/proker');
      default:
        return;
    }
  };

  return <ProkerDetailPage onNavigate={onNavigate} eventId={eventId} />;
};

export default ProkerDetailRoute;
