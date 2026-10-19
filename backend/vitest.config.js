const coverageThreshold = Number(process.env.COVERAGE_THRESHOLD ?? 95);

export default {
  test: {
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage",
      reporter: ["text", "json-summary", "html", "lcov"],
      include: [
        "src/errors/**/*.js",
        "src/middlewares/**/*.js",
        "src/modules/**/*.dto.js",
        "src/modules/**/*.service.js",
      ],
      thresholds: {
        branches: coverageThreshold,
        lines: coverageThreshold,
      },
    },
    include: ["tests/**/*.test.js"],
  },
};
