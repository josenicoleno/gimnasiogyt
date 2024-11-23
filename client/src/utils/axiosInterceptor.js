import axios from "axios";
import { store } from "../redux/store";
import { signoutSuccess } from "../redux/user/userSlice";

export const setupAxiosInterceptors = () => {
  // Agregamos un interceptor para las peticiones
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Modificamos el interceptor de respuesta
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log('Interceptor error:', error.response); // Para debugging
      
      if (error.response?.status === 401) {
        console.log('Error 401 detectado'); // Para debugging
        
        // Limpiar el estado del usuario
        store.dispatch(signoutSuccess());
        
        // Limpiar localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        
        // Redirigir
        window.location.href = "/sign-in";
      }
      return Promise.reject(error);
    }
  );
}; 