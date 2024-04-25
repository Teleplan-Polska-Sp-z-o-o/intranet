interface ServerConfig {
  origin: string | undefined;
  port: number | undefined;
}

const nodeConfig: ServerConfig = {
  origin: "http://172.20.176.1",
  // origin: "https://BYDIntranet.reconext.com",
  port: 3000,
};

export { nodeConfig };
