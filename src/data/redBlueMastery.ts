import type { Chapter, Flashcard, Part } from '../types'

export const masteryParts: Part[] = [
  { id: 'p16', title: 'Red Team Academy', description: 'Primary track: red teaming, VAPT, offensive security, adversary emulation (authorized labs only).' },
  { id: 'p17', title: 'Blue Team Academy', description: 'Secondary track: SOC, detection, threat hunting, DFIR, and defensive validation.' },
  { id: 'p18', title: 'Capstones & Operations', description: 'Simulated engagements, reporting, methodology, and purple-team practice.' },
]

export const masteryChapters: Chapter[] = [
  { id: 'rt1', partId: 'p16', order: 1, title: 'Red Team Fundamentals & Methodology', description: 'Red teaming, RoE, kill chain, MITRE ATT&CK, PTES.' },
  { id: 'rt2', partId: 'p16', order: 2, title: 'Reconnaissance & Attack Surface', description: 'Passive/active recon, OSINT, DNS/subdomains, asset discovery.' },
  { id: 'rt3', partId: 'p16', order: 3, title: 'Network Penetration Testing', description: 'Discovery, scanning, enumeration, segmentation assessment.' },
  { id: 'rt4', partId: 'p16', order: 4, title: 'Web & API Penetration Testing', description: 'HTTP, authz/authn, OWASP risks, API testing workflows.' },
  { id: 'rt5', partId: 'p16', order: 5, title: 'Active Directory & Internal Networks', description: 'AD fundamentals, attack paths, lateral movement concepts (labs).' },
  { id: 'rt6', partId: 'p16', order: 6, title: 'Privilege Escalation & Host Assessment', description: 'Linux/Windows privesc methodology and misconfigurations.' },
  { id: 'rt7', partId: 'p16', order: 7, title: 'Cloud, Wireless & Advanced Ops', description: 'Cloud/wireless assessment, adversary emulation, reporting.' },
  { id: 'bt1', partId: 'p17', order: 1, title: 'SOC Operations & SIEM', description: 'Triage, correlation, detection engineering, alert investigation.' },
  { id: 'bt2', partId: 'p17', order: 2, title: 'Threat Hunting & Network Defense', description: 'Hunting, logs, IDS/IPS, DNS/HTTP traffic analysis.' },
  { id: 'bt3', partId: 'p17', order: 3, title: 'DFIR & Purple Teaming', description: 'IR lifecycle, forensics, detections mapped to ATT&CK.' },
  { id: 'cp1', partId: 'p18', order: 1, title: 'VAPT Methodology & Reporting', description: 'Engagement lifecycle, evidence, CVSS, remediation, retest.' },
  { id: 'cp2', partId: 'p18', order: 2, title: 'Capstone Simulations', description: 'External, web, AD, cloud, SOC, and purple-team capstones.' },
]

const mp = (red: string, blue: string, vapt: string) => `Red Team (authorized): ${red}\n\nBlue Team: ${blue}\n\nVAPT: ${vapt}`

