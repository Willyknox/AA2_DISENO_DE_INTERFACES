# BikeShop Frontend

Proyecto académico de la asignatura **Desarrollo de Interfaces** (2º DAM).

Catálogo interactivo de bicicletas desarrollado como Single Page Application (SPA) con React y Vite.

## Funcionalidades

- Listado completo de bicicletas con tarjetas visuales
- Búsqueda en tiempo real por modelo o marca
- Filtrado por tipo de bicicleta
- Ordenación por precio (ascendente / descendente)
- Página de detalle con información completa de cada bicicleta
- Diseño responsive para móvil, tablet y escritorio

## Stack tecnológico

- **React 19** con Vite
- **React Router DOM 7** para navegación SPA
- **Bootstrap 5.3** para estilos y componentes
- **Google Fonts (Inter)** para tipografía
- **json-server** como API REST simulada para desarrollo

## Estructura del proyecto

```
src/
  components/   # Componentes reutilizables
  pages/        # Vistas principales de la aplicación
  services/     # Acceso a la API
public/images/  # Imágenes de las bicicletas
db.json         # Datos simulados del backend
```

## Arranque

```bash
# Instalar dependencias
npm install

# Iniciar json-server (backend simulado en puerto 3001)
npm run api

# En otra terminal, arrancar el frontend (puerto 5173)
npm run dev
```

## Autor

Guillermo Labara — Desarrollo de Interfaces, 2º DAM