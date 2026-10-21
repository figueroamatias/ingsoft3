import * as Sentry from "@sentry/react";

const runtimeConfig = window.__INGSOFT3_RUNTIME_CONFIG__ ?? {};

if (runtimeConfig.sentryDsn) {
  Sentry.init({
    dsn: runtimeConfig.sentryDsn,
    environment: runtimeConfig.sentryEnvironment || window.location.hostname,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1,
    tracePropagationTargets: [window.location.origin],
  });
}
