module.exports = {
  apps: [
    // {
    //   name: "backend",
    //   script: "npm",
    //   args: "run start:server",
    //   cwd: "./back",
    // },
    {
      name: "frontend",
      script: "serve",
      args: "-s build",
      cwd: "./front",
    },
    {
      script: "./back/index.js",
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "300M", // 프로세스의 메모리가 300MB에 도달하면 reload 실행
    },
  ],
};
