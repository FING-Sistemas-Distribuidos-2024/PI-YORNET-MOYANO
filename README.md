# Sistemas Distribuidos 2024: Proyecto Integrador  
Facultad de Ingeniería - Universidad Nacional de Cuyo

- Integrantes:
    - Moyano, Lucas
    - Yornet de Rosas, Agustín
- Fecha: 07/06/2024
  

## Introducción
La aplicación es una implementación del juego 2048, que consiste en unir casilleros con números iguales para formar potencias de 2 con cada unión. El objetivo del juego es obtener la máxima puntuación posible.
El juego, además de mantener tu puntuación de la partida, muestra el *high score* más alto obtenido por alguna de las personas de la red de ZeroTier que haya jugado. Esto permite que las personas compitan entre sí por alcanzar el puntaje más alto.

## Características de la aplicación
- El cliente fue desarrollado con Node.js
- El servidor fue desarrollado con Express.js
- El código fuente de 2048 ha sido extraído de https://github.com/kubowania/2048 para obtener las visuales y el funcionamiento. En este proyecto, se ha agregado la casilla de "Global Highscore" y el protocolo de comunicación entre el cliente y el servidor.
- El servidor persiste el *highscore* por medio del motor de base de datos Redis, y cada vez que el cliente realiza un movimiento o carga la página, el servidor extrae el mismo dato de Redis y se lo envía al cliente.
- Este repositorio contiene el Dockerfile utilizado para crear la imagen de Docker. Dicha imagen se encuentra también en Dockerhub: https://hub.docker.com/r/elpelado619/app2048/tags
- Para el despliegue de la aplicación, se utilizó la configuración que se encuentra en el archivo deployment.yaml.

## ¿Cómo puedo acceder a la aplicación?
Se puede acceder por medio de un navegador web con la dirección IP **10.230.60.11** si usted se encuentra dentro de la red de ZeroTier asignada por la cátedra.
