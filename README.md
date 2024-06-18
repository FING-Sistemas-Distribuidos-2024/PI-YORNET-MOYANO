# Sistemas Distribuidos 2024: Proyecto Integrador REDO

Lucas Moyano

## IP deployada
Podes encontrar la webapp ya deployada en el ip:  
10.230.60.21  
Nota: puede ser que el cluster ya no exista y la IP no funcione

## Como usarlo
Se puede deployar localmente haciendo:  
`docker compose up --build`  
Ubicandose en el mismo path donde está docker-compose.yml

O sino se puede deployar en un cluster de kubernetes haciendo `kubectl apply -f [archivo].yaml` de todos los yaml que están en la carpeta /kubernetes_yaml

Es importante el orden! Se recomienda el siguiente orden:
```
kubectl apply -f metallb_config.yaml

kubectl apply -f nginx_configmap.yaml
kubectl apply -f client_deployment.yaml
kubectl apply -f client_service.yaml

kubectl apply -f server_deployment.yaml
kubectl apply -f server_service.yaml

kubectl apply -f redis_deployment.yaml
kubectl apply -f redis_service.yaml

```

