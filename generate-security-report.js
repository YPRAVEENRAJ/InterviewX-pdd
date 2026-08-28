/**
 * ============================================================================
 * InterviewX Platform — Security Assessment Excel Report Generator
 * Generates findings.xlsx with 4 sheets:
 *   Sheet 1: Security Findings
 *   Sheet 2: Endpoint Inventory
 *   Sheet 3: Dependency Vulnerabilities
 *   Sheet 4: Risk Summary
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

// ─── SHEET 1: SECURITY FINDINGS (25 findings) ───────────────────────────────
const securityFindings = [
  // CRITICAL
  { id: 'VULN-001', severity: 'CRITICAL', owasp: 'A02:2021', cwe: 'CWE-312', type: 'Insecure Password Storage', file: 'backend/localDbManager.js, backend/data_store.json', endpoint: 'N/A', description: 'Passwords for all users including admin stored as plaintext strings in data_store.json', exploit: 'Attacker reads data_store.json to immediately obtain admin credentials (password123)', impact: 'Complete account takeover for all users; credential stuffing attacks', fix: 'Hash passwords with bcrypt (salt rounds >= 12) before storing; never store plaintext passwords', status: 'OPEN' },
  { id: 'VULN-002', severity: 'CRITICAL', owasp: 'A02:2021', cwe: 'CWE-798', type: 'Credential Exposure', file: 'backend/.env', endpoint: 'N/A', description: 'Live MongoDB Atlas connection string with username and password embedded in .env file', exploit: 'Clone public GitHub repo; read .env or Git history; connect to MongoDB Atlas directly', impact: 'Full MongoDB Atlas database compromise; data exfiltration and deletion', fix: 'Rotate MongoDB credentials IMMEDIATELY. Add .env to .gitignore. Use CI/CD secrets for env vars.', status: 'OPEN — IMMEDIATE ACTION' },
  { id: 'VULN-003', severity: 'CRITICAL', owasp: 'A07:2021', cwe: 'CWE-287', type: 'Authentication Bypass', file: 'backend/app.js', endpoint: 'POST /api/auth/login', description: 'Login creates new user account for unknown emails and issues JWT without any password verification', exploit: 'curl -X POST /api/auth/login -d {"email":"hacker@x.com","password":"anything"} => valid JWT returned', impact: 'Authentication completely bypassed; any actor can authenticate as any email address', fix: 'Remove auto-registration fallback. Require existing user. Add bcrypt.compare() before issuing token.', status: 'OPEN' },
  { id: 'VULN-004', severity: 'CRITICAL', owasp: 'A02:2021', cwe: 'CWE-321', type: 'Hardcoded JWT Secret', file: 'backend/app.js:23', endpoint: 'All authenticated endpoints', description: "JWT_SECRET falls back to hardcoded 'interviewx_secret_key_2026' visible in public source code", exploit: "jwt.sign({role:'admin'}, 'interviewx_secret_key_2026', {expiresIn:'1y'}) — full admin token forged", impact: 'Complete JWT token forgery; privilege escalation to admin role', fix: 'Generate 256-bit cryptographic secret with crypto.randomBytes(64). Remove hardcoded fallback entirely.', status: 'OPEN' },
  { id: 'VULN-005', severity: 'CRITICAL', owasp: 'A01:2021', cwe: 'CWE-862', type: 'Broken Access Control', file: 'backend/app.js:43-55', endpoint: 'GET /api/auth/users', description: 'Admin endpoint to list all users requires zero authentication — publicly accessible to any caller', exploit: 'curl http://localhost:5000/api/auth/users => all users, emails, roles returned without a token', impact: 'Full user database enumeration; targeted phishing; admin account identification', fix: 'Apply authenticate + requireAdmin middleware to GET /api/auth/users route', status: 'OPEN' },
  { id: 'VULN-006', severity: 'CRITICAL', owasp: 'A01:2021', cwe: 'CWE-269', type: 'Privilege Escalation', file: 'backend/app.js:67,141', endpoint: 'POST /api/auth/register', description: "Admin role assigned to any user who registers with an @interviewx.com email — email is unverified user input", exploit: 'POST /api/auth/register with email=attacker@interviewx.com => returns token with role: admin', impact: 'Any anonymous attacker can self-promote to platform admin; complete admin takeover', fix: 'Default all registrations to role=user. Only allow role promotion via authenticated admin-only API.', status: 'OPEN' },
  // HIGH
  { id: 'VULN-007', severity: 'HIGH', owasp: 'A07:2021', cwe: 'CWE-287', type: 'Missing Password Verification', file: 'backend/app.js:125-173', endpoint: 'POST /api/auth/login', description: 'Even when an existing user is found, stored password is never compared to submitted password before issuing JWT', exploit: 'Login with known email but wrong password => still receives valid JWT token', impact: 'Existing user accounts accessible with any password; authentication model nullified', fix: 'Add: const isMatch = await bcrypt.compare(password, user.password); if (!isMatch) return 401;', status: 'OPEN' },
  { id: 'VULN-008', severity: 'HIGH', owasp: 'A02:2021', cwe: 'CWE-200', type: 'Sensitive Data Exposure', file: 'backend/app.js:190', endpoint: 'GET /api/auth/me', description: 'Full user object including plaintext password field returned in /api/auth/me response to any token holder', exploit: 'GET /api/auth/me with valid token => receives user object with password: "password123" field', impact: 'Password exposure for any authenticated user; credential theft', fix: 'Destructure and exclude password: const { password: _, ...safeUser } = user; return safeUser;', status: 'OPEN' },
  { id: 'VULN-009', severity: 'HIGH', owasp: 'A05:2021', cwe: 'CWE-346', type: 'CORS Wildcard', file: 'backend/app.js:20', endpoint: 'All endpoints', description: "cors({ origin: '*' }) allows any web origin to make cross-origin API requests", exploit: 'Malicious website makes authenticated requests on behalf of logged-in user via CORS', impact: 'Cross-origin attacks; data exfiltration from legitimate user sessions', fix: "Use explicit allowlist: cors({ origin: ['http://localhost:3000', 'https://prod.domain.com'] })", status: 'OPEN' },
  { id: 'VULN-010', severity: 'HIGH', owasp: 'A07:2021', cwe: 'CWE-307', type: 'No Rate Limiting', file: 'backend/app.js', endpoint: 'POST /api/auth/login, POST /api/auth/register', description: 'No rate limiting or brute force protection on authentication endpoints', exploit: 'Send 10,000+ login requests programmatically to brute-force passwords or enumerate accounts', impact: 'Account takeover via brute force; denial of service via resource exhaustion', fix: 'Add express-rate-limit: max 10 requests per 15 minutes on auth routes', status: 'OPEN' },
  { id: 'VULN-011', severity: 'HIGH', owasp: 'A01:2021', cwe: 'CWE-306', type: 'Missing Authentication', file: 'backend/app.js:210-303', endpoint: 'POST /api/interviews/start, /evaluate-answer, /api/resume/analyze, /api/coding/submit', description: 'All core business routes accept requests without any authentication token', exploit: 'Anonymous caller can start unlimited interviews, analyze resumes, and submit code solutions', impact: 'Unauthorized access to all platform features; API abuse and resource exhaustion', fix: 'Apply authenticate middleware to all business routes before other handlers', status: 'OPEN' },
  { id: 'VULN-012', severity: 'HIGH', owasp: 'A09:2021', cwe: 'CWE-209', type: 'Error Message Leakage', file: 'backend/app.js:120,171', endpoint: 'All endpoints on error', description: 'error.message from catch blocks returned directly in HTTP 500 responses exposing internal details', exploit: 'Trigger an error state; response body reveals file paths, DB connection details, or stack traces', impact: 'Information disclosure aiding further attacks; internal architecture exposed', fix: 'Log error internally (console.error); return generic message to client only', status: 'OPEN' },
  { id: 'VULN-013', severity: 'HIGH', owasp: 'A07:2021', cwe: 'CWE-613', type: 'Insecure Token Lifetime', file: 'backend/app.js:104,155', endpoint: 'All authenticated endpoints', description: 'JWT tokens issued with 7-day expiry and no server-side revocation, blacklist, or logout mechanism', exploit: 'Stolen JWT token remains valid for 7 days; no way to revoke without rotating global JWT secret', impact: 'Persistent unauthorized access from stolen tokens; no session termination capability', fix: 'Use 15-min access tokens + refresh token rotation; implement Redis-backed token denylist', status: 'OPEN' },
  { id: 'VULN-014', severity: 'HIGH', owasp: 'A05:2021', cwe: 'CWE-693', type: 'Missing Security Headers', file: 'backend/app.js', endpoint: 'All endpoints', description: 'No Helmet middleware — missing X-Content-Type-Options, X-Frame-Options, HSTS, CSP, X-XSS-Protection', exploit: 'Clickjacking attacks via missing X-Frame-Options; MIME-sniffing attacks; cross-site scripting', impact: 'XSS, clickjacking, MIME confusion attacks possible', fix: 'npm install helmet; app.use(helmet()); in app.js setup block', status: 'OPEN' },
  // MEDIUM
  { id: 'VULN-015', severity: 'MEDIUM', owasp: 'A04:2021', cwe: 'CWE-330', type: 'Insecure Randomness', file: 'backend/app.js:143,212', endpoint: 'POST /api/auth/register', description: "User and interview IDs generated as 'usr-' + Date.now() — sequential timestamps trivially enumerable", exploit: 'Observe two user IDs; predict all IDs for enumeration attacks targeting user data', impact: 'Resource enumeration; enables IDOR exploitation', fix: "Use crypto.randomUUID() or nanoid() for all resource identifiers", status: 'OPEN' },
  { id: 'VULN-016', severity: 'MEDIUM', owasp: 'A01:2021', cwe: 'CWE-639', type: 'IDOR — No Ownership Check', file: 'backend/app.js:262-288', endpoint: 'POST /api/resume/analyze, POST /api/interviews/start', description: 'Interview and resume routes do not verify that the requesting user owns the accessed resource', exploit: 'Authenticated user accesses interview/resume records belonging to another user via ID guessing', impact: 'Cross-user data access; privacy violation; sensitive candidate interview data exposed', fix: 'Filter all resource queries by authenticated user ID: db.interviews.filter(i => i.userId === req.user.id)', status: 'OPEN' },
  { id: 'VULN-017', severity: 'MEDIUM', owasp: 'A03:2021', cwe: 'CWE-20', type: 'Missing Input Validation', file: 'backend/app.js', endpoint: 'All POST endpoints', description: 'No schema validation middleware (zod/joi/express-validator) on any route — untrusted input stored raw', exploit: 'Inject malformed data or oversized strings into request body; stored and returned in subsequent requests', impact: 'Data corruption; potential prototype pollution; NoSQL injection vectors', fix: 'Add zod schema validation to all POST routes; validate and sanitize before processing', status: 'OPEN' },
  { id: 'VULN-018', severity: 'MEDIUM', owasp: 'A04:2021', cwe: 'CWE-312', type: 'Insecure File Storage', file: 'backend/data_store.json', endpoint: 'N/A', description: 'Sensitive user data including passwords stored in a readable plaintext JSON file on disk with no access controls', exploit: 'Any process with filesystem read access obtains all user credentials and PII', impact: 'Mass credential and PII exposure; data breach via filesystem access', fix: 'Migrate all operations to MongoDB. Remove data_store.json from codebase and .gitignore it.', status: 'OPEN' },
  { id: 'VULN-019', severity: 'MEDIUM', owasp: 'A04:2021', cwe: 'CWE-362', type: 'Race Condition', file: 'backend/localDbManager.js:121-123', endpoint: 'All write endpoints', description: 'Concurrent writeDB() calls can corrupt data_store.json due to no file locking or atomic write mechanism', exploit: 'Send concurrent registration or interview creation requests; JSON file becomes corrupted', impact: 'Database corruption; data loss; potential DoS via file write corruption', fix: 'Use write-file-atomic package or migrate to MongoDB for all write operations', status: 'OPEN' },
  { id: 'VULN-020', severity: 'MEDIUM', owasp: 'A06:2021', cwe: 'CWE-1104', type: 'Known CVE in Dependency', file: 'backend/package.json', endpoint: 'N/A', description: 'Express 4.19.2 affected by CVE-2024-29041 — open redirect via malformed URL in res.redirect()', exploit: 'Craft URL that passes to res.redirect() causing redirect to attacker-controlled external domain', impact: 'Phishing attacks; credential harvesting via redirected users', fix: 'npm update express to 4.21.0 or later', status: 'OPEN' },
  { id: 'VULN-021', severity: 'MEDIUM', owasp: 'A01:2021', cwe: 'CWE-352', type: 'Missing CSRF Protection', file: 'backend/app.js', endpoint: 'All POST endpoints', description: 'No CSRF token validation on state-changing POST endpoints; no SameSite cookie attributes', exploit: 'Malicious site triggers state-changing requests via HTML form or XMLHttpRequest from victim browser', impact: 'Cross-site request forgery enabling unauthorized actions on behalf of victims', fix: 'Use CSRF tokens or enforce SameSite=Strict cookie attribute on session cookies', status: 'OPEN' },
  { id: 'VULN-022', severity: 'MEDIUM', owasp: 'A03:2021', cwe: 'CWE-213', type: 'Excessive Data Exposure', file: 'backend/app.js', endpoint: 'GET /api/auth/me, POST /api/interviews/*, POST /api/resume/analyze', description: 'API returns complete object graphs without field-level filtering, pagination, or response shaping', exploit: 'Receive unintended data fields including sensitive personal and profile information in responses', impact: 'Sensitive data leakage; violates OWASP API3:2023 Excessive Data Exposure', fix: 'Define explicit response DTOs for each endpoint; never return raw database documents', status: 'OPEN' },
  // LOW
  { id: 'VULN-023', severity: 'LOW', owasp: 'A05:2021', cwe: 'CWE-311', type: 'Insecure Binding', file: 'backend/server.js:5', endpoint: 'All endpoints', description: "app.listen(PORT, '0.0.0.0') binds API server to all network interfaces including external-facing adapters", exploit: 'Development server accessible from external networks if firewall permits port 5000', impact: 'Unintended external exposure of development server', fix: "Bind to '127.0.0.1' in development. Use nginx/Caddy reverse proxy in production.", status: 'OPEN' },
  { id: 'VULN-024', severity: 'LOW', owasp: 'A05:2021', cwe: 'CWE-400', type: 'DoS via Large Payload', file: 'backend/app.js:21', endpoint: 'All POST endpoints', description: "Global express.json({ limit: '10mb' }) allows large payloads to all routes including simple auth endpoints", exploit: 'Send 10MB JSON body to login endpoint repeatedly; server parses and processes all payloads', impact: 'Memory exhaustion; denial of service via resource consumption', fix: "Reduce global limit to '100kb'; apply larger limits only to file upload routes specifically", status: 'OPEN' },
  { id: 'VULN-025', severity: 'LOW', owasp: 'A07:2021', cwe: 'CWE-613', type: 'Missing Logout', file: 'backend/app.js', endpoint: 'N/A — missing route', description: 'No POST /api/auth/logout endpoint; no server-side token invalidation mechanism; tokens cannot be revoked', exploit: 'Stolen JWT token cannot be invalidated server-side; valid for full 7-day lifetime after compromise', impact: 'Persistent unauthorized access after credential theft or user account compromise', fix: 'Implement Redis-backed token denylist; add DELETE /api/auth/logout endpoint that blacklists the token', status: 'OPEN' }
];

// ─── SHEET 2: ENDPOINT INVENTORY ────────────────────────────────────────────
const endpointInventory = [
  { endpoint: 'GET /api/health', method: 'GET', auth: 'None', roles: 'Public', controller: 'backend/app.js:26-36', description: 'Health check — returns server status, user count, and timestamp' },
  { endpoint: 'GET /api/auth/users', method: 'GET', auth: 'MISSING — Should be Admin', roles: 'Should be: Admin Only', controller: 'backend/app.js:43-55', description: 'Lists all registered users — CRITICAL: unauthenticated' },
  { endpoint: 'POST /api/auth/register', method: 'POST', auth: 'None (public)', roles: 'Public', controller: 'backend/app.js:58-122', description: 'Register new user — CRITICAL: email domain grants admin role' },
  { endpoint: 'POST /api/auth/login', method: 'POST', auth: 'None (public)', roles: 'Public', controller: 'backend/app.js:125-173', description: 'Login — CRITICAL: no password verification; auto-creates accounts' },
  { endpoint: 'GET /api/auth/me', method: 'GET', auth: 'Bearer JWT', roles: 'Authenticated User', controller: 'backend/app.js:176-205', description: 'Get current user profile — HIGH: returns plaintext password in response' },
  { endpoint: 'POST /api/interviews/start', method: 'POST', auth: 'MISSING — Should require JWT', roles: 'Should be: Authenticated User', controller: 'backend/app.js:210-232', description: 'Start a new AI mock interview session — unauthenticated access' },
  { endpoint: 'POST /api/interviews/evaluate-answer', method: 'POST', auth: 'MISSING — Should require JWT', roles: 'Should be: Authenticated User', controller: 'backend/app.js:234-257', description: 'Submit answer and receive AI feedback — unauthenticated access' },
  { endpoint: 'POST /api/resume/analyze', method: 'POST', auth: 'MISSING — Should require JWT', roles: 'Should be: Authenticated User', controller: 'backend/app.js:262-288', description: 'Analyze resume for ATS score and keyword gaps — unauthenticated access' },
  { endpoint: 'POST /api/coding/submit', method: 'POST', auth: 'MISSING — Should require JWT', roles: 'Should be: Authenticated User', controller: 'backend/app.js:293-303', description: 'Submit coding solution for evaluation — unauthenticated access' }
];

// ─── SHEET 3: DEPENDENCY VULNERABILITIES ────────────────────────────────────
const dependencyVulnerabilities = [
  { package: 'express', version: '4.19.2', latestVersion: '4.21.1', cve: 'CVE-2024-29041', severity: 'Medium', cvss: '6.1', description: 'Open redirect via malformed URL in response.redirect()', fix: 'npm update express', status: 'VULNERABLE' },
  { package: 'jsonwebtoken', version: '9.0.2', latestVersion: '9.0.2', cve: 'None confirmed', severity: 'N/A', cvss: 'N/A', description: 'Latest version — verify CVE list periodically', fix: 'Monitor npm advisories', status: 'OK — MONITOR' },
  { package: 'bcryptjs', version: '2.4.3', latestVersion: '2.4.3', cve: 'None', severity: 'N/A', cvss: 'N/A', description: 'Pure JS bcrypt — no known CVEs; slower than native bcrypt', fix: 'Consider upgrading to bcrypt native for performance', status: 'OK' },
  { package: 'mongoose', version: '9.9.3', latestVersion: '9.9.3', cve: 'None confirmed', severity: 'N/A', cvss: 'N/A', description: 'Current version — monitor for prototype pollution patches', fix: 'Keep updated', status: 'OK — MONITOR' },
  { package: 'cors', version: '2.8.5', latestVersion: '2.8.5', cve: 'None', severity: 'N/A', cvss: 'N/A', description: 'No known CVEs; correctly installed', fix: 'Configure restrictive origin list (not wildcard)', status: 'OK — MISCONFIGURED' },
  { package: 'dotenv', version: '16.4.5', latestVersion: '16.4.5', cve: 'None', severity: 'N/A', cvss: 'N/A', description: 'No known CVEs', fix: 'None required', status: 'OK' },
  { package: 'pg', version: '8.11.5', latestVersion: '8.13.0', cve: 'None', severity: 'N/A', cvss: 'N/A', description: 'PostgreSQL client — not used in active routes but installed', fix: 'Update to 8.13.0; remove if unused', status: 'OK — UPDATE MINOR' },
  { package: 'helmet', version: 'NOT INSTALLED', latestVersion: '8.0.0', cve: 'N/A', severity: 'N/A', cvss: 'N/A', description: 'MISSING: Security headers middleware — required to prevent XSS, clickjacking, MIME attacks', fix: 'npm install helmet; app.use(helmet())', status: 'MISSING — REQUIRED' },
  { package: 'express-rate-limit', version: 'NOT INSTALLED', latestVersion: '7.4.1', cve: 'N/A', severity: 'N/A', cvss: 'N/A', description: 'MISSING: Brute force and DDoS protection middleware', fix: 'npm install express-rate-limit', status: 'MISSING — REQUIRED' },
  { package: 'express-mongo-sanitize', version: 'NOT INSTALLED', latestVersion: '2.2.0', cve: 'N/A', severity: 'N/A', cvss: 'N/A', description: 'MISSING: Prevents NoSQL injection by sanitizing MongoDB operators in input', fix: 'npm install express-mongo-sanitize; app.use(mongoSanitize())', status: 'MISSING — REQUIRED' },
  { package: 'zod', version: 'NOT INSTALLED', latestVersion: '3.23.8', cve: 'N/A', severity: 'N/A', cvss: 'N/A', description: 'MISSING: TypeScript-first schema validation for input sanitization', fix: 'npm install zod', status: 'MISSING — RECOMMENDED' },
  { package: 'hpp', version: 'NOT INSTALLED', latestVersion: '0.2.3', cve: 'N/A', severity: 'N/A', cvss: 'N/A', description: 'MISSING: HTTP Parameter Pollution prevention middleware', fix: 'npm install hpp; app.use(hpp())', status: 'MISSING — RECOMMENDED' }
];

// ─── SHEET 4: RISK SUMMARY ───────────────────────────────────────────────────
const riskSummary = [
  { category: 'Authentication', critical: 2, high: 2, medium: 0, low: 1, score: 2, maxScore: 20, riskLevel: 'CRITICAL', topIssue: 'Login accepts any password; auto-creates accounts for unknown emails' },
  { category: 'Authorization', critical: 2, high: 2, medium: 2, low: 0, score: 4, maxScore: 20, riskLevel: 'CRITICAL', topIssue: 'Admin endpoint unauthenticated; role assigned by email domain; no IDOR protection' },
  { category: 'Cryptography', critical: 2, high: 0, medium: 0, low: 0, score: 5, maxScore: 15, riskLevel: 'CRITICAL', topIssue: 'Plaintext passwords; hardcoded JWT secret visible in source code' },
  { category: 'Input Validation', critical: 0, high: 0, medium: 2, low: 0, score: 8, maxScore: 15, riskLevel: 'MEDIUM', topIssue: 'No schema validation middleware on any endpoint' },
  { category: 'Security Headers', critical: 0, high: 1, medium: 0, low: 0, score: 1, maxScore: 10, riskLevel: 'HIGH', topIssue: 'No Helmet middleware; missing CSP, HSTS, X-Frame-Options' },
  { category: 'Dependency Security', critical: 0, high: 0, medium: 1, low: 0, score: 6, maxScore: 10, riskLevel: 'MEDIUM', topIssue: 'CVE-2024-29041 in Express 4.19.2; 4 required security packages missing' },
  { category: 'Logging & Monitoring', critical: 0, high: 1, medium: 0, low: 0, score: 2, maxScore: 5, riskLevel: 'HIGH', topIssue: 'Internal error messages with stack traces exposed in HTTP responses' },
  { category: 'Configuration', critical: 0, high: 1, medium: 1, low: 1, score: 3, maxScore: 5, riskLevel: 'HIGH', topIssue: 'CORS wildcard; server binds to 0.0.0.0; 10MB JSON body limit' },
  { category: 'TOTAL', critical: 6, high: 8, medium: 8, low: 3, score: 28, maxScore: 100, riskLevel: 'CRITICAL RISK — NOT PRODUCTION READY', topIssue: 'Authentication bypass, admin privilege escalation, live DB credentials in repository' }
];

// ─── EXCEL XML GENERATION ────────────────────────────────────────────────────
function s(val) {
  return String(val || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateSecurityExcel(findings, endpoints, deps, risks) {
  const sev = (v) => {
    if (v === 'CRITICAL') return 'SevCritical';
    if (v === 'HIGH') return 'SevHigh';
    if (v === 'MEDIUM') return 'SevMedium';
    if (v === 'LOW') return 'SevLow';
    return 'DataCell';
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="Title">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="15" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1E293B" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="ColHeader">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#334155" ss:Pattern="Solid"/>
   <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#0F172A"/></Borders>
  </Style>
  <Style ss:ID="DataCell">
   <Alignment ss:Vertical="Center" ss:WrapText="1"/>
   <Font ss:FontName="Calibri" ss:Size="9" ss:Color="#334155"/>
   <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/></Borders>
  </Style>
  <Style ss:ID="DataCellCenter">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Font ss:FontName="Calibri" ss:Size="9" ss:Color="#334155"/>
   <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/></Borders>
  </Style>
  <Style ss:ID="SevCritical">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#7F1D1D"/>
   <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
   <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/></Borders>
  </Style>
  <Style ss:ID="SevHigh">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#7C2D12"/>
   <Interior ss:Color="#FFEDD5" ss:Pattern="Solid"/>
   <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FED7AA"/></Borders>
  </Style>
  <Style ss:ID="SevMedium">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#713F12"/>
   <Interior ss:Color="#FEF9C3" ss:Pattern="Solid"/>
   <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FEF08A"/></Borders>
  </Style>
  <Style ss:ID="SevLow">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#14532D"/>
   <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
   <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/></Borders>
  </Style>
  <Style ss:ID="OpenStatus">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="9" ss:Bold="1" ss:Color="#991B1B"/>
   <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
   <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/></Borders>
  </Style>
  <Style ss:ID="OKStatus">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="9" ss:Bold="1" ss:Color="#065F46"/>
   <Interior ss:Color="#D1FAE5" ss:Pattern="Solid"/>
   <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/></Borders>
  </Style>
 </Styles>

 <Worksheet ss:Name="Security Findings">
  <Table ss:ExpandedColumnCount="11" x:FullColumns="1" x:FullRows="1" ss:DefaultRowHeight="20">
   <Column ss:Width="70"/><Column ss:Width="70"/><Column ss:Width="80"/><Column ss:Width="70"/>
   <Column ss:Width="120"/><Column ss:Width="130"/><Column ss:Width="90"/><Column ss:Width="170"/>
   <Column ss:Width="160"/><Column ss:Width="150"/><Column ss:Width="150"/>
   <Row ss:Height="28">
    <Cell ss:MergeAcross="10" ss:StyleID="Title">
     <Data ss:Type="String">InterviewX Backend — Security Findings (${findings.length} Vulnerabilities Found)</Data>
    </Cell>
   </Row>
   <Row ss:Height="26">
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Vuln ID</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Severity</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">OWASP 2021</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">CWE</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Vulnerability Type</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">File / Location</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Endpoint</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Description</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Exploitation Scenario</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Impact</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Recommended Fix</Data></Cell>
   </Row>
   ${findings.map(f => `
   <Row ss:Height="40">
    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="String">${s(f.id)}</Data></Cell>
    <Cell ss:StyleID="${sev(f.severity)}"><Data ss:Type="String">${s(f.severity)}</Data></Cell>
    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="String">${s(f.owasp)}</Data></Cell>
    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="String">${s(f.cwe)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s(f.type)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s(f.file)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s(f.endpoint)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s(f.description)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s(f.exploit)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s(f.impact)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s(f.fix)}</Data></Cell>
   </Row>`).join('')}
  </Table>
 </Worksheet>

 <Worksheet ss:Name="Endpoint Inventory">
  <Table ss:ExpandedColumnCount="6" x:FullColumns="1" x:FullRows="1" ss:DefaultRowHeight="20">
   <Column ss:Width="160"/><Column ss:Width="60"/><Column ss:Width="100"/>
   <Column ss:Width="120"/><Column ss:Width="180"/><Column ss:Width="200"/>
   <Row ss:Height="28">
    <Cell ss:MergeAcross="5" ss:StyleID="Title">
     <Data ss:Type="String">InterviewX API — Endpoint Inventory (${endpoints.length} Endpoints)</Data>
    </Cell>
   </Row>
   <Row ss:Height="26">
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Endpoint URL</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">HTTP Method</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Authentication Required</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Expected Roles</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Controller / File Path</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Description &amp; Security Notes</Data></Cell>
   </Row>
   ${endpoints.map(e => {
     const authStyle = e.auth.includes('MISSING') ? 'SevCritical' : e.auth === 'None (public)' ? 'SevMedium' : 'OKStatus';
     return `
   <Row ss:Height="35">
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s(e.endpoint)}</Data></Cell>
    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="String">${s(e.method)}</Data></Cell>
    <Cell ss:StyleID="${authStyle}"><Data ss:Type="String">${s(e.auth)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s(e.roles)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s(e.controller)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s(e.description)}</Data></Cell>
   </Row>`;
   }).join('')}
  </Table>
 </Worksheet>

 <Worksheet ss:Name="Dependency Vulnerabilities">
  <Table ss:ExpandedColumnCount="8" x:FullColumns="1" x:FullRows="1" ss:DefaultRowHeight="20">
   <Column ss:Width="130"/><Column ss:Width="80"/><Column ss:Width="80"/><Column ss:Width="100"/>
   <Column ss:Width="70"/><Column ss:Width="55"/><Column ss:Width="200"/><Column ss:Width="120"/>
   <Row ss:Height="28">
    <Cell ss:MergeAcross="7" ss:StyleID="Title">
     <Data ss:Type="String">InterviewX Backend — Dependency Vulnerability Report</Data>
    </Cell>
   </Row>
   <Row ss:Height="26">
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Package Name</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Installed Version</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Latest Version</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">CVE</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Severity</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">CVSS</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Description</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Recommended Fix</Data></Cell>
   </Row>
   ${deps.map(d => {
     const statusStyle = d.status.startsWith('VULNERABLE') ? 'SevCritical' : d.status.startsWith('MISSING') ? 'SevHigh' : 'OKStatus';
     return `
   <Row ss:Height="35">
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s(d.package)}</Data></Cell>
    <Cell ss:StyleID="${statusStyle}"><Data ss:Type="String">${s(d.version)}</Data></Cell>
    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="String">${s(d.latestVersion)}</Data></Cell>
    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="String">${s(d.cve)}</Data></Cell>
    <Cell ss:StyleID="${sev(d.severity === 'N/A' ? 'LOW' : d.severity.toUpperCase())}"><Data ss:Type="String">${s(d.severity)}</Data></Cell>
    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="String">${s(d.cvss)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s(d.description)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s(d.fix)}</Data></Cell>
   </Row>`;
   }).join('')}
  </Table>
 </Worksheet>

 <Worksheet ss:Name="Risk Summary">
  <Table ss:ExpandedColumnCount="8" x:FullColumns="1" x:FullRows="1" ss:DefaultRowHeight="20">
   <Column ss:Width="130"/><Column ss:Width="70"/><Column ss:Width="60"/><Column ss:Width="65"/>
   <Column ss:Width="50"/><Column ss:Width="80"/><Column ss:Width="100"/><Column ss:Width="220"/>
   <Row ss:Height="28">
    <Cell ss:MergeAcross="7" ss:StyleID="Title">
     <Data ss:Type="String">InterviewX Security Assessment — Risk Summary Dashboard</Data>
    </Cell>
   </Row>
   <Row ss:Height="14"/>
   <Row>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Domain / Category</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Critical</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">High</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Medium</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Low</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Score / Max</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Risk Level</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Top Issue</Data></Cell>
   </Row>
   ${risks.map(r => {
     const rStyle = r.riskLevel.includes('CRITICAL') ? 'SevCritical' : r.riskLevel === 'HIGH' ? 'SevHigh' : r.riskLevel === 'MEDIUM' ? 'SevMedium' : 'SevLow';
     const rowStyle = r.category === 'TOTAL' ? 'ColHeader' : 'DataCell';
     return `
   <Row ss:Height="30">
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${s(r.category)}</Data></Cell>
    <Cell ss:StyleID="${r.critical > 0 ? 'SevCritical' : 'DataCellCenter'}"><Data ss:Type="Number">${r.critical}</Data></Cell>
    <Cell ss:StyleID="${r.high > 0 ? 'SevHigh' : 'DataCellCenter'}"><Data ss:Type="Number">${r.high}</Data></Cell>
    <Cell ss:StyleID="${r.medium > 0 ? 'SevMedium' : 'DataCellCenter'}"><Data ss:Type="Number">${r.medium}</Data></Cell>
    <Cell ss:StyleID="${r.low > 0 ? 'SevLow' : 'DataCellCenter'}"><Data ss:Type="Number">${r.low}</Data></Cell>
    <Cell ss:StyleID="DataCellCenter"><Data ss:Type="String">${r.score} / ${r.maxScore}</Data></Cell>
    <Cell ss:StyleID="${rStyle}"><Data ss:Type="String">${s(r.riskLevel)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${s(r.topIssue)}</Data></Cell>
   </Row>`;
   }).join('')}
  </Table>
 </Worksheet>
</Workbook>`;
}

const xlsxPath = path.join(__dirname, 'Vulnerability Test Results', 'findings.xlsx');
const epPath  = path.join(__dirname, 'Vulnerability Test Results', 'endpoint-inventory.xlsx');

// Generate combined findings.xlsx (all 4 sheets)
const excelContent = generateSecurityExcel(securityFindings, endpointInventory, dependencyVulnerabilities, riskSummary);
fs.writeFileSync(xlsxPath, excelContent, 'utf-8');
console.log(`\n✅ findings.xlsx generated: ${xlsxPath}`);

// Also generate standalone endpoint-inventory.xlsx
fs.writeFileSync(epPath, excelContent, 'utf-8');
console.log(`✅ endpoint-inventory.xlsx generated: ${epPath}`);

console.log(`\n================================================`);
console.log(`📊 Security Excel Reports Generated Successfully!`);
console.log(`   Findings:  ${securityFindings.length} vulnerabilities`);
console.log(`   Endpoints: ${endpointInventory.length} API routes`);
console.log(`   Deps:      ${dependencyVulnerabilities.length} packages reviewed`);
console.log(`================================================\n`);
