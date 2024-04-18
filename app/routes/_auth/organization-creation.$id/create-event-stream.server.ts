import { eventStream } from "remix-utils/sse/server";

import { emitter } from "./emitter.server.ts";

export function createEventStream(request: Request, eventName: string) {
  return eventStream(request.signal, (send) => {
    const handle = (arg: string) => {
      send({
        data: String(arg),
      });
    };

    emitter.addListener(eventName, handle);
    const heartbeat = setInterval(() => {
      send({
        event: "heartbeat",
        data: String(Date.now()),
      });
    }, 15000);

    return () => {
      emitter.removeListener(eventName, handle);
      clearInterval(heartbeat);
    };
  });
}
