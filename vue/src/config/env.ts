interface ServerConfig {
  origin: string | undefined;
  port: number | undefined;
}

const nodeConfig: ServerConfig = {
<<<<<<< HEAD
  // origin: "http://172.20.176.1",
  origin: "https://BYDIntranet.reconext.com",
=======
  origin: "http://172.20.176.1",
  // origin: "https://dev-bydintranet.reconext.com",
  // origin: "https://BYDIntranet.reconext.com",
>>>>>>> 7e0d7727a6c8f5003911200fea6a98f072c9d380
  port: 3000,
};

export { nodeConfig };
