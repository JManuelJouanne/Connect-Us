# grupo-14-backend ConnectUs

Se trabajó en toda la lógica del juego. Se dejaron implementados todos los métodos necesarios para el funcionamiento de la aplicación.
El juego es un Conecta 4, con un tablero de 7x9 y con una temática de AmongUs. Se puede jugar de a dos jugadores, cada uno con un color diferente. El objetivo del juego es lograr conectar 4 fichas del mismo color en cualquier dirección (horizontal, vertical o diagonal).

## Base de Datos

### Modelo ER
Nuestro modelo ER conciste en cuatro Entidades
* `User` username, mail, password
    * Tiene varios players (Uno por cada partida del usuario)
* `Game` turn, winner
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
`````
Reemplazando `tu_usuario_de_postgres` y `tu_contraseña_de_postgres` por los datos correspondientes.

Luego, se debe crear la base de datos con el siguiente comando
````
cratedb connectus_development
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

devDependencies
* `eslint` v8.41.0: ayuda a mantener un código limpio y coherente en tu proyecto.

Instalar las dependencias con el comando
````
yarn
````
o 
````
npm install
````

## API
### Users
#### Crear un usuario
Se crea el usuario con el metodo POST en la siguiente ruta
````
http://localhost:3000/users/signup
````
Por ejemplo, se podría crear con el body
````
{
    "username": "alexissanches",
    "mail": "alexis@gmail.com",
    "password": "alexis123"
}
````
Retorna un json con el usuario creado.

#### Obtener lista de usuarios
Se obtiene la lista de usuarios con el metodo GET en la siguiente ruta
````
http://localhost:3000/users
````
retorna un json por cada usuario.

#### Obtener un usuario
Se obtiene un usuario con el metodo GET en la ruta `http://localhost:3000/users/:id` especificando el id del usuario que se quiere obtener. Por ejemplo, para obtener el usuario con id 3 se debe hacer la siguiente petición
````
http://localhost:3000/users/3
````
Retorna un json con el usuario.

#### Iniciar sesión con un usuario
Se inicia sesión con el metodo POST en la siguiente ruta
````
http://localhost:3000/users/login
````
Los parámetros se mandan en el body de la petición. Por ejemplo, se podría iniciar sesión con el body.
````
{
    "username": "alexissanches",
    "password": "alexis123"
}
````
En caso de que el usuario no exista o la contraseña sea incorrecta, se obtendrá un mensaje de error. En caso de que el usuario exista y la contraseña sea correcta, se obtendrá un json con el usuario.

#### Borrar usuario
Se borra un usuario con el metodo DELETE en la ruta `http://localhost:3000/users/:id` especificando el id del usuario que se quiere borrar. Por ejemplo, para borrar el usuario con id 3 se debe hacer la siguiente petición
````
http://localhost:3000/users/3
````
Retorna un json con el mensaje 'Usuario Eliminado'.



### Games
#### Obtener lista de todas las partidas
Se obtiene la lista de todas las partidas con el metodo GET en la siguiente ruta
````
http://localhost:3000/games
````
Retorna un json con todas las partidas.

#### Obtener una partida especifica
Se obtiene una partida con el metodo GET en la ruta `http://localhost:3000/games/:id` especificando el id de la partida que se quiere obtener. Por ejemplo, para obtener la partida con id 2 se debe hacer la siguiente petición
````
http://localhost:3000/games/2
````
Retorna un json con la partida.

#### Crear una partida
Se crea la partida con el metodo POST en la siguiente ruta
````
http://localhost:3000/games
````
Por ejemplo, se podría crear con el body
````
{
    "userId": 1
}
````
Este endpoint, primero crea una partida con los siguientes atributos
````
{
    "winner": null,
    "turn": 1
}
````
Luego crea todas las celdas del tablero en su respectiva tabla, con el status igual a 0. Por último, crea un player con el id del usuario que creó la partida y el id de la partida creada. Se define aleatoriamente si el usuario va a ser el jugador 1 o el jugador 2. (El otro jugador se une después a la partida)
Retorna un json con la partida creada.

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

#### Obtener todos los players de un usuario
Se obtiene la lista de todos los players de un usuario con el metodo GET en la ruta `http://localhost:3000/players/user/:userId` especificando el id del usuario del que se quieren obtener los players. Por ejemplo, para obtener los players del usuario con id 1 se debe hacer la siguiente petición
````
http://localhost:3000/players/user/1
````
Retorna un json por cada player del usuario.

#### Obtener todos los players de una partida
Se obtiene la lista de todos los players de una partida con el metodo GET en la ruta `http://localhost:3000/players/game/:gameId` especificando el id de la partida de la que se quieren obtener los players. Por ejemplo, para obtener los players de la partida con id 1 se debe hacer la siguiente petición
````
http://localhost:3000/players/game/1
````
Retorna un json por cada player de la partida.

#### Unirse a partida existente (Crear un player)
Se crea el player con el metodo POST en la siguiente ruta `http://localhost:3000/players/:gameId`. Por ejemplo, se podría crear con el body (Primero hay que crear un game con id 3) en la ruta
`````
http://localhost:3000/players/3
`````
con el body
````
{
    "userId": 1
}
````
Esto crea un player con el id del usuario que se especifica en el body y el id de la partida que se especifica en la ruta. El número de jugador lo obtiene viendo el número del otro jugador de la partida que se eligue aleatoriamente.
Retorna un json con el player creado.

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

#### Colocar Ficha en una columna (Actualizar una celda)
Se actualiza una celda con el metodo PATCH especificando el id de la partida y la columna en la que se quiere colocar la ficha con una ruta tipo `http://localhost:3000/cells/:gameId/:column`. Por ejemplo, para colocar una ficha en la columna 9 de la partida 1 se debe hacer la siguiente petición
````
http://localhost:3000/cells/1/9
````
En el body solo va el atributo que se quiere actualizar, en este caso el status. Si la jugada la hace el jugador dos, el body sería
````
{
    "status": 2
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

## Otros Detalles
### EsLint
Usamos Eslint para evitar errores en el código, como variables que no se estén usando. Se puede ver que no hay errores de código con el comando
````
npx eslint ./src
````
### GitFlow
Usamos GitFlow para el control de versiones. Tuvimos algunas descordinaciones chicas, como hacer el merge local y después hacer el push o derrepente editar algún pedazo de código desde la branch equivocada, pero en general funcionó bien y no nos trajo problemas. Se puede ver el historial de commits en el repositorio de github. Siempre hicimos merge a la rama develop.

