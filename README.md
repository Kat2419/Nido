# Nido 💛

App privada de pareja: mercado, fechas importantes y eventos (como su boda) con presupuesto por categorías.

## 1. Crear el backend en Supabase (una sola vez)

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita.
2. Crea un **New project** (elige cualquier nombre, contraseña de base de datos y región cercana).
3. Cuando el proyecto esté listo, ve a **Project Settings → API**. Copia:
   - **Project URL**
   - **anon public key**
4. En este proyecto, copia el archivo `.env.local.example` a `.env.local` y pega esos dos valores:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

5. Ve a **SQL Editor** en Supabase, pega todo el contenido de [`supabase/schema.sql`](supabase/schema.sql) y ejecútalo (**Run**). Esto crea las tablas, la seguridad por fila (para que solo ustedes dos vean sus datos) y las funciones para crear/unirse a una pareja.

6. Ve a **Authentication → URL Configuration** y configura:
   - **Site URL**: `http://localhost:5566`
   - **Redirect URLs**: agrega `http://localhost:5566/**`

   (Cuando publiquen la app en internet más adelante, agregarán aquí también esa URL).

7. Por defecto Supabase ya envía el correo de confirmación de registro sin configuración adicional (usa su propio servidor de correo, con límites bajos pero suficientes para uso personal).

## 2. Correr la app localmente

```bash
npm install
npm run dev
```

Abre [http://localhost:5566](http://localhost:5566).

## 3. Primer uso

1. Uno de los dos se registra en `/registro` con su correo real.
2. Revisa tu correo y haz clic en el enlace de confirmación.
3. En "Bienvenida", elige **crear nuestro Nido** — se genera un código de 6 caracteres.
4. Comparte ese código con tu pareja. Ella/él se registra, confirma su correo, y en "Bienvenida" elige **unirme** e ingresa el código.
5. ¡Listo! Ya comparten mercado, fechas y eventos.

## Estructura

- `src/app/(app)` — páginas privadas (dashboard, mercado, fechas, eventos), protegidas por `src/proxy.ts`.
- `src/app/auth`, `src/app/login`, `src/app/registro` — registro, login y confirmación por correo.
- `src/app/bienvenida` — vincular tu cuenta con la de tu pareja.
- `supabase/schema.sql` — todo el esquema de base de datos y seguridad.

## Siguiente paso opcional: publicarla en internet

Ahora mismo la app solo funciona mientras tengan `npm run dev` corriendo en un computador. Para tenerla disponible siempre desde el celular de ambos, se puede desplegar gratis en [Vercel](https://vercel.com) — avísale a Claude cuando quieran hacerlo y lo configuramos.
