import * as React from "react";
import * as ReactDOM from "react-dom";
import PanelContainer from "./components/PanelContainer";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

// Add Sentry init
Sentry.init({
    dsn: "https://5a274b730546497688f1f6964b73c71d@o992005.ingest.sentry.io/5949255",
    integrations: [new Integrations.BrowserTracing()],
  
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });


ReactDOM.render(<PanelContainer />,
    document.getElementById('root_gg')
)