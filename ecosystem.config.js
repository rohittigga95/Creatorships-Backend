module.exports = {
    apps: [
      {
        name: "backend",
        script: "index.js",
        instances: "2",
        autorestart: true,
        max_memory_restart: "1G",
        env: {
          PORT: 4000,
        },
      }
    ]
  }