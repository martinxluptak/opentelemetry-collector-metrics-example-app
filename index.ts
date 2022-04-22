import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { MeterProvider } from '@opentelemetry/sdk-metrics-base';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

// Optional and only needed to see the internal diagnostic logging (during development)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const exporter = new OTLPMetricExporter();

const meter = new MeterProvider({
    exporter,
    interval: 10 * 1000,
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'my-distinguishing-metric-service',
    }),
}).getMeter('example-exporter-collector');

const requestCounter = meter.createCounter('requests', {
    description: 'Example of a Counter',
});

const userId = 'myUserId';
const statusCode = 500;

const labels = { userId, statusCode };

setInterval(() => {
    // @ts-ignore
    requestCounter.add(1, labels);
}, 1000);
