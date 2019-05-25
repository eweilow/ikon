import { Server } from "http";

interface IStartable {
  listen(port: number): Server;
}

export async function attemptStartServer(obj: () => IStartable, preferredPort: number) {
  let port: number;
  let server: Server | null = null;
  while (true) {
    try {
      port = await new Promise<number>((resolve, reject) => {
        const createdServer = obj().listen(preferredPort);
        createdServer.on("listening", () => {
          const address = createdServer.address();
          if (typeof address === "string") {
            reject(new Error(`Cannot read port from '${address}`));
          } else if (address == null) {
            reject(new Error("Address must not be null!"));
          } else {
            resolve(address.port);
          }
        });
        createdServer.on("error", error => {
          reject(error);
        });
        server = createdServer;
      });
      break;
    } catch (err) {
      if (err.code !== "EADDRINUSE") {
        throw err;
      }
      preferredPort = 0;
    }
  }
  process.on("SIGINT", () => {
    if (server != null) {
      server.close();
    }
  });
  process.on("SIGTERM", () => {
    if (server != null) {
      server.close();
    }
  });

  if (server == null) {
    throw new Error("Server could not start");
  }
  return {
    port,
    server
  };
}
