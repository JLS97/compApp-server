# CompApp Server

## Inicio rápido

### Configuración de los entornos

- Copia el archivo .env.example y crea tres archivos: `.env.development`, `.env.staging`, `.env.production`. Modifica las variables de entorno para que reflejen lo que corresponda a cada entorno.

## Scripts

- `build`: Transpila los archivos Typescript en Javascript
- `dev`: Se inicia la app en modo desarrollo sobre el entorno de desarrollo. No se refresca el servidor tras modificar el código fuente
- `dev:watch`: Se inicia la app en modo desarrollo sobre el entorno de desarrollo y se refresca el servidor cada vez que se modifique el código fuente
- `dev:staging`: Se inicia la app en modo desarrollo sobre el entorno de pre-producción. No se refresca el servidor tras modificar el código fuente
- `dev:staging:watch`: Se inicia la app en modo desarrollo sobre el entorno de pre-producción y se refresca el servidor cada vez que se modifique el código fuente
- `dev:production`: Se inicia la app en modo desarrollo sobre el entorno de producción. No se refresca el servidor tras modificar el código fuente
- `dev:production:watch`: Se inicia la app en modo desarrollo sobre el entorno de producción y se refresca el servidor cada vez que se modifique el código fuente
- `start`: Se inicia la app a partir del código transpilado

## Entornos

Existen tres entornos como mínimo:

- `development`: Entorno de desarrollo local. Permite desarrollar características de la aplicación sin esperar a realizar despliegues y sin interferir con el trabajo de otros desarrolladores.
- `staging`: Entorno de pre-producción. La aplicación debería funcionar igual que en producción pero sin usuarios a los que corromper los datos.
- `production`: Entorno de producción. La aplicación que de cara al exterior utilizan los usuarios. Los datos de los usuarios son lo más importante.

No lo confundas con la manera en la que se inicia Node (NODE_ENV). Hay dos:

- `development`
- `production`

