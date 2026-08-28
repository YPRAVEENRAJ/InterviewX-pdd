/**
 * ============================================================================
 * InterviewX Platform — TEST 3: Spike Test (k6 Script)
 * Sudden massive burst of users — goes from 0 to 500 VUs in 5 seconds
 * Goal: Test how the system handles a sudden traffic explosion
 * ============================================================================
 * Run: k6 run --out json=spike-results.json load-tests/spike-test.js
 * ============================================================================
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

const errorRate       = new Rate('error_rate');
const spikeRtt        = new Trend('spike_round_trip');
const loginDuration   = new Trend('login_during_spike');
const totalRequests   = new Counter('total_requests');

export const options = {
  // SPIKE TEST: Sudden massive burst — tests auto-scaling and queue behavior
  stages: [
    { duration: '10s', target: 10  },   // Normal idle: 10 VUs
    { duration: '5s',  target: 500 },   // SPIKE: Instantly jump to 500 VUs
    { duration: '30s', target: 500 },   // Hold spike for 30 seconds
    { duration: '5s',  target: 10  },   // Sudden drop back to normal
    { duration: '15s', target: 10  },   // Observe recovery at normal load
    { duration: '5s',  target: 0   },   // Ramp down
  ],
  // Total duration: ~70 seconds

  thresholds: {
    'http_req_failed':   ['rate<0.15'],   // Allow up to 15% failures during spike
    'http_req_duration': ['p(95)<8000'],  // P95 under 8s during spike is acceptable
    'error_rate':        ['rate<0.15'],
  },

  tags: {
    test_type:   'spike_test',
    project:     'interviewx',
    environment: 'local',
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';
const HEADERS  = { 'Content-Type': 'application/json' };

export default function () {
  const vuId = __VU;

  // ── 1. Health Check during spike ──
  {
    const start = Date.now();
    const res = http.get(`${BASE_URL}/api/health`, {
      tags:    { endpoint: 'health' },
      timeout: '10s',
    });
    spikeRtt.add(Date.now() - start);
    totalRequests.add(1);

    const ok = check(res, {
      '[Spike-Health] not 5xx':     (r) => r.status < 500,
      '[Spike-Health] not timeout': (r) => r.status !== 0,
    });
    errorRate.add(!ok);
  }

  sleep(0.05);

  // ── 2. Login burst during spike ──
  {
    const start = Date.now();
    const res = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify({
        email:    `spike_${vuId}@bursttest.com`,
        password: 'spikepassword',
      }),
      {
        headers: HEADERS,
        tags:    { endpoint: 'login' },
        timeout: '15s',
      }
    );
    loginDuration.add(Date.now() - start);
    totalRequests.add(1);

    const ok = check(res, {
      '[Spike-Login] not 5xx':       (r) => r.status < 500,
      '[Spike-Login] responded':     (r) => r.status !== 0,
      '[Spike-Login] has body':      (r) => r.body?.length > 0,
    });
    errorRate.add(!ok);
  }

  sleep(0.05);

  // ── 3. Interview request during spike (most expensive endpoint) ──
  {
    const start = Date.now();
    const res = http.post(
      `${BASE_URL}/api/interviews/start`,
      JSON.stringify({
        job_role:  'AI Engineer',
        company:   'Google',
        difficulty: 'Hard',
        interview_type: 'Technical',
      }),
      {
        headers: HEADERS,
        tags:    { endpoint: 'interview' },
        timeout: '15s',
      }
    );
    spikeRtt.add(Date.now() - start);
    totalRequests.add(1);

    check(res, {
      '[Spike-Interview] responded': (r) => r.status !== 0,
      '[Spike-Interview] not 5xx':   (r) => r.status < 500,
    });
    errorRate.add(res.status >= 500 || res.status === 0);
  }

  sleep(0.1);
}

export function handleSummary(data) {
  const summary = {
    test_type:       'Spike Test',
    peak_vus:        500,
    spike_duration:  '5 seconds (0 to 500 VUs)',
    total_duration:  '~70 seconds',
    timestamp:       new Date().toISOString(),
    total_requests:  data.metrics.http_reqs?.values?.count || 0,
    rps:             Math.round(data.metrics.http_reqs?.values?.rate || 0),
    avg_response_ms: Math.round(data.metrics.http_req_duration?.values?.avg || 0),
    min_response_ms: Math.round(data.metrics.http_req_duration?.values?.min || 0),
    max_response_ms: Math.round(data.metrics.http_req_duration?.values?.max || 0),
    p90_response_ms: Math.round(data.metrics.http_req_duration?.values?.['p(90)'] || 0),
    p95_response_ms: Math.round(data.metrics.http_req_duration?.values?.['p(95)'] || 0),
    p99_response_ms: Math.round(data.metrics.http_req_duration?.values?.['p(99)'] || 0),
    error_rate_pct:  ((data.metrics.http_req_failed?.values?.rate || 0) * 100).toFixed(2),
    raw:             data,
  };

  console.log('\n════════════════════════════════════════════════');
  console.log('  SPIKE TEST — RESULTS SUMMARY');
  console.log(`  Spike: 0 → 500 VUs in 5 seconds`);
  console.log(`  Total Requests  : ${summary.total_requests}`);
  console.log(`  RPS at spike    : ${summary.rps} req/sec`);
  console.log(`  Avg Response    : ${summary.avg_response_ms}ms`);
  console.log(`  Max Response    : ${summary.max_response_ms}ms`);
  console.log(`  P95 Response    : ${summary.p95_response_ms}ms`);
  console.log(`  Error Rate      : ${summary.error_rate_pct}%`);
  console.log('════════════════════════════════════════════════\n');

  return {
    'load-tests/results/spike-summary.json': JSON.stringify(summary, null, 2),
    stdout: `\nSpike Test Complete — RPS: ${summary.rps} | P95: ${summary.p95_response_ms}ms | Errors: ${summary.error_rate_pct}%\n`,
  };
}
