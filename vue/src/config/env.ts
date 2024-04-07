interface ServerConfig {
  origin: string | undefined;
  port: number | undefined;
}

const nodeConfig: ServerConfig = {
  origin: "http://172.20.176.1",
  port: 3000,
};

export { nodeConfig };
