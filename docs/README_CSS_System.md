# NomaPay — Sistema de clases CSS (Tailwind + Flowbite)

Basado en `Identidad_Visual_NomaPay_dc.html` y `Mockups_UI_NomaPay_dc.html` (fuente de verdad de colores, tipografía, radios y sombras).

## 1. Instalación

```bash
npm install -D tailwindcss postcss autoprefixer
npm install flowbite
npx tailwindcss init -p
```

Reemplazá el `tailwind.config.js` generado por el archivo `tailwind.config.js` de este entregable (ya tiene toda la paleta, tipografía y gradientes de marca cargados).

En `src/main.tsx` (o `main.jsx`), importá el CSS una sola vez, arriba de todo:

```tsx
import "./styles/index.css";
```

Guardá el `index.css` de este entregable en `src/styles/index.css`.

Flowbite también necesita su script de interactividad (dropdowns, modales, etc.) si usan los componentes JS de Flowbite puro (no la librería `flowbite-react`):

```bash
npm install flowbite
```

```tsx
// en main.tsx, junto al resto de imports
import "flowbite";
```

> Si prefieren componentes ya hechos en React (`<Modal>`, `<Dropdown>`, etc. en vez de solo clases), pueden sumar `flowbite-react` — es opcional, el sistema de clases funciona igual sin eso.

## 2. Cómo está organizado

- **`tailwind.config.js`** → todos los *tokens* de diseño: colores (rampas 100-900 de violeta/turquesa/magenta/ámbar), tipografía (familia Archivo + escala de tamaños), radios, sombras y los 4 gradientes de marca.
- **`index.css`** → clases de componentes reutilizables, con la convención **`.block`**, **`.block__element`**, **`.block--modifier`** (BEM-lite), construidas con `@apply` sobre los tokens de Tailwind.

**Regla del equipo:** para layout, spacing puntual y ajustes de una sola vez, usen utilidades de Tailwind directo en el JSX. Para todo lo que se repite en muchas pantallas (botones, cards, badges, inputs, alertas), usen las clases de `index.css` — así si mañana cambia un color de marca, se edita en un solo lugar.

## 3. Ejemplos de uso

### Botón primario (degradado swoosh)
```jsx
<button className="btn btn--primary">Continuar</button>
<button className="btn btn--secondary">Transferir</button>
<button className="btn btn--outline">Convertir</button>
<button className="btn btn--ghost btn--sm">Historial</button>
<button className="btn btn--destructive">Cerrar cuenta</button>
```

### Card de saldo
```jsx
<div className="card card--aura">
  <p className="card__title">Balance total</p>
  <p className="card__amount">ARS 1.982,30</p>
</div>
```

### Input con label
```jsx
<div>
  <label className="input__label">Monto a enviar</label>
  <input className="input" placeholder="0,00 USD" />
</div>
```

### Badges de estado (chips)
```jsx
<span className="badge badge--success">Acreditado</span>
<span className="badge badge--warning">Pendiente</span>
<span className="badge badge--error">Rechazado</span>
<span className="badge badge--info">En revisión</span>
```

### AlertNote (la caja "Motivo" de rechazo)
```jsx
<div className="alert-note alert-note--error">
  <p className="alert-note__title">Motivo</p>
  <p className="alert-note__description">Cuenta no válida, destinatario inexistente</p>
</div>
```

### Texto de marca ("Nomapay" en versalitas — solo splash y onboarding)
```jsx
<span className="text-[22px] font-medium tracking-[0.22em] uppercase text-white">
  Nomapay
</span>
```

## 4. Reglas de marca que el CSS por sí solo no garantiza (avisar al equipo)

Estas están documentadas en el archivo de identidad pero dependen de que cada uno las respete al armar la pantalla, no las fuerza el CSS:

- **Máximo un gradiente por pantalla**, y nunca en texto de párrafo largo — solo en botones primarios, tarjeta de saldo o momentos puntuales.
- **`grad-spectrum`** (el arcoíris completo) es **solo** para filetes de 4px (la clase `.brand-rule`) — nunca como fondo.
- Los montos, saldos y códigos de operación siempre llevan la clase `.tabular` (o el `card__amount` que ya la incluye), para que los dígitos no salten al actualizarse.
- El tema oscuro es el default del producto. El tema claro se activa agregando la clase `light` al `<body>` — no crear pantallas "solo para claro" sueltas.
- Radios: `rounded-control` (12px) para inputs y botones, `rounded-card` (16px) para tarjetas y sheets, `rounded-full` para chips y avatares. No inventar otros radios sueltos.
