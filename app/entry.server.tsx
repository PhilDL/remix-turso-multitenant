import { PassThrough } from "node:stream";
import {
  createReadableStreamFromReadable,
  type AppLoadContext,
  type EntryContext,
} from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import morgan from "morgan";
import { renderToPipeableStream } from "react-dom/server";
import { createExpressApp } from "remix-create-express-app";

// import { sayHello } from '#app/hello.server'

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext,
) {
  const handlerName = isbot(request.headers.get("user-agent") || "")
    ? "onAllReady"
    : "onShellReady";
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        [handlerName]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

export const app = createExpressApp({
  configure: (app) => {
    // customize your express app with additional middleware
    app.use(morgan("tiny"));
  },
  // getLoadContext: () => {
  //   // return the AppLoadContext
  //   return { sayHello } as AppLoadContext
  // },
  // unstable_middleware: true,
});
