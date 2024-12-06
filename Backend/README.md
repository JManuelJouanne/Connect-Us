# grupo-14-backend ConnectUs


Este juego es un Conecta 4, con un tablero de 7x9 y con una temática de AmongUs. Se puede jugar de a dos jugadores, cada uno con un color diferente. El objetivo del juego es lograr conectar 4 fichas del mismo color en cualquier dirección (horizontal, vertical o diagonal).

## Base de Datos

### Modelo ER
Nuestro modelo ER conciste en cuatro Entidades
* `User` username, mail, password
    * Tiene varios players (Uno por cada partida del usuario)
* `Game` turn, winner, friend (0:partida aleatoria, 1:partida con amigo)
    * Tiene dos players (Uno contra uno)
    * Tiene varias celdas (7 x 9)
* `Player` number (1 o 2), userId, gameId
    * Pertenecen a un usuario
    * Pertenecen a una partida
* `Cell` gameId, column, row, status (0: celda vacía, 1: ocupada por jugador 1, 2: ocupada por jugador 2)
    * Pertenecen a una partida


Los modelos se crearon con los siguientes comandos
````
yarn sequelize-cli modelgenerate --name User --attributes usernamestring,mailstring,passwordstring

yarn sequelize-cli modelgenerate --name Game --attributes turninteger,winnerstring

yarn sequelize-cli modelgenerate --name Player --attributes namestring,userIdinteger,gameIdinteger,colorstring

yarn sequelize-cli modelgenerate --name Cell --attributes gameIdinteger,columninteger,rowinteger,statusinteger
````

### Montar la base de datos
lo primero que se debe hacer es crear un archivo `.env` en la raíz del proyecto con las siguientes variables
````
DB_USERNAME = tu_usuario_de_postgres
DB_PASSWORD = tu_contraseña_de_postgres
DB_NAME = connectus
DB_HOST = 'localhost'

PORT = 3000
JWT_SECRET = secret
`````
Reemplazando `tu_usuario_de_postgres` y `tu_contraseña_de_postgres` por los datos correspondientes.

Luego, se debe crear la base de datos con el siguiente comando
````
createdb connectus_development
````
A continuación se corren las migraciones
````
yarn sequelize-cli db:migrate
````
Y por último se corren los seeders
````
yarn sequelize-cli db:seed:all
````
Los seeders contienen instancias de todas las tablas, inculyendo dos usuarios, dos partidas, cuatro players (dos por cada partida) y 126 celdas del tablero (63 por cada partida, tablero de 7x9).

## Dependencias
* `dotenv` v16.1.3: permite cargar variables de entorno desde un archivo `.env`.
* `koa` v2.14.2: framework para crear aplicaciones web en Node.js. Proporciona una arquitectura de middleware.
* `koa-body` v6.0.1: facilita el manejo de datos enviados en las solicitudes HTTP.
* `koa-logger` v3.2.1: middleware para Koa que registra información de las solicitudes HTTP en la consola del servidor.
* `koa-router` v12.0.0: middleware para Koa que facilita el enrutamiento de solicitudes HTTP.
* `nodemon` v2.0.22: monitorea los archivos de tu proyecto y reinicia automáticamente la aplicación cuando detecta cambios.
* `pg` v8.11.0: controlador de PostgreSQL para Node.js.
* `sequelize` v6.31.1: ORM para Node.js que facilita la interacción con PostgreSQL.
* `sequelize-cli` v6.6.0:  interfaz de línea de comandos para Sequelize.
* `koa-cors` v2.2.1: middleware para Koa que permite el acceso a recursos ubicados en otro dominio.
* `koa-jwt` v4.0.1: middleware para Koa que permite la autenticación de usuarios a través de webtokens.
* `jsonwebtoken` v8.5.1: implementación de JSON Web Tokens para Node.js.
* `bcrypt` v5.0.1: librería para el hashing de contraseñas.
* `socket.io` v4.3.2: librería para la comunicación bidireccional en tiempo real entre clientes y servidores web.

### devDependencies
* `eslint` v8.41.0: ayuda a mantener un código limpio y coherente en tu proyecto.

Instalar las dependencias con el comando
````
yarn
````


## API
La API usa el puerto 3000. Se usan webtockens para la autenticación de usuarios. Para poder acceder a las rutas de la API se debe enviar un webtoken en el header de la petición con el siguiente formato
````
"Authorization": "Bearer <token>"
````
Donde `<token>` es el token que se obtiene al iniciar sesión con un usuario. Todas las rutas de la API (exepto las de log in y sign up) están protegidas y requieren un token para poder acceder a ellas. Hay rutas que están habilitadas solo para cuentas admin (por razones de seguridad), sin embargo, no se implementó la lógica para crear ese tipo de cuentas, pero los endpoints quedaron hecho igualmente.


### Users
#### Crear un usuario
Se crea el usuario con el metodo POST en la siguiente ruta
````
http://localhost:3000/signup
````
Por ejemplo, se podría crear con el body
````
{
    "username": "alexissanches",
    "mail": "alexis@gmail.com",
    "password": "alexis123"
}
````
Retorna un json con el usuario creado (sin la contraseña) y con un token que se va a guardar en localstorage para acceder a otras rutas.

#### Obtener lista de usuarios
Se obtiene la lista de usuarios con el metodo GET en la siguiente ruta
````
http://localhost:3000/users/all
````
retorna un json por cada usuario.

#### Obtener usuario conectado
Se obtiene el usuario conectado en el lado cliente con el metodo GET en la ruta
````
http://localhost:3000/users/3
````
El id se obtiene a través del token. Retorna un json con el usuario.

#### Iniciar sesión con un usuario
Se inicia sesión con el metodo POST en la siguiente ruta
````
http://localhost:3000/login
````
Los parámetros se mandan en el body de la petición. Por ejemplo, se podría iniciar sesión con el body.
````
{
    "username": "alexissanches",
    "password": "alexis123"
}
````
En caso de que el usuario no exista o la contraseña sea incorrecta, se obtendrá un mensaje de error. En caso de que el usuario exista y la contraseña sea correcta, se obtendrá un json con el usuario y el token que queda seteado en local storage.

#### Borrar usuario
Se borra un usuario con el metodo DELETE en la ruta `http://localhost:3000/users/:id` especificando el id del usuario que se quiere borrar. Por ejemplo, para borrar el usuario con id 3 se debe hacer la siguiente petición
````
http://localhost:3000/users/3
````
Retorna un json con el mensaje 'Usuario Eliminado'. Habilitado solo para cuentas admin.



