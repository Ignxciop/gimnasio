#!/bin/bash

# Test de conectividad cloudflared -> backend
# Ejecutar desde Dokploy:
# 1. docker exec -it compose-vryqxm-cloudflared-1 sh
# 2. Copiar y pegar estos comandos:

echo "=== Test 1: Ping a backend ==="
ping -c 2 backend 2>&1 || echo "ping no disponible"

echo ""
echo "=== Test 2: Resolución DNS ==="
nslookup backend 2>&1 || getent hosts backend 2>&1 || echo "No se pudo resolver backend"

echo ""
echo "=== Test 3: Conectividad al puerto 4001 ==="
nc -zv backend 4001 2>&1 || telnet backend 4001 2>&1 || echo "nc/telnet no disponible"

echo ""
echo "=== Test 4: Petición HTTP GET al health endpoint ==="
wget -O- http://backend:4001/health 2>&1 | head -20

echo ""
echo "=== Test 5: Petición HTTP GET a la raíz ==="
wget -O- http://backend:4001/ 2>&1 | head -20

echo ""
echo "=== Test 6: Headers de la respuesta ==="
wget -S --spider http://backend:4001/api/auth/register 2>&1 | head -30

echo ""
echo "=== IMPORTANTE: Verificar variables de entorno del backend ==="
echo "Ejecuta: docker exec compose-vryqxm-backend-1 env | grep CORS"