export const masteryFlashcards: Flashcard[] = [
  { id:'rt_f1', chapterId:'rt1', partId:'p16', type:'concept', difficulty:'beginner', tags:['red-team','roE','ethics','vapt'],
    front:{ title:'Red Teaming vs Pentest vs VAPT', question:'Differentiate red teaming, penetration testing, and vulnerability assessment (VAPT).', category:'Red Team' },
    back:{ explanation:'Vulnerability assessment identifies and prioritizes weaknesses (often including scanning/validation). Penetration testing attempts to validate exploitability and impact within scope. Red teaming is a goal-oriented adversary emulation exercise testing people/process/technology and detection/response over time, under strict rules of engagement.',
      internals:'All activities require explicit authorization, defined scope, and RoE. Red teams often map to MITRE ATT&CK; pentests/VAPT often align to PTES/OWASP/NIST guidance.',
      why:'Choosing the right approach aligns security testing with business risk and defensive maturity goals.',
      security: mp('Emulate realistic adversary behaviors to test resilience.', 'Use findings to improve monitoring, detection, and response.', 'Document scope, validated findings, impact, and prioritized remediation/retest.'),
      related:['Rules of Engagement','MITRE ATT&CK','PTES'] } },

  { id:'rt_f2', chapterId:'rt1', partId:'p16', type:'concept', difficulty:'intermediate', tags:['mitre','kill-chain','methodology'],
    front:{ title:'MITRE ATT&CK & Cyber Kill Chain', question:'How do the Cyber Kill Chain and MITRE ATT&CK help in offensive and defensive security?', category:'Methodology' },
    back:{ explanation:'The Cyber Kill Chain models stages of an intrusion (recon → actions on objectives). MITRE ATT&CK catalogs adversary tactics/techniques/procedures with greater granularity for emulation and detection mapping.',
      internals:'ATT&CK techniques can be used to plan authorized emulation, identify required telemetry, and evaluate detection coverage.',
      security: mp('Map authorized test activities to techniques to measure control effectiveness.', 'Map detections/alerts to techniques, find gaps, and tune coverage.', 'Reference relevant techniques in reports to contextualize risk and defensive recommendations.'),
      related:['TTPs','Detection Engineering','Adversary Emulation'] } },

  { id:'rt_f3', chapterId:'rt2', partId:'p16', type:'how', difficulty:'intermediate', tags:['recon','osint','attack-surface'],
    front:{ title:'Passive vs Active Reconnaissance', question:'Compare passive and active reconnaissance and give examples.', category:'Recon' },
    back:{ explanation:'Passive recon gathers information without directly interacting with target systems in intrusive ways (public sources, DNS records, CT logs, search engines, leaked metadata). Active recon directly probes assets (port scans, service probes, directory brute force) and is more likely to be logged/detected.',
      internals:'Asset discovery builds an attack surface map: domains, subdomains, IPs, ASNs, services, technologies, endpoints, cloud assets.',
      security: mp('In authorized scope, start passive then carefully expand active enumeration to identify exposures.', 'Monitor for scanning patterns, unusual DNS/web probing, and external asset discovery signals.', 'Record methodology, sources, discovered assets, and confirm scope ownership before active testing.'),
      example:'Passive: CT logs/WHOIS; Active: Nmap/httpx probing (authorized).', related:['OSINT','Subdomain Enumeration','Attack Surface Management'] } },

  { id:'rt_f4', chapterId:'rt2', partId:'p16', type:'command', difficulty:'intermediate', tags:['nmap','httpx','recon','tools'],
    front:{ title:'Recon Toolchain Interpretation', question:'How would you interpret results from Nmap and httpx during authorized reconnaissance?', category:'Tools' },
    back:{ explanation:'Nmap identifies hosts/ports/services/versions/OS hints; httpx probes web services for liveness, status codes, titles, tech, TLS, and redirects. Together they move from network exposure to application attack surface.',
      internals:'Example (authorized): `nmap -sS -sV -Pn <target>` for service enumeration; `httpx -l hosts.txt -status-code -title -tech-detect` for web triage. Validate findings manually and respect scope/rate limits.',
      security: mp('Use outputs to prioritize interesting services/endpoints for deeper testing.', 'Detect scanning signatures, anomalous probes, and exposed management surfaces; alert on risky exposures.', 'Capture tool versions, commands (sanitized), timestamps, and corroborating evidence in findings.'),
      related:['Service Enumeration','Technology Fingerprinting','WAF Detection'] } },

  { id:'rt_f5', chapterId:'rt3', partId:'p16', type:'scenario', difficulty:'intermediate', tags:['network-pentest','scanning','enumeration'],
    front:{ title:'Network Pentest Workflow', question:'Outline a safe, authorized network penetration testing workflow.', category:'Network VAPT' },
    back:{ explanation:'1) Confirm scope/RoE. 2) Host discovery. 3) Port/service/version enumeration (TCP/UDP as in scope). 4) Identify misconfigurations/exposed services. 5) Manually validate findings and controlled exploitation if authorized. 6) Assess impact/segmentation/pivot risk conceptually. 7) Report with remediation and retest.',
      internals:'Differentiate unauthenticated vs authenticated views; account for firewalls, filtering, and false positives from scanners.',
      security: mp('Focus on highest-risk exposures and exploitability in authorized conditions.', 'Correlate scans with IDS/firewall logs; ensure critical services are monitored and segmented.', 'Provide reproducible evidence, severity/risk, affected assets, and clear fixes.'),
      related:['Nmap','Segmentation Testing','Banner Grabbing'] } },

  { id:'rt_f6', chapterId:'rt4', partId:'p16', type:'deep', difficulty:'intermediate', tags:['web','http','burp','api'],
    front:{ title:'Web/API Testing Fundamentals', question:'What core areas must be covered in web and API penetration testing?', category:'Web VAPT' },
    back:{ explanation:'Analyze HTTP requests/responses, authn/authz, session management, access control (including IDOR/BOLA/BFLA), input validation, business logic, file handling, security headers/CORS, and API-specific issues (rate limits, excessive data exposure, mass assignment, JWT/OAuth weaknesses, GraphQL introspection/authz).',
      internals:'Testing uses proxies and clients (e.g., Burp Suite, OWASP ZAP, Postman/curl) in authorized environments. Manual validation is essential to eliminate false positives.',
      security: mp('Identify root cause, prerequisites, and impact; demonstrate safely within scope.', 'Log and detect anomalous auth failures, access patterns, injection attempts, and abuse of APIs.', 'Map findings to OWASP Top 10/WSTG/API Top 10/ASVS, include evidence and remediation.'),
      related:['IDOR','SSRF','Broken Access Control','JWT'] } },

  { id:'rt_f7', chapterId:'rt5', partId:'p16', type:'concept', difficulty:'advanced', tags:['active-directory','kerberos','lateral-movement'],
    front:{ title:'Active Directory Security Assessment', question:'What are key components and common risk areas in Active Directory environments?', category:'AD Security' },
    back:{ explanation:'AD environments involve domain controllers, users/groups, GPOs, trusts, and auth protocols (Kerberos/NTLM/LDAP/SMB). Common assessment areas include credential hygiene, Kerberoasting/AS-REP roasting exposure, delegation/ACL misconfigurations, excessive privileges, service account risks, and lateral movement paths (analyzed in authorized labs).',
      internals:'Tools like BloodHound/SharpHound help visualize relationships/attack paths; Impacket/NetExec/Rubeus are used in authorized assessments to validate specific issues.',
      security: mp('In authorized labs, identify misconfigurations and attack paths to demonstrate business impact.', 'Detect abnormal Kerberos tickets, LDAP queries, SMB/admin activity, and privilege/path abuse.', 'Report risky configurations, affected objects, privilege paths, and prioritized hardening steps.'),
      related:['Kerberos','SPN','BloodHound','Least Privilege'] } },

  { id:'rt_f8', chapterId:'rt6', partId:'p16', type:'concept', difficulty:'intermediate', tags:['privesc','linux','windows'],
    front:{ title:'Privilege Escalation Methodology', question:'What is a structured approach to privilege escalation assessment on Linux and Windows?', category:'Privilege Escalation' },
    back:{ explanation:'Start with thorough enumeration: users/groups, permissions, services/tasks, sudo/SUID/capabilities (Linux), token privileges/services/unquoted paths/registry/credentials (Windows), and patch/config posture. Identify misconfigurations and vulnerable components, then validate impact in authorized scope.',
      internals:'Look for insecure file/service permissions, credential exposure, weak scheduled tasks/cron, dangerous sudo rules, and excessive privileges. Use trusted assessment tooling and manual checks.',
      security: mp('Prove impact safely (e.g., controlled privilege boundary testing) without unnecessary damage.', 'Monitor for suspicious privilege changes, service modifications, credential access, and abnormal process behavior.', 'Document exact misconfiguration/vulnerability, affected host, evidence, and remediation.'),
      related:['SUID','sudo','Token Privileges','Service Misconfiguration'] } },

  { id:'rt_f9', chapterId:'rt7', partId:'p16', type:'concept', difficulty:'intermediate', tags:['cloud','iam','wireless','c2'],
    front:{ title:'Cloud & Wireless Assessment + Adversary Emulation', question:'What are key focus areas in cloud/wireless security assessments and adversary emulation?', category:'Advanced Ops' },
    back:{ explanation:'Cloud: IAM/RBAC, public storage, network exposure (SGs/NACLs/VPC), metadata services, logging (e.g., CloudTrail), containers/K8s misconfigs. Wireless: rogue APs/evil twin, WPA2/WPA3/802.1X posture, deauth/misconfig risks (authorized). Adversary emulation follows ATT&CK-mapped stages with strict RoE and operational safety.',
      internals:'Assess identity, configuration, and network paths; validate exposures with least-impact methods and strong authorization.',
      security: mp('Emulate relevant techniques to test preventive/detective controls in scope.', 'Ensure telemetry/detections exist for identity abuse, anomalous cloud API calls, rogue wireless, and C2-like patterns.', 'Prioritize high-impact misconfigurations, provide least-privilege and hardening guidance.'),
      related:['IAM','Kubernetes Security','WPA3','Purple Team'] } },

  // Multi-perspective required examples
  { id:'mp_arp', chapterId:'bt2', partId:'p17', type:'security', difficulty:'intermediate', tags:['arp-spoofing','multi-perspective'],
    front:{ title:'ARP Spoofing (Multi-Perspective)', question:'What is ARP spoofing? Explain Red Team, Blue Team, and VAPT perspectives.', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'How/why: forged ARP replies poison IP-to-MAC mappings on a local segment to intercept/redirect traffic in authorized labs; requires L2 adjacency/conditions; impact includes MITM/disruption.',
      'Detect/respond: look for MAC-IP churn, duplicate IP/MAC anomalies, gratuitous ARP abuse, ARP cache inconsistencies; prevent with DHCP snooping/DAI, segmentation, port security; isolate and investigate affected hosts.',
      'Assess/document: validate exposure in authorized environments, identify affected segments/controls, rate impact, recommend mitigations and retest.'
    ), related:['ARP','DAI','MITM'] } },

  { id:'mp_dns_poison', chapterId:'bt2', partId:'p17', type:'security', difficulty:'intermediate', tags:['dns','poisoning','multi-perspective'],
    front:{ title:'DNS Poisoning (Multi-Perspective)', question:'What is DNS cache poisoning and how should it be viewed by Red, Blue, and VAPT?', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'Abuses weaknesses/misconfigurations to inject false DNS records into caches (authorized testing), redirecting users to unintended destinations; impact depends on targeted domains/services.',
      'Detect via unexpected resolutions, TTL/anomaly patterns, DNSSEC validation failures, resolver log analysis; mitigate with DNSSEC, hardened resolvers, monitoring, and secure configurations.',
      'Assess resolver/cache protections and configuration, document affected records/resolvers, impact, and remediation (DNSSEC, patching, validation).'
    ), related:['DNSSEC','Resolver Security'] } },

  { id:'mp_syn', chapterId:'rt3', partId:'p16', type:'security', difficulty:'intermediate', tags:['syn-flood','dos','multi-perspective'],
    front:{ title:'SYN Flood (Multi-Perspective)', question:'Explain SYN flood from Red, Blue, and VAPT perspectives.', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'Sends many SYNs to exhaust half-open connection state/resources on a target (only in authorized resilience tests); effectiveness depends on stack/config and protections.',
      'Detect spikes in SYN/SYN-RECV states, incomplete handshakes, and traffic anomalies; mitigate with SYN cookies, rate limiting, filtering, load balancing, and upstream DDoS protections.',
      'Assess resilience/controls under authorized conditions, document thresholds/impact, and recommend hardening and monitoring improvements.'
    ), related:['TCP Handshake','Rate Limiting','DDoS Defense'] } },

  { id:'mp_vlan', chapterId:'rt3', partId:'p16', type:'security', difficulty:'intermediate', tags:['vlan-hopping','multi-perspective'],
    front:{ title:'VLAN Hopping (Multi-Perspective)', question:'Explain VLAN hopping risks and handling across Red, Blue, and VAPT.', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'Attempts to reach other VLANs due to misconfigurations (e.g., trunk negotiation/native VLAN issues) in authorized assessments; feasibility is configuration/vendor dependent.',
      'Detect abnormal tagging/trunk behavior and unexpected inter-segment traffic; prevent by disabling DTP on access ports, explicit trunking, unused native VLAN, pruning, and L3 ACLs.',
      'Review switch configs/segmentation, validate controls in scope, document misconfigurations and blast radius, recommend fixes and retest.'
    ), related:['802.1Q','Segmentation','Switch Hardening'] } },

  { id:'mp_mac', chapterId:'bt2', partId:'p17', type:'security', difficulty:'beginner', tags:['mac-spoofing','multi-perspective'],
    front:{ title:'MAC Spoofing (Multi-Perspective)', question:'Explain MAC spoofing from Red, Blue, and VAPT perspectives.', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'Changing presented MAC to impersonate/bypass weak MAC-based controls in authorized tests; impact depends on NAC/port security posture.',
      'Detect duplicate MACs/port moves, unauthorized device profiles; enforce 802.1X/NAC, port security, and monitoring instead of MAC allowlists alone.',
      'Assess reliance on MAC-based controls, document bypass risk and affected segments, recommend stronger authentication/authorization controls.'
    ), related:['802.1X','NAC','Port Security'] } },

  { id:'mp_sqli', chapterId:'cp1', partId:'p18', type:'security', difficulty:'intermediate', tags:['sqli','injection','multi-perspective'],
    front:{ title:'SQL Injection (Multi-Perspective)', question:'Explain SQL injection from Red, Blue, and VAPT perspectives.', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'Occurs when untrusted input alters SQL queries in authorized testing; root cause is unsafe query construction; impact can include data exposure/modification depending on privileges.',
      'Detect via WAF/DB/app logs, anomalous query patterns/errors, and telemetry; prevent with parameterized queries, least-privilege DB accounts, input validation, and secure coding.',
      'Validate safely with evidence of injection point/impact, classify severity (CVSS/context), document root cause and remediation, and retest.'
    ), related:['OWASP A03','Parameterized Queries'] } },

  { id:'mp_xss', chapterId:'cp1', partId:'p18', type:'security', difficulty:'intermediate', tags:['xss','multi-perspective'],
    front:{ title:'Cross-Site Scripting (Multi-Perspective)', question:'Explain XSS from Red, Blue, and VAPT perspectives.', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'Untrusted input executed in a victim’s browser context due to improper output handling; impact includes session/data exposure or actions on behalf of users (authorized validation).',
      'Detect via CSP reports, WAF/app telemetry, unusual script/content patterns; mitigate with context-aware output encoding, sanitization where appropriate, CSP, and secure frameworks.',
      'Document affected parameters/contexts, reproducible evidence, impact, and fixes; verify after remediation.'
    ), related:['Output Encoding','CSP','OWASP'] } },

  { id:'mp_ssrf', chapterId:'cp1', partId:'p18', type:'security', difficulty:'intermediate', tags:['ssrf','multi-perspective'],
    front:{ title:'SSRF (Multi-Perspective)', question:'Explain Server-Side Request Forgery from Red, Blue, and VAPT perspectives.', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'Induces server-side requests to unintended destinations (including internal/metadata endpoints) when URL fetches are insufficiently controlled in authorized tests.',
      'Detect unexpected outbound/internal requests from app servers, metadata access attempts; mitigate with allowlists, URL validation, egress filtering, IMDS protections, and segmentation.',
      'Validate reachable targets/impact safely, document request flow and evidence, rate risk, and recommend network/application controls.'
    ), related:['Egress Controls','IMDSv2','Allowlisting'] } },

  { id:'mp_idor', chapterId:'cp1', partId:'p18', type:'security', difficulty:'intermediate', tags:['idor','access-control','multi-perspective'],
    front:{ title:'IDOR / Broken Access Control (Multi-Perspective)', question:'Explain IDOR/broken object-level authorization across Red, Blue, and VAPT.', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'Manipulating identifiers to access/modify other users’ objects when server-side authorization checks are missing (authorized testing).',
      'Detect anomalous object access patterns, authorization failures/success anomalies, and audit log gaps; enforce object-level checks and least privilege.',
      'Confirm authorization boundaries, provide reproducible steps/evidence, assess data sensitivity/impact, and recommend consistent server-side authz.'
    ), related:['BOLA','RBAC/ABAC','OWASP A01'] } },

  { id:'mp_authbypass', chapterId:'cp1', partId:'p18', type:'security', difficulty:'intermediate', tags:['auth-bypass','multi-perspective'],
    front:{ title:'Authentication Bypass (Multi-Perspective)', question:'Explain authentication bypass risks from Red, Blue, and VAPT perspectives.', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'Flaws that allow access without proper authentication (logic flaws, misconfig, weak token/session handling) identified in authorized assessments.',
      'Detect unusual login/session anomalies, impossible flows, and privilege changes; harden auth flows, MFA, session management, and monitoring.',
      'Validate preconditions and impact, document exact flaw path, rate severity, and recommend robust auth/session controls and retest.'
    ), related:['Session Management','MFA','Access Control'] } },

  { id:'mp_privesc', chapterId:'rt6', partId:'p16', type:'security', difficulty:'advanced', tags:['privilege-escalation','multi-perspective'],
    front:{ title:'Privilege Escalation (Multi-Perspective)', question:'Explain privilege escalation from Red, Blue, and VAPT perspectives.', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'Leveraging misconfigurations/vulnerabilities to gain higher privileges in authorized scope (e.g., weak service perms, sudo/SUID issues, token abuse).',
      'Detect suspicious privilege/token use, service/task changes, credential access, and anomalous admin actions; enforce least privilege and hardening.',
      'Report initial privilege, escalation path, evidence, impact, and specific remediations; retest to confirm closure.'
    ), related:['Least Privilege','Hardening','EDR/SIEM'] } },

  { id:'mp_creds', chapterId:'rt5', partId:'p16', type:'security', difficulty:'advanced', tags:['credential-exposure','multi-perspective'],
    front:{ title:'Credential Exposure (Multi-Perspective)', question:'Explain credential exposure risks from Red, Blue, and VAPT perspectives.', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'Credentials/secrets exposed via misconfigs, logs, repos, weak storage, or protocol weaknesses can enable unauthorized access in authorized assessments.',
      'Detect leaked/used credentials, impossible travel, abnormal auth, and secret access; rotate/revoke, enforce MFA, vault secrets, and monitor.',
      'Identify exposure source and blast radius, validate risk safely, recommend secret management/rotation and detection controls.'
    ), related:['Secrets Management','MFA','IAM'] } },

  { id:'mp_lateral', chapterId:'rt5', partId:'p16', type:'security', difficulty:'advanced', tags:['lateral-movement','multi-perspective'],
    front:{ title:'Lateral Movement (Multi-Perspective)', question:'Explain lateral movement from Red, Blue, and VAPT perspectives.', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'Movement between systems after initial access using legitimate/admin protocols or relationships in authorized emulation; depends on credentials, trust, and segmentation.',
      'Detect unusual remote admin activity (SMB/RDP/WinRM/SSH), auth patterns, and east-west traffic; apply segmentation, least privilege, and strong monitoring.',
      'Assess segmentation and privilege boundaries, document feasible paths and controls, and recommend containment/hardening measures.'
    ), related:['Segmentation','Zero Trust','ATT&CK Lateral Movement'] } },

  { id:'mp_pivot', chapterId:'rt3', partId:'p16', type:'security', difficulty:'advanced', tags:['pivoting','multi-perspective'],
    front:{ title:'Network Pivoting (Multi-Perspective)', question:'Explain network pivoting concepts from Red, Blue, and VAPT perspectives.', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'Using a compromised/authorized foothold to route access to otherwise unreachable internal networks during scoped assessments, highlighting segmentation gaps.',
      'Detect anomalous tunneling/proxy behavior, unusual internal scans, and new traffic paths; enforce egress controls and microsegmentation.',
      'Evaluate segmentation effectiveness and reachable assets, document risk and paths, and recommend network access restrictions and monitoring.'
    ), related:['Network Segmentation','Egress Filtering'] } },

  { id:'mp_cloud', chapterId:'rt7', partId:'p16', type:'security', difficulty:'advanced', tags:['cloud-misconfiguration','multi-perspective'],
    front:{ title:'Cloud Misconfiguration (Multi-Perspective)', question:'Explain cloud misconfiguration from Red, Blue, and VAPT perspectives.', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'Issues like excessive IAM permissions, public storage, exposed management endpoints, or weak network controls can create unauthorized access paths in authorized assessments.',
      'Detect risky IAM changes, public exposure, anomalous API calls, and data access via cloud logs (e.g., CloudTrail) and CSPM alerts.',
      'Assess identity, storage, network, and logging posture; report misconfigs with evidence, impact, and least-privilege/hardening remediation.'
    ), related:['IAM','S3/Storage Security','CloudTrail'] } },

  { id:'mp_ad', chapterId:'rt5', partId:'p16', type:'security', difficulty:'advanced', tags:['active-directory','multi-perspective'],
    front:{ title:'Active Directory Attack Paths (Multi-Perspective)', question:'Explain AD attack path risks from Red, Blue, and VAPT perspectives.', category:'Multi-Perspective' },
    back:{ explanation: mp(
      'Misconfigurations in trusts, ACLs, delegation, SPNs, and privileges can form chained paths to high-value targets in authorized AD assessments/labs.',
      'Detect abnormal Kerberos/LDAP/SMB behavior, privilege changes, and suspicious admin patterns; harden tiering, delegation, and monitoring.',
      'Map and document risky relationships/paths, prioritize fixes by impact and likelihood, and validate remediation with retest.'
    ), related:['BloodHound','Kerberoasting Exposure','Tiered Admin'] } },

  // Blue Team focused
  { id:'bt_f1', chapterId:'bt1', partId:'p17', type:'concept', difficulty:'intermediate', tags:['soc','siem','triage'],
    front:{ title:'SOC Triage & SIEM Fundamentals', question:'What are core SOC L1/L2 and SIEM responsibilities?', category:'Blue Team' },
    back:{ explanation:'SOC L1 handles monitoring, alert triage, initial classification, and escalation; L2 performs deeper investigation, correlation, scoping, and response support. SIEM collects/normalizes logs, correlates events, and triggers detections for investigation.',
      internals:'Effective triage uses context: asset criticality, user behavior, threat intel, and corroborating telemetry (endpoint, network, identity, cloud).',
      security:'Reduce false positives via tuning, improve coverage with detection engineering, and follow IR playbooks for consistent response.', related:['Splunk','Sentinel','Elastic','Wazuh'] } },

  { id:'bt_f2', chapterId:'bt2', partId:'p17', type:'scenario', difficulty:'intermediate', tags:['threat-hunting','c2','dns'],
    front:{ title:'Hunting for C2 Beaconing', question:'How would you hunt for potential C2 beaconing in network/DNS telemetry?', category:'Threat Hunting' },
    back:{ explanation:'Look for periodic connections to rare/new domains or IPs, consistent intervals/jitter, unusual user-agents/SNI, low-and-slow data patterns, and suspicious DNS query volumes or TXT/encoded patterns (context dependent). Correlate with endpoint/process and proxy/firewall logs.',
      internals:'Baselines and statistical outliers help; validate benign causes (updates, monitoring) before escalation.',
      security:'Contain affected hosts per IR process, block indicators where appropriate, and improve detections for recurrence.', related:['DNS Tunneling','NetFlow','Zeek/Suricata'] } },

  { id:'bt_f3', chapterId:'bt3', partId:'p17', type:'concept', difficulty:'intermediate', tags:['dfir','ir','forensics'],
    front:{ title:'Incident Response & Forensics Lifecycle', question:'Summarize the IR lifecycle and key DFIR activities.', category:'DFIR' },
    back:{ explanation:'IR lifecycle commonly includes preparation, identification, containment, eradication, recovery, and lessons learned. DFIR supports with evidence acquisition/preservation, log/PCAP/memory/disk analysis, timeline reconstruction, and root-cause determination.',
      internals:'Maintain chain of custody, preserve volatile data when feasible, and correlate host/network/cloud telemetry to scope impact.',
      security:'Outputs include incident reports, IOCs/TTPs, detection improvements, and validated remediation.', related:['Timeline Analysis','Memory Forensics','Chain of Custody'] } },

  { id:'cp_f1', chapterId:'cp1', partId:'p18', type:'deep', difficulty:'intermediate', tags:['vapt','reporting','cvss'],
    front:{ title:'Professional VAPT Finding Structure', question:'What should a professional VAPT finding include?', category:'VAPT Reporting' },
    back:{ explanation:'A strong finding includes: title, severity and CVSS score/vector (with context), affected asset/scope, description and root cause, prerequisites, reproduction steps, evidence (sanitized), impact, remediation, references, and retest status/outcome.',
      internals:'Distinguish confirmed vulnerabilities from informational observations; validate scanner results to remove false positives and prioritize by exploitability and business risk (e.g., CVSS/EPSS/context).',
      security:'Reporting must be clear, actionable, and ethical—only for authorized engagements with agreed RoE and data handling.', related:['CVSS','CWE','PTES','OWASP WSTG'] } },
]