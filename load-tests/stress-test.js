/**
 * ============================================================================
 * InterviewX Platform — TEST 2: Stress Test (k6 Script)
 * Ramp beyond normal capacity to find the breaking point
 * Goal: Determine max throughput and when the system degrades or breaks
 * ============================================================================
 * Run: k6 run --out json=stress-results.json load-tests/stress-test.js
 * ============================================================================
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

const errorRate     = new Rate('error_rate');
const loginDuration = new Trend('login_duration');
const apiDuration   = new Trend('api_duration');
const totalRequests = new Counter('total_requests');

export const options = {
  // STRESS TEST: Ramp up far beyond normal load to find breaking point
  stages: [
    { duration: '10s', target: 50  },   // Warm up: 50 VUs
    { duration: '15s', target: 100 },   // Normal baseline: 100 VUs
    { duration: '15s', target: 200 },   // 2x load: Push to 200 VUs
    { duration: '15s', target: 300 },   // 3x load: Push to 300 VUs
    { duration: '15s', target: 400 },   // 4x load: Near breaking point
    { duration: '15s', target: 500 },   // 5x load: Stress zone
    { duration: '15s', target: 0   },   // Cool down: Ramp to 0
  ],
  // Total duration: ~1m40s

  thresholds: {
    'http_req_failed':   ['rate<0.10'],   // Allow up to 10% errors under stress
    'http_req_duration': ['p(95)<5000'],  // P95 must be under 5 seconds
    'error_rate':        ['rate<0.10'],
  },

  tags: {
    test_type:   'stress_test',
    project:     'interviewx',
    environment: 'local',
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';
const HEADERS  = { 'Content-Type': 'application/json' };

export default function () {
  const vuId = __VU;
  const iter = __ITER;

  // ── 1. Health Check (always) ──
  {
    const start = Date.now();
    const res = http.get(`${BASE_URL}/api/health`, { tags: { endpoint: 'health' } });
    apiDuration.add(Date.now() - start);
    totalRequests.add(1);

    const ok = check(res, {
      '[Stress-Health] 200':        (r) => r.status === 200,
      '[Stress-Health] <1s':        (r) => r.timings.duration < 1000,
    });
    errorRate.add(!ok);
  }

  sleep(0.1);

  // ── 2. Login under stress ──
  {
    const email = `stressuser_${vuId}_${iter % 50}@loadtest.com`;
    const start = Date.now();
    const res = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify({ email, password: 'testpassword' }),
      { headers: HEADERS, tags: { endpoint: 'login' } }
    );
    loginDuration.add(Date.now() - start);
    totalRequests.add(1);

    const ok = check(res, {
      '[Stress-Login] status 200':  (r) => r.status === 200,
      '[Stress-Login] has token':   (r) => r.json('token') !== undefined,
      '[Stress-Login] <3s':         (r) => r.timings.duration < 3000,
    });
    errorRate.add(!ok);
  }

  sleep(0.1);

  // ── 3. Interview start under stress ──
  {
    const companies = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple'];
    const roles     = ['SDE', 'AI Engineer', 'ML Engineer', 'Data Scientist', 'Full Stack'];
    const start = Date.now();
    const res = http.post(
      `${BASE_URL}/api/interviews/start`,
      JSON.stringify({
        job_role:       roles[vuId % roles.length],
        company:        companies[vuId % companies.length],
        difficulty:     'Hard',
        interview_type: 'Technical',
      }),
      { headers: HEADERS, tags: { endpoint: 'interview' } }
    );
    apiDuration.add(Date.now() - start);
    totalRequests.add(1);

    check(res, {
      '[Stress-Interview] 200':     (r) => r.status === 200,
      '[Stress-Interview] <3s':     (r) => r.timings.duration < 3000,
    });
    errorRate.add(res.status !== 200);
  }

  sleep(0.15);

  // ── 4. Resume analysis under stress ──
  {
    const start = Date.now();
    const res = http.post(
      `${BASE_URL}/api/resume/analyze`,
      JSON.stringify({ resume_text: 'Python React AWS Docker Kubernetes System Design GraphQL' }),
      { headers: HEADERS, tags: { endpoint: 'resume' } }
    );
    apiDuration.add(Date.now() - start);
    totalRequests.add(1);

    check(res, {
      '[Stress-Resume] 200':        (r) => r.status === 200,
      '[Stress-Resume] <3s':        (r) => r.timings.duration < 3000,
    });
    errorRate.add(res.status !== 200);
  }

  sleep(0.1);
}

export function handleSummary(data) {
  const summary = {
    test_type:       'Stress Test',
    max_vus:         500,
    duration:        '~1m40s (staged ramp)',
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
  console.log('  STRESS TEST — RESULTS SUMMARY');
  console.log(`  Peak VUs        : 500`);
  console.log(`  Total Requests  : ${summary.total_requests}`);
  console.log(`  RPS (peak)      : ${summary.rps} req/sec`);
  console.log(`  Avg Response    : ${summary.avg_response_ms}ms`);
  console.log(`  Max Response    : ${summary.max_response_ms}ms`);
  console.log(`  P95 Response    : ${summary.p95_response_ms}ms`);
  console.log(`  Error Rate      : ${summary.error_rate_pct}%`);
  console.log('════════════════════════════════════════════════\n');

  return {
    'load-tests/results/stress-summary.json': JSON.stringify(summary, null, 2),
    stdout: `\nStress Test Complete — Peak RPS: ${summary.rps} | P95: ${summary.p95_response_ms}ms | Errors: ${summary.error_rate_pct}%\n`,
  };
}
