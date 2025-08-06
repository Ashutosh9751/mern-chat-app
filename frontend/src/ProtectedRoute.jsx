// components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.userInfo);

  if (!user || !user.userId || !user.username || !user.dp) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
