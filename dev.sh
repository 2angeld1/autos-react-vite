#!/bin/bash

# --- CONFIGURACIÓN ---
BACKEND_DIR="./car-catalog-backend"
DASHBOARD_DIR="./car-catalog-admin-dashboard"

# Colores para la terminal (para que se vea pro)
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando el ecosistema de Car Catalog...${NC}"

# Función para limpiar procesos al salir
cleanup() {
    echo -e "\n${BLUE}🛑 Deteniendo servicios...${NC}"
    kill $BACKEND_PID $DASHBOARD_PID
    exit
}

# Trap para capturar Ctrl+C
trap cleanup SIGINT

# 1. Iniciar Backend
echo -e "${GREEN}📦 Arrancando Backend...${NC}"
cd $BACKEND_DIR
npm run dev &
BACKEND_PID=$!
cd ..

# 2. Iniciar Admin Dashboard
echo -e "${GREEN}🖥️ Arrancando Admin Dashboard...${NC}"
cd $DASHBOARD_DIR
npm run dev &
DASHBOARD_PID=$!
cd ..

echo -e "${BLUE}✅ ¡Todo en marcha! Presiona Ctrl+C para detener ambos.${NC}"

# Mantener el script vivo para que el trap funcione
wait
