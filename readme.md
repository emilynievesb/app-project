# API de Gestión Financiera Personal

## Descripción

Esta API permite gestionar las finanzas personales de los usuarios, permitiéndoles registrar, editar y eliminar transacciones, además de visualizar gráficos de resumen financiero como ingresos y egresos por mes, distribución de gastos por categoría, y más. La API está construida con **Node.js** y **Express** y utiliza **MySQL** como base de datos. La autenticación de usuarios se realiza mediante **JWT** (JSON Web Tokens).

## Tecnologías

-   Node.js
-   Express
-   MySQL
-   jsonwebtoken (JWT)
-   bcrypt
-   CORS

## Requisitos

-   Node.js (v14+)
-   MySQL (v5.7+)
-   npm o yarn

## Instalación

1. Clona este repositorio:

    ```bash
    git clone https://github.com/tu-usuario/gestion-financiera.git
    cd gestion-financiera
    ```

2. Instala las dependencias:

    ```bash
    npm install
    ```

3. Configura las variables de entorno en un archivo `.env`:

    ```makefile
    PORT=3000
    DB_HOST=localhost
    DB_USER=tu_usuario
    DB_PASSWORD=tu_contraseña
    DB_NAME=gestion_financiera
    JWT_SECRET=tu_secreto_jwt
    ```

4. Inicializa la base de datos con las tablas requeridas:
   Ejecuta el script SQL proporcionado para crear las tablas de `usuarios`, `transacciones`, `tipos_transaccion` y `categorias`.

5. Inicia el servidor:
    ```bash
    npm run dev
    ```

## Endpoints

### Autenticación

#### Registro de usuario

-   **URL**: `/usuarios/register`
-   **Método**: `POST`
-   **Descripción**: Registra un nuevo usuario en la aplicación.
-   **Cuerpo**:
    ```json
    {
        "nombre": "Juan",
        "apellido": "Pérez",
        "correo": "juan.perez@example.com",
        "username": "juanperez",
        "password": "contrasena_segura"
    }
    ```
-   **Respuesta**:
    -   `201 Created` si el usuario fue creado exitosamente.
    -   `400 Bad Request` si faltan campos o el usuario ya existe.

#### Login de usuario

-   **URL**: `/usuarios/login`
-   **Método**: `POST`
-   **Descripción**: Autentica al usuario y devuelve un JWT en una cookie.
-   **Cuerpo**:
    ```json
    {
        "username": "juanperez",
        "password": "contrasena_segura"
    }
    ```
-   **Respuesta**:
    -   `200 OK` si las credenciales son correctas.
    -   `401 Unauthorized` si las credenciales son incorrectas.

#### Logout de usuario

-   **URL**: `/usuarios/logout`
-   **Método**: `POST`
-   **Descripción**: Elimina la cookie de sesión y cierra la sesión del usuario.
-   **Respuesta**: `200 OK` si la sesión fue cerrada correctamente.

### Transacciones

#### Crear una transacción

-   **URL**: `/transacciones`
-   **Método**: `POST`
-   **Descripción**: Crea una nueva transacción.
-   **Cuerpo**:
    ```json
    {
        "usuario_id": 1,
        "tipo_id": 1,
        "monto": 5000,
        "fecha": "2024-10-17",
        "categoria_id": 2,
        "descripcion": "Salario mensual"
    }
    ```
-   **Respuesta**: `201 Created` si la transacción fue creada exitosamente.

#### Obtener transacciones por usuario

-   **URL**: `/transacciones/:usuario_id`
-   **Método**: `GET`
-   **Descripción**: Devuelve todas las transacciones de un usuario.
-   **Respuesta**: `200 OK` y un array de transacciones.

#### Editar una transacción

-   **URL**: `/transacciones/:transaccion_id`
-   **Método**: `PUT`
-   **Descripción**: Edita una transacción específica.
-   **Cuerpo**:
    ```json
    {
        "tipo_id": 1,
        "monto": 5500,
        "fecha": "2024-10-18",
        "categoria_id": 2,
        "descripcion": "Actualización del salario"
    }
    ```
-   **Respuesta**:
    -   `200 OK` si la transacción fue actualizada exitosamente.
    -   `404 Not Found` si la transacción no existe.

#### Eliminar una transacción

-   **URL**: `/transacciones/:transaccion_id`
-   **Método**: `DELETE`
-   **Descripción**: Elimina una transacción específica.
-   **Respuesta**:
    -   `200 OK` si la transacción fue eliminada.
    -   `404 Not Found` si la transacción no existe.

### Gráficos

#### Ingresos vs Egresos por mes

-   **URL**: `/graficos/income-vs-expenses/:usuario_id`
-   **Método**: `GET`
-   **Descripción**: Devuelve un resumen de ingresos y egresos por cada mes del año actual.
-   **Respuesta**:
    ```json
    [
      {
        "mes": "enero de 2024",
        "ingresos": 1500,
        "egresos": 500
      },
      ...
    ]
    ```

#### Distribución de gastos por categoría (Gráfico circular)

-   **URL**: `/graficos/expenses-distribution/:usuario_id`
-   **Método**: `GET`
-   **Descripción**: Muestra la distribución de gastos por categoría del año actual.
-   **Respuesta**:
    ```json
    [
      {
        "categoria": "Comida",
        "total_gastos": 200
      },
      ...
    ]
    ```

#### Evolución del saldo mensual (Gráfico de líneas)

-   **URL**: `/graficos/monthly-balance/:usuario_id`
-   **Método**: `GET`
-   **Descripción**: Devuelve la evolución del saldo acumulado mes a mes para el usuario en el año actual.
-   **Respuesta**:
    ```json
    [
      {
        "mes": "enero de 2024",
        "saldo_mensual": 1000
      },
      ...
    ]
    ```

#### Top 5 categorías con más gastos

-   **URL**: `/graficos/top5-categories-expenses/:usuario_id`
-   **Método**: `GET`
-   **Descripción**: Devuelve las 5 categorías con más egresos en el año actual.
-   **Respuesta**:
    ```json
    [
      {
        "categoria": "Servicios",
        "total_gastos": 1500
      },
      ...
    ]
    ```

## Seguridad

-   **JWT**: Los tokens de autenticación se almacenan en cookies con la configuración `httpOnly` y `secure` para mayor seguridad.
-   **Hashing de Contraseñas**: Las contraseñas de los usuarios se almacenan de forma segura utilizando `bcrypt`.
-   **CORS**: Configurado para permitir solo peticiones desde el frontend autorizado.

## Mejoras Futuras

-   Implementar filtros personalizados para la visualización de gráficos.
-   Agregar autenticación de dos factores (2FA) para una mayor seguridad.
-   Incluir exportación de datos en formatos como CSV o PDF.
-   Soporte para notificaciones y alertas personalizadas sobre las finanzas del usuario.
