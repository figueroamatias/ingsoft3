const coverageThreshold = Number(process.env.COVERAGE_THRESHOLD ?? 95);

export default {
  test: {
    environment: "happy-dom",
    setupFiles: ["./tests/setup.js"],
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage",
      reporter: ["text", "json-summary", "html", "lcov"],
      include: ["src/**/*.{js,jsx}"],
      exclude: [
        "src/main.jsx",
        "src/App.jsx",
        "src/config/sentry.js",
      ],
      thresholds: {
        branches: coverageThreshold,
        lines: coverageThreshold,
      },
    },
    include: ["tests/**/*.test.{js,jsx}"],
  },
};
