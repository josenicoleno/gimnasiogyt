# GYM GYT - Plataforma de Gestión de Gimnasio

GYM GYT es una aplicación web moderna y completa para la gestión de gimnasios, diseñada para facilitar la administración y mejorar la experiencia tanto de los administradores como de los usuarios.

## 🚀 Características Principales

### Para Administradores
- **Dashboard Administrativo** completo con:
  - Gestión de usuarios y perfiles
  - Administración de ejercicios y categorías
  - Control de máquinas y equipamiento
  - Gestión de rutinas personalizadas
  - Sistema de posts y comentarios
  - Configuraciones del sistema

### Para Usuarios
- **Perfil Personal** con:
  - Registro de rutinas personales
  - Seguimiento de récords personales
  - Sistema de comentarios y feedback
  - Escáner QR para acceso rápido
  - Historial de ejercicios

### Características Generales
- Autenticación segura con OAuth
- Interfaz responsive con Tailwind CSS
- Integración con WhatsApp para comunicación
- Conexión con redes sociales
- Tema personalizable (claro/oscuro)
- Sistema de roles y permisos

## 🛠️ Tecnologías Utilizadas

- **Frontend**:
  - React.js
  - Tailwind CSS
  - Context API para gestión de estado
  - React Router para navegación

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB
  - JWT para autenticación

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/josenicoleno/gimnasiogyt.git
cd gimnasiogyt
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_jwt
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🌐 Despliegue

El proyecto está configurado para ser desplegado en Netlify. La configuración de despliegue se encuentra en el directorio `.netlify/`.

## 📝 Estructura del Proyecto

```
gimnasiogyt/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/        # Páginas de la aplicación
│   │   └── ...
├── api/                   # Backend Node.js
│   ├── controllers/      # Controladores
│   ├── models/          # Modelos de MongoDB
│   └── ...
├── .netlify/             # Configuración de Netlify
└── ...
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📧 Contacto

Para cualquier consulta o sugerencia, no dudes en contactarnos a través de:
- Email: [josenicoleno@hotmail.com]
- WhatsApp: [+393428360088]

---

Hecho con ❤️ por {José Nicoleno}