### Games
#### Obtener lista de todas las partidas
Se obtiene la lista de todas las partidas con el metodo GET en la siguiente ruta
````
http://localhost:3000/games
````
Retorna un json con todas las partidas. Habilitado solo para cuentas admin.

#### Obtener una partida especifica
Se obtiene una partida con el metodo GET en la ruta `http://localhost:3000/games/:id` especificando el id de la partida que se quiere obtener. Por ejemplo, para obtener la partida con id 2 se debe hacer la siguiente petición
````
http://localhost:3000/games/2
````
Retorna un json con la partida.

#### Crear una partida con un amigo
Hay tres formas de ingresar a una partida. La primera de ellas es creando una partida para jugarla con un amigo. Este tipo de partidas se crea con el metodo POST en la siguiente ruta
````
http://localhost:3000/games
````
El id del usuario se obtiene del token y se crea una partida con atributos por defecto, se crean las 63 celdas y el player que asocia al usuario con la partida. El numero de jugador es aleatorio. Retorna un json con el player y el game.

#### Borrar una partida
Se borra una partida con el metodo DELETE en la ruta `http://localhost:3000/games/:id` especificando el id de la partida que se quiere borrar. También se borran los players y las celdas asociadas a la partida. Por ejemplo, para borrar la partida con id 2 se debe hacer la siguiente petición
````
http://localhost:3000/games/2
````
Retorna un json con el mensaje "Partida Eliminada".

### Players
#### Lista de todos los players
Se obtiene la lista de todos los players con el metodo GET en la siguiente ruta
````
http://localhost:3000/players
````
Retorna un json por cada player.

#### Obtener un player
Se obtiene un player con el metodo GET en la ruta `http://localhost:3000/players/:id` especificando el id del player que se quiere obtener. Por ejemplo, para obtener el player con id 3 se debe hacer la siguiente petición
````
http://localhost:3000/players/3
````
Retorna un json con el player.

