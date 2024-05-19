import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createPageRenderer } from 'vite-plugin-ssr';

const isProduction = process.env.NODE_ENV === 'production';
const root = process.cwd();
const server = express();

(async () => {
  let viteDevServer;
  if (!isProduction) {
    viteDevServer = await createViteServer({
      root,
      server: { middlewareMode: true },
    });
    server.use(viteDevServer.middlewares);
  }

  const renderPage = createPageRenderer({ viteDevServer, isProduction });

  server.get('*', async (req, res, next) => {
    const url = req.originalUrl;
    const pageContext = await renderPage({ url });
    const { httpResponse } = pageContext;

    if (!httpResponse) return next();
    res.status(httpResponse.statusCode).set(httpResponse.headers).send(httpResponse.body);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
})();
