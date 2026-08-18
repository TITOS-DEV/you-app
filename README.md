# YOU

Tu espacio. Tu progreso. Tu disciplina.

YOU es un sistema personal de hábitos, hidratación, peso, ejercicio y
disciplina — pensado para una sola persona. No hay login, ni cuentas, ni
usuarios múltiples: abres la app y entras directo a tu Dashboard.

## Stack

React · TypeScript · Vite · Tailwind CSS v4 · Zustand · Dexie (IndexedDB) ·
Framer Motion · Recharts · Zod · vite-plugin-pwa

Local-first y offline-first: todos los datos viven únicamente en este
dispositivo, en IndexedDB. No hay backend.

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # type-check + build de producción
npm run preview  # sirve el build de producción
npm run lint      # oxlint
```

## Estructura

```
src/
  app/            # (reservado para composición de alto nivel)
  components/     # componentes reutilizables (ui, layout, navigation,
                   # charts, habits, water, weight, exercise, streak, coach)
  features/       # páginas: dashboard, habits, progress, coach, settings
  hooks/          # hooks React (datos reactivos vía dexie-react-hooks,
                   # utilidades de UI)
  stores/         # estado de UI con Zustand (navegación, sheets, toasts)
  services/       # lógica de negocio y persistencia (Dexie)
  lib/            # db (Dexie), utilidades, iconos, mensajes
  types/          # tipos de dominio
  utils/          # utilidades puras (fechas)
```

## Regenerar los iconos de la PWA

```bash
node scripts/generate-icons.mjs
```