Hay otros endpoints que retornan players, de un mismo usuario o de un mismo juego, pero no se usan en el juego por lo que no se van a explicar.

#### Nombre del usuario que comienza la partida
Para setear el juego al comienzo, se accede a este endpoint que retorna un mensaje diciendo qué jugador comienza. Se accede con `http://localhost:3000/players/start/:gameId`. Por ejemplo, para obtener el jugador que comienza la partida con id 1 se debe hacer la siguiente petición.
`````
http://localhost:3000/players/start/1
`````

#### Unirse a partida con un amigo
Una segunda forma de ingresar a una partida, es uniéndose a una partida creada por un amigo. El amigo que creó la partida debe enviar el id de la partida por otro medio, y el usuario que se quiere unir ingresa el id como input. Se crea el player con el metodo POST en la siguiente ruta `http://localhost:3000/players/:gameId`. Por ejemplo, se podría crear con la ruta
`````
http://localhost:3000/players/3
`````
el id del usuario se obtiene del token. Retorna un json con el player creado y el game al que se unió.

#### Unirse a una partida aleatoria
Una tercera forma de ingresar a una partida, es uniéndose a una partida aleatoria. Se crea el player con el metodo POST en la siguiente ruta 
`````
http://localhost:3000/players`
`````
Primero se van a buscar partidas aleatorias que estén esperando un jugador. En caso de que haya alguna, se va a crear el player y en caso de que no, se va a crear el game y despúes el player. Retorna un json con el player creado y el game.

#### Eliminar un player
Se elimina un player con el metodo DELETE en la ruta `http://localhost:3000/players/:id` especificando el id del player que se quiere eliminar. Por ejemplo, para eliminar el player con id 4 se debe hacer la siguiente petición
````
http://localhost:3000/players/4
````
Retorna un json con el player eliminado.


### Cells
#### Obtener lista de celdas de una partida
Se obtiene la lista de celdas de una partida con el metodo GET en la ruta `http://localhost:3000/cells/:gameId` especificando el id de la partida de la que se quieren obtener las celdas. Por ejemplo, para obtener las celdas de la partida con id 1 se debe hacer la siguiente petición
````
http://localhost:3000/cells/1
````
Retorna un json por cada celda de la partida.

## Websockets
Se implemetaron websockets para la parte misma del juego. Cuando un jugador quiere poner una ficha, la solicitud sera mediante una conexión web socket para poder actualizar el tablero del oponente en tiempo real.

#### Colocar una Ficha (Actualizar una celda)
Se va a enviar un body a través del websocket con los siguientes atributos:
````
{
    "gameId": 1,
    "player": 2,
    "column": 3
}
````
Para este método, el flujo de código es bastante más largo. Se implementaron funciones en la carpeta `modules` para hacer un código más legible. El flujo es el siguiente:
1. Se verifica que el jugador que está haciendo la jugada sea el jugador que le toca jugar y que la partida no se haya acabado. Si no es así, retorna un json con el mensaje 'No es tu turno'.
2. Se intenta colocar la ficha en la columna que se especifica en la ruta. Si la columna está llena, retorna un json con el mensaje 'Columna llena'.
3. Se verifica si el jugador que hizo la jugada ganó la partida.
4. En caso de que el jugador que hizo la jugada no haya ganado, se cambia el turno de la partida para que juegue el otro jugador. Se rotorna un json con la celda acutalizada.
5. En caso de que el jugador que puso la ficha haya ganado, se cambia el winner al numero del jugador que ganó. Se retorna un json con la celda actualizada y el mensaje 'Ganador'.


## Correr la aplicación
Para correr la aplicación se debe ejecute
````
yarn start
````
o sino (con nodemon)
````
yarn dev
````

## Otros Detalles
### EsLint
Usamos Eslint para evitar errores en el código, como variables que no se estén usando. Se puede ver que no hay errores de código con el comando
````
npx eslint ./src
````
### GitFlow
Usamos GitFlow para el control de versiones. Tuvimos algunas descordinaciones chicas, como hacer el merge local y después hacer el push o derrepente editar algún pedazo de código desde la branch equivocada, pero en general funcionó bien y no nos trajo problemas. Se puede ver el historial de commits en el repositorio de github. Siempre hicimos merge a la rama develop.

