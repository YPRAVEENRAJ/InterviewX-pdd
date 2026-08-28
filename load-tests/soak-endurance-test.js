/**
 * ============================================================================
 * InterviewX Platform — TEST 4: Soak / Endurance Test (k6 Script)
 * Sustained normal load over an extended period (10 minutes)
 * Goal: Detect memory leaks, resource exhaustion, and gradual degradation
 * ============================================================================
 * Run: k6 run --out json=soak-results.json load-tests/soak-endurance-test.js
 * ============================================================================
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

const errorRate         = new Rate('error_rate');
const responseTrend     = new Trend('response_trend');
const loginDuration     = new Trend('login_duration');
const totalRequests     = new Counter('total_requests');
const consecutiveErrors = new Counter('consecutive_errors');

export const options = {
  // SOAK / ENDURANCE TEST: Normal load held for a long time
  // In CI we run 3 minutes; for full soak run locally for 10+ minutes
  stages: [
    { duration: '30s', target: 50  },   // Ramp up to normal load
    { duration: '2m',  target: 100 },   // Sustain normal load for 2 minutes (CI-friendly)
    // For real soak: { duration: '8m', target: 100 }  — 10 min total
    { duration: '30s', target: 0   },   // Graceful ramp down
  ],
  // Total CI duration: ~3 minutes | Full soak: ~10 minutes

  thresholds: {
    'http_req_failed':   ['rate<0.05'],   // Must stay below 5% error rate throughout
    'http_req_duration': ['p(95)<3000'],  // P95 must not degrade beyond 3s
    'http_req_duration': ['avg<800'],     // Average must stay below 800ms
    'error_rate':        ['rate<0.05'],
  },

  tags: {
    test_type:   'soak_endurance',
    project:     'interviewx',
    environment: 'local',
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';
const HEADERS  = { 'Content-Type': 'application/json' };

// Track per-minute snapshots for degradation analysis
const minuteSnapshots = [];
let   lastMinuteMark  = 0;

export default function () {
  const vuId       = __VU;
  const elapsed    = Math.floor(Date.now() / 60000);

  // ── 1. Health Check (every iteration — primary endurance signal) ──
  {
    const start = Date.now();
    const res = http.get(`${BASE_URL}/api/health`, {
      tags: { endpoint: 'health', minute: String(elapsed) },
    });
    responseTrend.add(Date.now() - start);
    totalRequests.add(1);

    const ok = check(res, {
      '[Soak-Health] 200':               (r) => r.status === 200,
      '[Soak-Health] under 500ms':       (r) => r.timings.duration < 500,
      '[Soak-Health] body valid':        (r) => r.json('status') === 'online',
    });
    errorRate.add(!ok);
    if (!ok) consecutiveErrors.add(1);
  }

  sleep(0.5);

  // ── 2. Login (rotates through user pool to simulate real traffic diversity) ──
  {
    const userIndex = (vuId * 7 + __ITER) % 100;
    const start = Date.now();
    const res = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify({
        email:    `soakuser_${userIndex}@endurancetest.com`,
        password: 'endurancePass',
      }),
      { headers: HEADERS, tags: { endpoint: 'login' } }
    );
    loginDuration.add(Date.now() - start);
    totalRequests.add(1);

    const ok = check(res, {
      '[Soak-Login] 200':               (r) => r.status === 200,
      '[Soak-Login] token present':     (r) => r.json('token') !== undefined,
      '[Soak-Login] under 1.5s':        (r) => r.timings.duration < 1500,
    });
    errorRate.add(!ok);

    // ── 3. Authenticated profile fetch (ensures session handling works over time) ──
    if (res.status === 200 && res.json('token')) {
      const token = res.json('token');
      const authHeaders = { ...HEADERS, Authorization: `Bearer ${token}` };

      const meRes = http.get(`${BASE_URL}/api/auth/me`, {
        headers: authHeaders,
        tags: { endpoint: 'me' },
      });
      totalRequests.add(1);
      check(meRes, {
        '[Soak-Profile] 200':            (r) => r.status === 200,
        '[Soak-Profile] under 800ms':    (r) => r.timings.duration < 800,
      });
    }
  }

  sleep(0.5);

  // ── 4. Interview + Answer evaluation loop (simulates full session) ──
  {
    const companies = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Netflix', 'Uber', 'Apple'];
    const roles     = ['SDE', 'AI Engineer', 'ML Engineer', 'Data Scientist', 'DevOps'];

    const startRes = http.post(
      `${BASE_URL}/api/interviews/start`,
      JSON.stringify({
        job_role:       roles[vuId % roles.length],
        company:        companies[vuId % companies.length],
        difficulty:     'Medium',
        interview_type: 'Technical',
      }),
      { headers: HEADERS, tags: { endpoint: 'interview_start' } }
    );
    responseTrend.add(startRes.timings.duration);
    totalRequests.add(1);

    check(startRes, {
      '[Soak-Interview] 200':           (r) => r.status === 200,
      '[Soak-Interview] under 2s':      (r) => r.timings.duration < 2000,
    });
    errorRate.add(startRes.status !== 200);

    sleep(0.3);

    // Evaluate an answer
    const evalRes = http.post(
      `${BASE_URL}/api/interviews/evaluate-answer`,
      JSON.stringify({
        question_number: 1,
        answer:          'I would use Redis with a sliding window algorithm and distributed locks for rate limiting at scale.',
      }),
      { headers: HEADERS, tags: { endpoint: 'evaluate' } }
    );
    responseTrend.add(evalRes.timings.duration);
    totalRequests.add(1);

    check(evalRes, {
      '[Soak-Evaluate] 200':            (r) => r.status === 200,
      '[Soak-Evaluate] under 2s':       (r) => r.timings.duration < 2000,
    });
  }

  sleep(0.3);

  // ── 5. Resume analysis (memory-intensive — key for endurance leak detection) ──
  {
    const start = Date.now();
    const res = http.post(
      `${BASE_URL}/api/resume/analyze`,
      JSON.stringify({
        resume_text: `
          Software Engineer with 3 years experience in React, Node.js, Python, AWS, Docker.
          Expertise in System Design, REST APIs, PostgreSQL, MongoDB, Redis, Kafka.
          Led migration of monolith to microservices reducing P99 latency by 45%.
        `,
      }),
      { headers: HEADERS, tags: { endpoint: 'resume' } }
    );
    responseTrend.add(Date.now() - start);
    totalRequests.add(1);

    check(res, {
      '[Soak-Resume] 200':              (r) => r.status === 200,
      '[Soak-Resume] under 2.5s':       (r) => r.timings.duration < 2500,
    });
    errorRate.add(res.status !== 200);
  }

  sleep(0.5);

  // ── 6. Coding submission ──
  {
    const start = Date.now();
    const res = http.post(
      `${BASE_URL}/api/coding/submit`,
      JSON.stringify({
        problem_id: 'lru-cache',
        language:   'javascript',
        code:       `
          class LRUCache {
            constructor(capacity) { this.map = new Map(); this.capacity = capacity; }
            get(key) { if (!this.map.has(key)) return -1; const v = this.map.get(key); this.map.delete(key); this.map.set(key, v); return v; }
            put(key, value) { if (this.map.has(key)) this.map.delete(key); else if (this.map.size === this.capacity) this.map.delete(this.map.keys().next().value); this.map.set(key, value); }
          }
        `,
      }),
      { headers: HEADERS, tags: { endpoint: 'coding' } }
    );
    responseTrend.add(Date.now() - start);
    totalRequests.add(1);

    check(res, {
      '[Soak-Coding] 200':              (r) => r.status === 200,
      '[Soak-Coding] under 2s':         (r) => r.timings.duration < 2000,
    });
    errorRate.add(res.status !== 200);
  }

  sleep(1.0); // Longer think time — more realistic user pacing for soak
}

export function handleSummary(data) {
  const summary = {
    test_type:           'Soak / Endurance Test',
    sustained_vus:       100,
    duration:            '3 minutes (CI) | 10 minutes (full soak)',
    timestamp:           new Date().toISOString(),
    total_requests:      data.metrics.http_reqs?.values?.count || 0,
    rps:                 Math.round(data.metrics.http_reqs?.values?.rate || 0),
    avg_response_ms:     Math.round(data.metrics.http_req_duration?.values?.avg || 0),
    min_response_ms:     Math.round(data.metrics.http_req_duration?.values?.min || 0),
    max_response_ms:     Math.round(data.metrics.http_req_duration?.values?.max || 0),
    p90_response_ms:     Math.round(data.metrics.http_req_duration?.values?.['p(90)'] || 0),
    p95_response_ms:     Math.round(data.metrics.http_req_duration?.values?.['p(95)'] || 0),
    p99_response_ms:     Math.round(data.metrics.http_req_duration?.values?.['p(99)'] || 0),
    error_rate_pct:      ((data.metrics.http_req_failed?.values?.rate || 0) * 100).toFixed(2),
    memory_leak_risk:    data.metrics.http_req_duration?.values?.avg > 800 ? 'POSSIBLE — avg degraded' : 'OK',
    raw:                 data,
  };

  console.log('\n════════════════════════════════════════════════');
  console.log('  SOAK / ENDURANCE TEST — RESULTS SUMMARY');
  console.log(`  Sustained VUs   : 100`);
  console.log(`  Total Requests  : ${summary.total_requests}`);
  console.log(`  RPS (sustained) : ${summary.rps} req/sec`);
  console.log(`  Avg Response    : ${summary.avg_response_ms}ms`);
  console.log(`  Min Response    : ${summary.min_response_ms}ms`);
  console.log(`  Max Response    : ${summary.max_response_ms}ms`);
  console.log(`  P95 Response    : ${summary.p95_response_ms}ms`);
  console.log(`  Error Rate      : ${summary.error_rate_pct}%`);
  console.log(`  Memory Leak     : ${summary.memory_leak_risk}`);
  console.log('════════════════════════════════════════════════\n');

  return {
    'load-tests/results/soak-summary.json': JSON.stringify(summary, null, 2),
    stdout: `\nSoak Test Complete — RPS: ${summary.rps} | P95: ${summary.p95_response_ms}ms | Errors: ${summary.error_rate_pct}% | Leak Risk: ${summary.memory_leak_risk}\n`,
  };
}
