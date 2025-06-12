import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoutes() {
    const { currentUser } = useSelector(state => state.user);
    const location = useLocation();
    
    if (!currentUser) {
        // Guardar la URL completa incluyendo query parameters
        const fullPath = location.pathname + location.search;
        localStorage.setItem('redirectPath', fullPath);
        return <Navigate to='/sign-in' />;
    }
    
    return <Outlet />;
}
