import axios from "axios";
import { store } from "../redux/store";
import { signoutSuccess } from "../redux/user/userSlice";
import Swal from 'sweetalert2';

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
    async (error) => {
      if (error.response?.status === 401) {
        // Limpiar el estado del usuario
        store.dispatch(signoutSuccess());
        
        // Limpiar localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        
        // Mostrar notificación
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });

        await Toast.fire({
          icon: 'warning',
          title: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
        });
        
        // Redirigir después de mostrar la notificación
        window.location.href = "/sign-in";
      }
      return Promise.reject(error);
    }
  );
}; 