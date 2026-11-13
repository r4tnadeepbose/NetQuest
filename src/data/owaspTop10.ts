import type { Chapter, Flashcard, Part } from '../types'

export const owaspPart: Part = {
  id: 'p15',
  title: 'OWASP Top 10',
  description: 'Web application security risks from the OWASP Top 10 (2021), with networking and defensive context.'
}

export const owaspChapter: Chapter = {
  id: 'c40',
  partId: 'p15',
  order: 1,
  title: 'OWASP Top 10 (2021)',
  description: 'Overview and the ten critical web application security risk categories.'
}

const c = (f: Flashcard): Flashcard => f

export const owaspFlashcards: Flashcard[] = [
  c({ id:'owasp0', chapterId:'c40', partId:'p15', type:'concept', difficulty:'beginner', tags:['owasp','web','appsec','top10'],
    front:{ title:'OWASP Top 10 Overview', question:'What is the OWASP Top 10 and why is it important?', category:'OWASP' },
    back:{ explanation:'The OWASP Top 10 is a widely used awareness document from the Open Web Application Security Project that highlights critical web application security risk categories. The 2021 edition lists: A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection, A04 Insecure Design, A05 Security Misconfiguration, A06 Vulnerable and Outdated Components, A07 Identification and Authentication Failures, A08 Software and Data Integrity Failures, A09 Security Logging and Monitoring Failures, and A10 Server-Side Request Forgery (SSRF).',
      why:'It helps developers, testers, and defenders prioritize common and impactful risks, but it is not a complete list of all vulnerabilities.',
      security:'Use it alongside secure SDLC practices, threat modeling, testing (authorized), patching, and monitoring.',
      realWorld:'Teams map findings from code review, SAST/DAST, and penetration tests to Top 10 categories to drive remediation.', related:['AppSec','Threat Modeling','Secure SDLC'] } }),

  c({ id:'owasp1', chapterId:'c40', partId:'p15', type:'security', difficulty:'intermediate', tags:['owasp','a01','access-control'],
    front:{ title:'A01: Broken Access Control', question:'What is Broken Access Control (OWASP A01:2021) and how is it mitigated?', category:'OWASP' },
    back:{ explanation:'Broken Access Control occurs when users can act outside intended permissions, such as accessing other users’ data, modifying resources, or performing privileged functions (e.g., IDOR, forced browsing, privilege escalation, missing server-side checks).',
      internals:'Often caused by trusting client-side controls, missing authorization checks on every request, insecure direct object references, or misconfigured CORS/policies.',
      security:'Impact can include data exposure/tampering and account takeover. Mitigate with deny-by-default, server-side authorization on every request, least privilege, robust object-level checks, secure session/token handling, and testing.',
      realWorld:'Changing an ID in `/api/orders/123` to access another user’s order indicates an authorization flaw.', related:['IDOR','Least Privilege','RBAC/ABAC'] } }),

  c({ id:'owasp2', chapterId:'c40', partId:'p15', type:'security', difficulty:'intermediate', tags:['owasp','a02','crypto','tls'],
    front:{ title:'A02: Cryptographic Failures', question:'What are Cryptographic Failures (OWASP A02:2021)?', category:'OWASP' },
    back:{ explanation:'Cryptographic Failures (formerly “Sensitive Data Exposure”) involve weaknesses in protecting data in transit or at rest due to missing, weak, or misused cryptography.',
      internals:'Examples: transmitting data over HTTP/plaintext protocols, weak/deprecated algorithms or modes, poor key management, improper certificate validation, weak randomness, or storing passwords without strong hashing/salting (e.g., using modern password hashing as appropriate).',
      security:'Can lead to credential/session theft, data breaches, and tampering. Mitigate by using TLS correctly, encrypting sensitive data at rest, strong key management, up-to-date crypto standards, and avoiding custom crypto.',
      realWorld:'Login over HTTP or accepting invalid TLS certificates exposes credentials to interception/MITM.', related:['TLS/HTTPS','Key Management','Hashing'] } }),

  c({ id:'owasp3', chapterId:'c40', partId:'p15', type:'security', difficulty:'intermediate', tags:['owasp','a03','injection','sqli','xss'],
    front:{ title:'A03: Injection', question:'What is Injection (OWASP A03:2021)?', category:'OWASP' },
    back:{ explanation:'Injection occurs when untrusted data is sent to an interpreter as part of a command or query, causing unintended execution. Common forms include SQL injection, OS command injection, LDAP injection, and cross-site scripting (XSS is included in A03:2021).',
      internals:'Root cause is mixing data with code/queries without proper handling: dynamic query building, unsanitized input in shell commands, or unsafe rendering in browsers.',
      security:'Impact ranges from data theft/modification to remote code execution or session compromise. Mitigate with parameterized queries/prepared statements, safe APIs, context-aware output encoding/escaping, input validation, least-privilege DB accounts, and CSP where appropriate.',
      example:`\`SELECT * FROM users WHERE id = '\` + userInput + \`'\` can be exploited if input is not safely handled.`, related:['SQLi','XSS','Command Injection'] } }),

  c({ id:'owasp4', chapterId:'c40', partId:'p15', type:'security', difficulty:'intermediate', tags:['owasp','a04','insecure-design'],
    front:{ title:'A04: Insecure Design', question:'What is Insecure Design (OWASP A04:2021)?', category:'OWASP' },
    back:{ explanation:'Insecure Design refers to risks arising from missing or ineffective security controls in the design and architecture phase—flaws that cannot be fully fixed by perfect implementation alone.',
      internals:'Examples: lack of threat modeling, missing rate limiting/anti-automation for sensitive flows, insecure business logic, or insufficient segregation of tenants/privileges by design.',
      security:'Mitigate with secure design patterns, threat modeling, security requirements/user stories, defense-in-depth, least privilege, and validating designs through reviews and testing.',
      realWorld:'A password reset flow without abuse controls may enable account takeover even if code is “bug-free.”', related:['Threat Modeling','Secure Design Patterns','Abuse Cases'] } }),

  c({ id:'owasp5', chapterId:'c40', partId:'p15', type:'security', difficulty:'intermediate', tags:['owasp','a05','misconfiguration'],
    front:{ title:'A05: Security Misconfiguration', question:'What is Security Misconfiguration (OWASP A05:2021)?', category:'OWASP' },
    back:{ explanation:'Security Misconfiguration occurs when systems, apps, servers, cloud services, or network components are insecurely configured, left with defaults, or unnecessarily exposed.',
      internals:'Examples: default credentials, overly permissive cloud storage/security groups, verbose errors exposing internals, unnecessary services/ports/features enabled, missing security headers, or unpatched misconfigured middleware.',
      security:'Can lead to unauthorized access and data leakage. Mitigate with hardened baselines, repeatable configuration/IaC reviews, least functionality, secure defaults, patch/config management, and regular audits/scans.',
      realWorld:'An exposed admin interface or publicly readable storage bucket due to misconfiguration.', related:['Hardening','Least Privilege','Cloud Misconfigurations'] } }),

  c({ id:'owasp6', chapterId:'c40', partId:'p15', type:'security', difficulty:'intermediate', tags:['owasp','a06','dependencies','supply-chain'],
    front:{ title:'A06: Vulnerable and Outdated Components', question:'What are Vulnerable and Outdated Components (OWASP A06:2021)?', category:'OWASP' },
    back:{ explanation:'This risk arises from using libraries, frameworks, OS packages, or other components with known vulnerabilities or that are unsupported/out of date.',
      internals:'Risk increases with untracked dependencies, lack of SBOM/inventory, delayed patching, or transitive dependencies containing flaws.',
      security:'Exploitation can compromise the application or host. Mitigate by maintaining an inventory, monitoring advisories/CVEs, updating/patching promptly, removing unused dependencies, and using trusted sources and integrity checks.',
      realWorld:'A web app running a framework version with a known RCE vulnerability remains exposed until patched/upgraded.', related:['CVE','Patch Management','SBOM','Supply Chain Security'] } }),

  c({ id:'owasp7', chapterId:'c40', partId:'p15', type:'security', difficulty:'intermediate', tags:['owasp','a07','authentication','session'],
    front:{ title:'A07: Identification and Authentication Failures', question:'What are Identification and Authentication Failures (OWASP A07:2021)?', category:'OWASP' },
    back:{ explanation:'These failures occur when identity, authentication, or session management is implemented incorrectly, allowing attackers to compromise passwords, keys, sessions, or assume identities.',
      internals:'Examples: weak/password spraying susceptibility, missing MFA where appropriate, flawed credential recovery, exposing session IDs, improper session invalidation, or predictable tokens.',
      security:'Can lead to account takeover and privilege abuse. Mitigate with strong auth flows, MFA, secure session management (rotation/invalidation), rate limiting/lockout protections with abuse considerations, secure password storage, and monitoring.',
      realWorld:'Session fixation or not invalidating sessions on logout can allow reuse of a stolen session.', related:['MFA','Session Management','Brute Force Protection'] } }),

  c({ id:'owasp8', chapterId:'c40', partId:'p15', type:'security', difficulty:'intermediate', tags:['owasp','a08','integrity','supply-chain','ci-cd'],
    front:{ title:'A08: Software and Data Integrity Failures', question:'What are Software and Data Integrity Failures (OWASP A08:2021)?', category:'OWASP' },
    back:{ explanation:'These failures relate to code and infrastructure that do not protect against integrity violations, such as relying on untrusted plugins/libraries/updates or insecure CI/CD pipelines and deserialization of untrusted data.',
      internals:'Examples: unsigned/unverified updates, compromised build pipelines, pulling dependencies without integrity checks, or insecure deserialization leading to tampering/execution.',
      security:'Impact can include supply-chain compromise and malicious code execution. Mitigate with integrity verification (signatures/checksums), trusted sources, secure CI/CD (least privilege, separation, reviews), dependency pinning where appropriate, and safe serialization/deserialization practices.',
      realWorld:'An attacker tampering with a software update or dependency distributed without verification.', related:['Code Signing','CI/CD Security','Deserialization'] } }),

  c({ id:'owasp9', chapterId:'c40', partId:'p15', type:'security', difficulty:'intermediate', tags:['owasp','a09','logging','monitoring','soc'],
    front:{ title:'A09: Security Logging and Monitoring Failures', question:'What are Security Logging and Monitoring Failures (OWASP A09:2021)?', category:'OWASP' },
    back:{ explanation:'This category covers insufficient logging, detection, monitoring, and alerting, which delays or prevents identification and response to attacks.',
      internals:'Examples: missing logs for auth/authorization failures, logs not protected or centralized, lack of alerting/correlation, or no tested incident response processes.',
      security:'Increases dwell time and impact of breaches. Mitigate by logging relevant security events (with privacy considerations), protecting log integrity, centralizing/monitoring (SIEM), tuning alerts, and establishing/tested IR playbooks.',
      realWorld:'Repeated failed logins or suspicious privilege changes go unnoticed without alerts and review.', related:['SIEM','Incident Response','Audit Logs'] } }),

  c({ id:'owasp10', chapterId:'c40', partId:'p15', type:'security', difficulty:'intermediate', tags:['owasp','a10','ssrf'],
    front:{ title:'A10: Server-Side Request Forgery (SSRF)', question:'What is Server-Side Request Forgery (OWASP A10:2021)?', category:'OWASP' },
    back:{ explanation:'SSRF occurs when an application can be induced to make HTTP (or other) requests to an unintended destination, potentially accessing internal services or metadata endpoints that are not directly reachable by the attacker.',
      internals:'Typically happens when user-controlled URLs/hosts are fetched server-side without strict validation, allowlists, or network restrictions.',
      security:'Impact can include internal network scanning, access to sensitive internal resources, or cloud metadata exposure depending on environment. Mitigate with allowlists for destinations, blocking/validating URLs and redirects, network segmentation/egress controls, disabling unnecessary URL fetch features, and least privilege for server network access.',
      realWorld:'A “fetch image from URL” feature abused to request `http://internal-service/admin` from the server’s network perspective.', related:['Egress Filtering','Metadata Services','Input Validation'] } }),
]