import React from 'react';
import { renderToString } from 'react-dom/server';
import { PageContextBuiltIn } from 'vite-plugin-ssr/types';
import * as Routes from '../routes';


export { render, passToClient };

const passToClient = ['pageProps', 'routeParams'];

async function render(pageContext: PageContextBuiltIn) {
  const { url } = pageContext;
  const Page = getPageByUrl(url);
  const pageHtml = renderToString(<Page />);

  return {
    documentHtml: `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>SSR App</title>
      </head>
      <body>
        <div id="app">${pageHtml}</div>
      </body>
    </html>`,
    pageContext: {}
  };
}

function getPageByUrl(url: string) {
  switch (url) {
    case '/':
      return Routes.Home;
    case '/about':
      return Routes.About;
    default:
      return () => <div>Page not found</div>;
  }
}
