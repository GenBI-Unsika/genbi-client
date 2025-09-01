import { useNavigate } from 'react-router-dom';
import ArticleContentPage from '../pages/ArticleContentPage.jsx';

const ArticleContentRoute = () => {
  const navigate = useNavigate();
  const onNavigate = (key) => {
    switch (key) {
      case 'home':
        return navigate('/');
      case 'articles':
        return navigate('/articles');
      default:
        return;
    }
  };
  return <ArticleContentPage onNavigate={onNavigate} />;
};

export default ArticleContentRoute;
