import { useNavigate, useParams } from 'react-router-dom';
import ArticleDetailPage from '../pages/ArticleDetailPage.jsx';

const ArticleDetailRoute = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

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
  return <ArticleDetailPage onNavigate={onNavigate} slug={slug} />;
};

export default ArticleDetailRoute;
