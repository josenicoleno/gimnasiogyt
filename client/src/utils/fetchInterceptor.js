import Swal from "sweetalert2";
import { store } from "../redux/store.js";
import { signoutSuccess } from "../redux/user/userSlice";

const originalFetch = window.fetch;

window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    
    // Clonar la respuesta antes de consumirla
    const clonedResponse = response.clone();

    if (response.status === 401) {
      const data = await clonedResponse.json();

      if (
        data.message === "TOKEN_EXPIRED" ||
        data.message === "TOKEN_INVALID" ||
        data.message === "TOKEN_REQUIRED"
      ) {
        // Limpiar el estado del usuario usando el store directamente
        store.dispatch(signoutSuccess());

        // Redirigir al login
        /* window.location.href = '/sign-in'; */
        
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

        Toast.fire({
          icon: 'warning',
          title: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
        });
      }
    }

    return response;
  } catch (error) {
    console.error('Error en fetch interceptor:', error);
    return Promise.reject(error.message || 'Ocurrió un error en la petición');
  }
};
