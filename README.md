# ProyectosJs_Pedro

Este repositorio contiene tres proyectos: un sistema de gestión de videoclub, una Pokédex y un proyecto de para Uploadear archivos. A continuación, se detallan las instrucciones para ejecutar cada proyecto.

## Proyecto Videoclub (proyectocine_bien_entrega)

### Requisitos previos
- Docker y Docker Compose instalados
- Node.js (versión recomendada: 18 o superior)

### Puertos y servicios
- Frontend: http://localhost:5173 (proyectocine:5173)
- Backend API: http://localhost:3000 (proyectocine:3000)
- MongoDB: puerto 27017
- Mongo Express: http://localhost:8081 (mongo-exp:8081)
  - Usuario: admin
  - Contraseña: 123456

### Pasos para ejecutar
1. Navega hasta el directorio del proyecto:
   ```bash
   cd proyectocine_bien_entrega
   ```

2. Construye y levanta los contenedores:
   ```bash
   docker-compose up --build
   ```

### Para detener el proyecto
```bash
docker-compose down
```


## Proyecto Pokédex (pokedex_entrega)

### Requisitos previos
- Docker y Docker Compose instalados
- Node.js (versión recomendada: 18 o superior)

### Puertos y servicios
- Frontend: http://localhost:5173 (pokedex_er:5173)
- Backend API: http://localhost:3000 (pokedex_er:3000)
- MongoDB: puerto 27017
- Mongo Express: http://localhost:8082 (mongo-exp:8081)
  - Usuario: admin
  - Contraseña: 123456

### Pasos para ejecutar
1. Navega hasta el directorio del proyecto:
   ```bash
   cd pokedex_entrega
   ```

2. Construye y levanta los contenedores:
   ```bash
   docker-compose up --build
   ```

### Para detener el proyecto
```bash
docker-compose down
```
### Detalles del proyecto
Es posible que se pueda experimentar un tiempo de carga o espera de al menos de 1 minuto y medio antes de que se carguen los datos de la página web.



## Proyecto Upload  (upload_entrega)

Este proyecto permite la subida de imágenes y el envío de notificaciones por email usando SendGrid.

## Requisitos previos
- Docker y Docker Compose instalados
- Node.js (versión recomendada: 18 o superior)
- Cuenta en SendGrid para el envío de emails

## Configuración inicial

1. Crea un archivo `.env` en la raíz del proyecto:
   ```env
   SENDGRID_API_KEY=SG.EbEJIZP7R4qVf-NYX4mokA.i3okozOf5EPvc2bBPB9JZGdmwhSbsHwUAuyy-"poner clave de abajo"  esta es mi clave de SendGrid cambiala por la tuya si la tienes o usa la mia pero para poder usarla pon esta 
   clave--> "cb2zJc" al final de toda esa key no puedo ponerla junta por que si no sengrid detecta que la key esta publica y la borra
   ```

   > ⚠️ **IMPORTANTE**: Esta clave es mia. En caso de error prueba a usar la tuya.

## Puertos y servicios
- Backend API: http://localhost:3000 (upload_entrega:3000)

## Pasos para ejecutar

1. Navega hasta el directorio del proyecto:
   ```bash
   cd upload_entrega
   ```

2. Asegúrate de que el archivo .env está correctamente configurado

3. Construye y levanta los contenedores:
   ```bash
   docker-compose up --build
   ```

## Para detener el proyecto
```bash
docker-compose down
```

1. Si los emails no se envían:
   - Verifica que la API key de SendGrid sea correcta
   - Comprueba los logs del contenedor para ver posibles errores
   - Asegúrate de que el email destinatario sea válido


