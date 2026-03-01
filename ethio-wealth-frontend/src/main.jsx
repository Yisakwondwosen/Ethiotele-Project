import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import * as Sentry from '@sentry/react'

Sentry.init({
    dsn: "https://e6599a5fe332d8905bd34fd4f96de9ab@o4510956909035520.ingest.us.sentry.io/4510956938067968",
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
