# Glamping Cumbre de los Molinos

Landing page de conversión (Astro + React islands + Tailwind v4), mobile-first, orientada a llevar tráfico a WhatsApp.

## Comandos

| Comando           | Acción                                      |
| ------------------ | -------------------------------------------- |
| `npm install`       | Instala dependencias                         |
| `npm run dev`        | Servidor local en `localhost:4321`           |
| `npm run build`       | Compila el sitio estático a `./dist/`        |
| `npm run preview`      | Previsualiza el build de producción          |

## Configuración del negocio

Toda la información editable (número de WhatsApp, mensajes contextuales, ubicación, redes, RNT, check-in/out) vive en un solo archivo:

`src/config/site.ts`

No hay datos de negocio hardcodeados en los componentes — cambia ahí y se propaga a todo el sitio.

## Despliegue en Cloudflare Pages

**Opción A — conectando el repo de Git (recomendado):**
1. Sube este repo a GitHub/GitLab.
2. En el dashboard de Cloudflare Pages, "Create a project" → conecta el repo.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Cloudflare asigna un dominio `*.pages.dev` gratuito automáticamente.

**Opción B — deploy directo por CLI (sin conectar Git):**
```bash
npm run build
npx wrangler login
npx wrangler pages deploy dist --project-name=glamping-cumbre-molinos
```
`wrangler login` abre una ventana del navegador para autenticarte con tu cuenta de Cloudflare — esto lo debes hacer tú manualmente.

Una vez que tengas la URL final de `*.pages.dev` (o un dominio propio), actualiza `site.siteUrl` en `astro.config.mjs` y `src/config/site.ts` para que el SEO (canonical, sitemap, Open Graph) apunte al dominio correcto.
