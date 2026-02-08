import { useNavigate, useParams } from 'react-router-dom';
import EventDetailPage from '../pages/EventDetailPage.jsx';

const EventDetailRoute = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const onNavigate = (key) => {
    switch (key) {
      case 'home':
        return navigate('/');
      case 'events':
        return navigate('/events');
      case 'event-registration':
        return navigate(`/events/${eventId}/register`);
      default:
        return;
    }
  };

  return <EventDetailPage onNavigate={onNavigate} eventId={eventId} />;
};

export default EventDetailRoute;
