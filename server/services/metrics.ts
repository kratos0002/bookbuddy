import { Registry, Gauge, Counter } from 'prom-client';
import os from 'os';

const register = new Registry();

// Create metrics
const cpuUsageGauge = new Gauge({
  name: 'cpu_usage_percent',
  help: 'Current CPU usage in percentage',
  registers: [register]
});

const memoryUsageGauge = new Gauge({
  name: 'memory_usage_percent',
  help: 'Current memory usage in percentage',
  registers: [register]
});

const requestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
  registers: [register]
});

// Update system metrics every 5 seconds
setInterval(() => {
  // CPU Usage
  const cpuUsage = os.loadavg()[0] * 100 / os.cpus().length;
  cpuUsageGauge.set(cpuUsage);

  // Memory Usage
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;
  memoryUsageGauge.set(memoryUsage);
}, 5000);

export const metricsClient = {
  // Increment request counter
  incrementRequests(method: string, path: string, status: number) {
    requestCounter.inc({ method, path, status: status.toString() });
  },

  // Get current server metrics
  async getServerMetrics() {
    return {
      cpu: Math.round(Number(cpuUsageGauge.get())),
      memory: Math.round(Number(memoryUsageGauge.get())),
      requests: Math.round(Number(await requestCounter.get()))
    };
  },

  // Get metrics for Prometheus
  async getPrometheusMetrics() {
    return register.metrics();
  }
}; 