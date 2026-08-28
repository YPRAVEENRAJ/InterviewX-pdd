/**
 * ============================================================================
 * InterviewX Platform — TEST 1: Baseline / Load Test (k6 Script)
 * 100 Virtual Users · 1 Minute Duration
 * Goal: Ensure response times stay fast under normal expected concurrent load
 * ============================================================================
 * Install k6: https://grafana.com/docs/k6/latest/get-started/installation/
 * Run: k6 run --out json=baseline-results.json load-tests/baseline-load-test.js
 * ============================================================================
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ─── CUSTOM METRICS ───────────────────────────────────────────────────────────
const errorRate        = new Rate('error_rate');
const loginDuration    = new Trend('login_duration');
const healthDuration   = new Trend('health_check_duration');
const interviewDuration = new Trend('interview_start_duration');
const resumeDuration   = new Trend('resume_analyze_duration');
const codingDuration   = new Trend('coding_submit_duration');
const totalRequests    = new Counter('total_requests');

// ─── TEST CONFIGURATION ───────────────────────────────────────────────────────
export const options = {
  // BASELINE LOAD TEST: 100 Virtual Users for 1 Minute
  stages: [
    { duration: '10s', target: 100 },  // Ramp up to 100 VUs in 10 seconds
    { duration: '50s', target: 100 },  // Hold 100 VUs for 50 seconds (steady state)
    { duration: '10s', target: 0   },  // Ramp down to 0 VUs
  ],

  // PERFORMANCE THRESHOLDS (SLO definitions)
  thresholds: {
    // HTTP request failure rate must be below 5%
    'http_req_failed':            ['rate<0.05'],
    // 95th percentile response time must be below 2 seconds
    'http_req_duration':          ['p(95)<2000'],
    // Average response time must be below 500ms
    'http_req_duration':          ['avg<500'],
    // Login endpoint specifically under 1 second average
    'login_duration':             ['avg<1000'],
    // Health check must respond within 200ms at p(99)
    'health_check_duration':      ['p(99)<200'],
    // Custom error rate must be below 5%
    'error_rate':                 ['rate<0.05'],
  },

  // Test metadata for reporting
  tags: {
    test_type:    'baseline_load',
    project:      'interviewx',
    environment:  'local',
    version:      '1.0.0',
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

// ─── TEST SETUP: Shared data ──────────────────────────────────────────────────
const testUsers = [
  { email: 'candidate@gmail.com',        password: 'password123' },
  { email: 'sarah.dev@gmail.com',        password: 'password123' },
  { email: 'praveen@interviewx.com',     password: 'password123' },
  { email: `loadtest_${Date.now()}@test.com`, password: 'testpass123' },
];

// ─── MAIN TEST SCENARIO ────────────────────────────────────────────────────────
export default function () {
  const user = testUsers[Math.floor(Math.random() * testUsers.length)];
  const headers = { 'Content-Type': 'application/json' };

  // ── 1. Health Check ──
  {
    const start = Date.now();
    const res = http.get(`${BASE_URL}/api/health`, { tags: { endpoint: 'health' } });
    healthDuration.add(Date.now() - start);
    totalRequests.add(1);

    const ok = check(res, {
      '[Health] status is 200':           (r) => r.status === 200,
      '[Health] body has status field':   (r) => r.json('status') === 'online',
      '[Health] response under 500ms':    (r) => r.timings.duration < 500,
    });
    errorRate.add(!ok);
  }

  sleep(0.3);

  // ── 2. User Login ──
  {
    const start = Date.now();
    const res = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify({ email: user.email, password: user.password }),
      { headers, tags: { endpoint: 'login' } }
    );
    loginDuration.add(Date.now() - start);
    totalRequests.add(1);

    const ok = check(res, {
      '[Login] status is 200':            (r) => r.status === 200,
      '[Login] returns token':            (r) => r.json('token') !== undefined,
      '[Login] response under 1s':        (r) => r.timings.duration < 1000,
      '[Login] body has user object':     (r) => r.json('user') !== undefined,
    });
    errorRate.add(!ok);

    // ── 3. Get User Profile (Authenticated) ──
    if (res.status === 200 && res.json('token')) {
      const token = res.json('token');
      const authHeaders = { ...headers, Authorization: `Bearer ${token}` };

      const meRes = http.get(`${BASE_URL}/api/auth/me`, { headers: authHeaders, tags: { endpoint: 'me' } });
      totalRequests.add(1);
      check(meRes, {
        '[Profile] status is 200':         (r) => r.status === 200,
        '[Profile] has user data':         (r) => r.json('user') !== undefined,
        '[Profile] response under 800ms':  (r) => r.timings.duration < 800,
      });
    }
  }

  sleep(0.2);

  // ── 4. Start Interview Session ──
  {
    const start = Date.now();
    const res = http.post(
      `${BASE_URL}/api/interviews/start`,
      JSON.stringify({
        job_role: 'Full Stack Engineer',
        company: 'Google',
        difficulty: 'Medium',
        interview_type: 'Technical',
      }),
      { headers, tags: { endpoint: 'interview_start' } }
    );
    interviewDuration.add(Date.now() - start);
    totalRequests.add(1);

    check(res, {
      '[Interview] status is 200':        (r) => r.status === 200,
      '[Interview] has interview_id':     (r) => r.json('interview_id') !== undefined,
      '[Interview] has first_question':   (r) => r.json('first_question') !== undefined,
      '[Interview] response under 1.5s':  (r) => r.timings.duration < 1500,
    });
    errorRate.add(res.status !== 200);
  }

  sleep(0.2);

  // ── 5. Resume Analysis ──
  {
    const start = Date.now();
    const res = http.post(
      `${BASE_URL}/api/resume/analyze`,
      JSON.stringify({ resume_text: 'React Node.js Python AWS Docker Kubernetes' }),
      { headers, tags: { endpoint: 'resume' } }
    );
    resumeDuration.add(Date.now() - start);
    totalRequests.add(1);

    check(res, {
      '[Resume] status is 200':           (r) => r.status === 200,
      '[Resume] has ats_score':           (r) => r.json('ats_score') !== undefined,
      '[Resume] response under 2s':       (r) => r.timings.duration < 2000,
    });
    errorRate.add(res.status !== 200);
  }

  sleep(0.2);

  // ── 6. Coding Submission ──
  {
    const start = Date.now();
    const res = http.post(
      `${BASE_URL}/api/coding/submit`,
      JSON.stringify({
        problem_id: 'two-sum',
        language: 'javascript',
        code: 'function twoSum(nums, target) { return [0, 1]; }',
      }),
      { headers, tags: { endpoint: 'coding' } }
    );
    codingDuration.add(Date.now() - start);
    totalRequests.add(1);

    check(res, {
      '[Coding] status is 200':           (r) => r.status === 200,
      '[Coding] has status field':        (r) => r.json('status') !== undefined,
      '[Coding] response under 2s':       (r) => r.timings.duration < 2000,
    });
    errorRate.add(res.status !== 200);
  }

  sleep(0.5);
}

// ─── TEARDOWN: Print Summary ───────────────────────────────────────────────────
export function handleSummary(data) {
  const summary = {
    test_type:          'Baseline Load Test',
    vus:                100,
    duration:           '1 minute',
    timestamp:          new Date().toISOString(),
    total_requests:     data.metrics.http_reqs?.values?.count || 0,
    rps:                Math.round(data.metrics.http_reqs?.values?.rate || 0),
    avg_response_ms:    Math.round(data.metrics.http_req_duration?.values?.avg || 0),
    min_response_ms:    Math.round(data.metrics.http_req_duration?.values?.min || 0),
    max_response_ms:    Math.round(data.metrics.http_req_duration?.values?.max || 0),
    p90_response_ms:    Math.round(data.metrics.http_req_duration?.values?.['p(90)'] || 0),
    p95_response_ms:    Math.round(data.metrics.http_req_duration?.values?.['p(95)'] || 0),
    p99_response_ms:    Math.round(data.metrics.http_req_duration?.values?.['p(99)'] || 0),
    error_rate_pct:     ((data.metrics.http_req_failed?.values?.rate || 0) * 100).toFixed(2),
    thresholds_passed:  Object.values(data.thresholds || {}).every(t => !t.ok === false),
    raw:                data,
  };

  console.log('\n════════════════════════════════════════════════');
  console.log('  BASELINE LOAD TEST — RESULTS SUMMARY');
  console.log('════════════════════════════════════════════════');
  console.log(`  Total Requests  : ${summary.total_requests}`);
  console.log(`  Req/sec (RPS)   : ${summary.rps} req/sec`);
  console.log(`  Avg Response    : ${summary.avg_response_ms}ms`);
  console.log(`  Min Response    : ${summary.min_response_ms}ms`);
  console.log(`  Max Response    : ${summary.max_response_ms}ms`);
  console.log(`  P95 Response    : ${summary.p95_response_ms}ms`);
  console.log(`  Error Rate      : ${summary.error_rate_pct}%`);
  console.log('════════════════════════════════════════════════\n');

  return {
    'load-tests/results/baseline-summary.json': JSON.stringify(summary, null, 2),
    stdout: `\nBaseline Load Test Complete — RPS: ${summary.rps} | Avg: ${summary.avg_response_ms}ms | Errors: ${summary.error_rate_pct}%\n`,
  };
}
