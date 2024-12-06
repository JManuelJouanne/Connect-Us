# grupo-14-frontend

Primero se deben instalar las dependencias con
```
yarn install
```

Luego se debe crear un archivo .env con las variables de entorno necesarias para la aplicación. Para esto se puede copiar el archivo .env.example y modificarlo con los valores correspondientes. La unica variable de entorno es la url del backend `VITE_BACKEND_URL`, por ejemplo:
```
VITE_BACKEND_URL = 'http://localhost:3000'
```
Se ejecuta la aplicación con
```
npm run dev
```
en caso de algun problema se puede ir al archivo `package.json` y apretar el botón `Debug` que aparece arriba del atributo `scripts`.

## Deploy
El Deploy se hizo en Netlify, se puede acceder a la aplicación en el siguiente link: 
````
https://main--connectusweb.netlify.app/

`````
