import { appendFile, readFile } from "node:fs/promises";

const [reportPath, projectName] = process.argv.slice(2);

if (!reportPath || !projectName) {
  throw new Error(
    "Uso: node scripts/write-coverage-summary.mjs <coverage-summary.json> <proyecto>",
  );
}

const report = JSON.parse(await readFile(reportPath, "utf8"));
const metrics = ["lines", "branches", "functions", "statements"];
const rows = metrics.map((metric) => {
  const value = report.total[metric];
  return `| ${metric} | ${value.pct}% | ${value.covered}/${value.total} |`;
});

const markdown = [
  `## Coverage ${projectName}`,
  "",
  "| Métrica | Cobertura | Cubiertos/Total |",
  "| --- | ---: | ---: |",
  ...rows,
  "",
].join("\n");

console.log(markdown);

if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown, "utf8");
}