Para saber las diferencias [visita este link](https://nodejs.dev/en/learn/nodejs-the-difference-between-development-and-production/)

## Proveedores de autenticación
### Configuración del inicio de sesión con Apple
- Ve a la [consola de desarrollo de Apple](https://developer.apple.com/account) y dirígete a Certificates, IDs & Profiles -> Certificates
- En el menú izquierdo ve a Identifiers y genera uno para tu aplicación y por cada entorno si no está ya creado.
- El nombre del bundle id debe ser el nombre del dominio de la aplicación en formato invertido. Por ejemplo: `com.compAppofficial.app` para producción y `com.compAppofficial.app.staged` para staging. El bundle id debe coincidir con el del proyecto móvil, si lo hubiese
- Dentro de las capacidades del identificador debes seleccionar Sign In with Apple. Guarda los cambios.
- Dentro de la página Identifiers, a la derecha hay un selector que estará en App IDs. Cámbialo a Services ID. Debes crear uno por cada entorno. La descripción que pongas será la que aparezca en la página de inicio de sesión con Apple. Asígnale el App ID que acabas de crear y configura la capacidad de Sign In with Apple.
- Ahora tienes que registrar los dominios y las url válidas de redirección. El inicio de sesión con apple solo funciona mediante https, por lo que para probarlo en local tendrás que utilizar ngrok, que realiza un túnel entre una url https y un puerto localhost. Cada vez que inicies ngrok tendrás que cambiar esta configuración para poder probar en local. La configuración del servidor staging y producción la puedes dejar configurada. El bundle id utilizado para el servicio debe ir en la variable de entorno `APPLE_PROVIDER_TOKEN_CLIENT_ID`
- Ve a Keys en el menú izquierdo y crea una nueva clave. Pon un nombre descriptivo como, por ejemplo, `NOMBRE DEL PROYECTO ENTORNO Sign in` y configura la capacidad Sign in with apple. Selecciona el AppId correcto y crea la clave.
- Una vez creadas verás un concepto Key ID. Esta cadena es la que debes poner en la variable de entorno `APPLE_PROVIDER_TOKEN_KEY_ID`
- También debes pulsar en Download para descargar un archivo .p8 y moverlo a la carpeta `/certs` y poner su nombre junto con su extensión en la variable de entorno `APPLE_PROVIDER_TOKEN_PRIVATE_KEY_FILE_NAME`
- La variable de entorno `APPLE_PROVIDER_TOKEN_TEAM_ID` la puedes conseguir en la parte superior derecha de la página. Aparecen tu nombre y apellidos, el nombre de la organización y un conjunto de números y letras. Ese conjunto de números y letras son los que debes utilizar en la variable de entorno.
- Faltan por configurar las url de redirección. `APPLE_PROVIDER_REDIRECTION_URL_MOBILE` es `URL BASE DEL SERVIDOR/auth/apple/callback/mobile`. `APPLE_PROVIDER_REDIRECTION_URL_DESKTOP` está diseñada para un proyecto realizado en Nextjs. Sería `URL CLIENTE/api/auth/oauth`. Si no existe webapp, se puede dejar el mismo valor de `APPLE_PROVIDER_REDIRECTION_URL_MOBILE` y viceversa

### Configuración del inicio de sesión con Google

- Ve a [Google cloud console](https://console.cloud.google.com) y genera un proyecto por cada entorno. El entorno staging y dev lo puedes compartir
- Selecciona el proyecto y ve a (API & Services -> Credentials: https://console.cloud.google.com/apis/credentials?project=NOMBREDELPROYECTO)
- Configura la pantalla de consentimiento: https://console.cloud.google.com/apis/credentials/consent?project=NOMBREDELPROYECTO
  En scopes selecciona email y profile. Recuerda que tendrás que verificar la aplicación antes de pasarla a producción.
- Genera un OAuth 2.0 Client ID. En los orígenes autorizados pon la url del servidor para móvil y la url del cliente para desktop (http://localhost:5300 para el desarrollo local) y en la url de redirección pon la redirección al callback de google tanto de móvil como de escritorio: (http://localhost:5300/auth/google/mobile/callback y http://localhost:5300/auth/google/desktop/callback)
- Configura las variables de entorno necesarias
- Al pasar el servidor a producción tendrás que verificar la aplicación


### Configuración del inicio de sesión con Facebook
- Ve a [Facebook for Developers](https://developers.facebook.com/apps) y crea una aplicación por cada entorno. El entorno staging y dev lo puedes compartir. Selecciona que la aplicación es para iniciar sesión con la cuenta de facebook
- Dentro Configuración de la Aplicación -> Información básica recupera el identificador de la aplicación y la clave secreta. Utiliza estos datos para actualizar las variables de entorno del servidor. Rellena todos los campos necesarios.
- Configura las url de retorno dentro de Productos -> Inicio de sesión con Facebook. Las url de retorno son al propio servidor. (Las redirecciones de http://localhost se permiten de manera predeterminada cuando la aplicación se encuentra en modo de desarrollo, por lo que no es necesario añadirlo aquí.
- Al pasar el servidor a producción tendrás que verificar la aplicación

## Despliegue
En la carpeta `scripts/deployment` están los diferentes scripts existentes para desplegar el proyecto. Sigue las instrucciones del proveedor sobre el que vayas a desplegar

### Heroku
- Copia la url `Heroku git URL` que encontrarás en la aplicación -> Settings -> Heroku git URL. Tiene la siguiente estructura: `https://git.heroku.com/[Nombre de la aplicación en heroku].git`
- Añade el origen para el entorno staging: `git remote add heroku-staged [URL de heroku entorno staging]`
- Añade el origen para el entorno production: `git remote add heroku-production [URL de heroku entorno production]`
- Asegúrate de que existe el script de npm necesario para desplegar en cada uno de los dos entornos: `"deploy:heroku:staged": "sh ./scripts/deployment/heroku/staged.sh"` y `"deploy:heroku:production": "sh ./scripts/deployment/heroku/production.sh"`


## Firebase
- Ve a [la consola de Firebase](https://console.firebase.google.com) y crea un nuevo proyecto por entorno. Si ya has realizado la autenticación mediante google, añade firebase al proyecto del entorno buscándolo en el desplegable. Desactiva Google Analytics
- Ve a la ruedecita de configuración de arriba a la izquierda y selecciona "Configuración del proyecto". En tipo de entorno, selecciona producción si ese es tu entorno
- Crea una app (ios, android, web) por cada cliente que vayas a utilizar. Sigue los pasos que aparecen dentro.
- En Cuentas de Servicio -> SDK de Firebase Admin da al botón que pone "Generar nueva clave privada". Te descargará un archivo que deberás introducir en la carpeta `certs`. El nombre de este archivo lo tendrás que poner en la variable de entorno `FIREBASE_SERVICE_ACCOUNT_FILENAME`
- En Usuarios y permisos añade a todos los miembros del equipo que corresponda añadir