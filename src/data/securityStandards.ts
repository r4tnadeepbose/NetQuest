import type { Chapter, Flashcard, Part } from '../types'

export const securityStandardsPart: Part = {
  id: 'p-standards',
  title: 'Security Standards & Testing Guides',
  description: 'OWASP Top 10, ASVS, WSTG, and MASVS: purposes, functions, and how they map to secure design, development, and testing.'
}

export const securityStandardsChapters: Chapter[] = [
  { id: 'sec1', partId: 'p-standards', order: 1, title: 'OWASP Top 10: Risk Awareness', description: 'What the OWASP Top 10 is, how to use it, and its role in prioritizing common web/application risks.' },
  { id: 'sec2', partId: 'p-standards', order: 2, title: 'OWASP ASVS: Verification Requirements', description: 'Application Security Verification Standard structure, levels, and functions for building and verifying secure software.' },
  { id: 'sec3', partId: 'p-standards', order: 3, title: 'OWASP WSTG: Web Security Testing', description: 'Web Security Testing Guide methodology and how to plan and execute structured security tests.' },
  { id: 'sec4', partId: 'p-standards', order: 4, title: 'OWASP MASVS: Mobile App Security', description: 'Mobile Application Security Verification Standard for mobile threat models, controls, and verification.' },
  { id: 'sec5', partId: 'p-standards', order: 5, title: 'Mapping & Using Standards Together', description: 'How Top 10, ASVS, WSTG, and MASVS complement each other across SDLC and assessments (authorized contexts).' },
]

const c = (x: Flashcard): Flashcard => x

export const securityStandardsFlashcards: Flashcard[] = [
  c({ id:'std1', chapterId:'sec1', partId:'p-standards', type:'concept', difficulty:'beginner', tags:['owasp','top10','standards','risk'],
    front:{ title:'OWASP Top 10 (What & Why)', question:'What is the OWASP Top 10 and what is its primary function?', category:'Standard' },
    back:{ explanation:'The OWASP Top 10 is a widely used awareness document that highlights critical security risks for web applications. Its primary function is to help organizations prioritize common, high-impact risk categories and drive secure design, coding, and testing practices.',
      internals:'It is periodically updated based on data and industry input. Categories are risk-focused (e.g., access control, injection, misconfiguration) rather than a complete checklist of every vulnerability.',
      why:'Teams use it to focus remediation, training, and baseline controls on prevalent and impactful issues.',
      security:'The Top 10 is a starting point, not exhaustive. Mature programs combine it with verification standards (ASVS), testing guides (WSTG), and threat modeling.',
      example:'Using the Top 10 to prioritize fixing broken access control and injection classes across applications.', related:['ASVS','WSTG','Secure SDLC'] } }),

  c({ id:'std2', chapterId:'sec1', partId:'p-standards', type:'concept', difficulty:'intermediate', tags:['owasp','top10','mapping'],
    front:{ title:'Using OWASP Top 10 Effectively', question:'How should teams use the OWASP Top 10 in practice?', category:'Standard' },
    back:{ explanation:'Use it for awareness, prioritization, training, and as an input to requirements and testing. Map Top 10 categories to concrete controls, verification requirements (ASVS), and test cases (WSTG).',
      internals:'Each category represents a class of weaknesses with multiple possible root causes and manifestations; addressing it requires defense-in-depth (design, code, config, runtime).',
      why:'Prevents treating the Top 10 as a simple scan-and-fix checklist and encourages systemic improvements.',
      security:'Pair with secure architecture reviews, code review, dependency management, and continuous testing in authorized environments.',
      related:['ASVS','WSTG','Threat Modeling'] } }),

  c({ id:'std3', chapterId:'sec2', partId:'p-standards', type:'concept', difficulty:'beginner', tags:['asvs','verification','requirements'],
    front:{ title:'OWASP ASVS (Function)', question:'What is OWASP ASVS and what function does it serve?', category:'Standard' },
    back:{ explanation:'OWASP Application Security Verification Standard (ASVS) is a framework of security requirements for designing, building, and testing modern web applications and services. Its function is to provide a basis for verifying application security controls and defining security requirements.',
      internals:'ASVS organizes requirements into control areas (e.g., authentication, session management, access control, validation, cryptography, logging) and verification levels to match risk profiles.',
      why:'It enables consistent, measurable security verification between developers, testers, and stakeholders.',
      security:'Use ASVS to derive testable requirements and acceptance criteria; map findings and tests to specific ASVS controls for traceability.',
      example:'Selecting ASVS Level 2 requirements for an application handling sensitive data and verifying them during development and assessment.', related:['WSTG','OWASP Top 10'] } }),

  c({ id:'std4', chapterId:'sec2', partId:'p-standards', type:'deep', difficulty:'intermediate', tags:['asvs','levels','mapping'],
    front:{ title:'ASVS Levels & Mapping', question:'How do ASVS verification levels work and how can ASVS map to testing?', category:'Standard' },
    back:{ explanation:'ASVS defines increasing levels of verification rigor to align with application risk. Lower levels cover essential baseline controls; higher levels add depth for sensitive or high-assurance contexts.',
      internals:'Teams select a target level based on threat model, data sensitivity, and exposure. Each requirement can be verified through design review, code review, configuration review, or dynamic testing.',
      why:'Provides a scalable approach: not every application needs the same depth, but all benefit from a clear baseline.',
      security:'Map ASVS requirements to WSTG test cases and to development stories/controls to close the loop from requirement to verification.',
      related:['WSTG','Threat Modeling','Secure SDLC'] } }),

  c({ id:'std5', chapterId:'sec3', partId:'p-standards', type:'concept', difficulty:'beginner', tags:['wstg','testing','methodology'],
    front:{ title:'OWASP WSTG (Function)', question:'What is the OWASP Web Security Testing Guide (WSTG) and how is it used?', category:'Standard' },
    back:{ explanation:'OWASP WSTG is a comprehensive guide for testing the security of web applications and web services. Its function is to provide a structured testing methodology, scenarios, and techniques to identify weaknesses in an authorized assessment context.',
      internals:'WSTG covers phases and categories such as information gathering, configuration and deployment management testing, identity/authentication/authorization testing, session management, input validation, error handling, cryptography, business logic, and client-side testing.',
      why:'Promotes consistent, repeatable, and thorough web security testing beyond ad-hoc checks.',
      security:'WSTG activities must be performed with explicit authorization and defined scope. Findings should be validated, risk-rated, and mapped to remediation guidance and requirements (e.g., ASVS).',
      example:'Using WSTG test cases to assess authentication, access control, and input handling during an approved penetration test.', related:['ASVS','OWASP Top 10','PTES'] } }),

  c({ id:'std6', chapterId:'sec3', partId:'p-standards', type:'how', difficulty:'intermediate', tags:['wstg','workflow','vapt'],
    front:{ title:'WSTG in an Assessment Workflow', question:'How does WSTG fit into a web application security assessment workflow?', category:'Standard' },
    back:{ explanation:'WSTG supports planning, execution, and reporting of tests: define scope and objectives, gather information, test relevant control areas, validate evidence, assess impact, and document reproducible findings with remediation.',
      internals:'Test selection is driven by application architecture, features, and threat model. Not every test applies to every target; testers prioritize based on risk and exposure.',
      why:'Ensures coverage of key areas while maintaining a risk-based, evidence-driven approach.',
      security:'Combine WSTG with safe testing practices, logging, and coordination to avoid unintended impact in authorized environments.',
      related:['VAPT','ASVS','OWASP Top 10'] } }),

  c({ id:'std7', chapterId:'sec4', partId:'p-standards', type:'concept', difficulty:'beginner', tags:['masvs','mobile','verification'],
    front:{ title:'OWASP MASVS (Function)', question:'What is OWASP MASVS and what is its purpose?', category:'Standard' },
    back:{ explanation:'OWASP Mobile Application Security Verification Standard (MASVS) defines security requirements for mobile applications. Its purpose is to provide a baseline for mobile app security and a set of verification requirements aligned with mobile threat models.',
      internals:'MASVS addresses areas such as storage, cryptography, authentication/session management, network communication, platform interaction, code quality/build settings, and resilience considerations (depending on profile/level).',
      why:'Mobile apps face distinct risks (device compromise, insecure local storage, platform APIs, reverse engineering) that require tailored controls.',
      security:'Use MASVS to set requirements and verify controls; pair with mobile-focused testing guidance and authorized assessment practices.',
      example:'Applying MASVS requirements to ensure sensitive data is stored and transmitted securely on iOS/Android apps.', related:['MSTG/MASTG','ASVS','OWASP Top 10'] } }),

  c({ id:'std8', chapterId:'sec4', partId:'p-standards', type:'compare', difficulty:'intermediate', tags:['asvs','masvs','wstg'],
    front:{ title:'ASVS vs MASVS vs WSTG', question:'How do ASVS, MASVS, and WSTG differ?', category:'Standard' },
    back:{ explanation:'ASVS defines what security controls to verify in web/apps (requirements/verification). MASVS defines mobile-specific security requirements. WSTG provides how to test web applications (methodology and test cases).',
      internals:'ASVS/MASVS are requirement/verification standards; WSTG is a testing guide. They complement each other: requirements inform tests, and tests provide evidence of verification.',
      why:'Using the right artifact for the right purpose improves clarity: build to ASVS/MASVS, test with WSTG (and mobile testing guidance) as applicable.',
      security:'All should be applied within authorized scope and appropriate threat models.',
      related:['OWASP Top 10','Secure SDLC'] } }),

  c({ id:'std9', chapterId:'sec5', partId:'p-standards', type:'concept', difficulty:'intermediate', tags:['mapping','top10','asvs','wstg','masvs'],
    front:{ title:'Mapping Top 10, ASVS, WSTG, MASVS', question:'How can OWASP Top 10, ASVS, WSTG, and MASVS be mapped and used together?', category:'Standard' },
    back:{ explanation:'Use OWASP Top 10 to highlight priority risk areas; use ASVS/MASVS to define specific, testable security requirements; use WSTG (and mobile testing practices) to execute verification tests. Map findings to Top 10 categories for communication and to ASVS/MASVS controls for remediation.',
      internals:'Example flow: identify risk (Top 10) → specify control/requirement (ASVS/MASVS) → verify via testing (WSTG/authorized assessments) → remediate and retest → track coverage.',
      why:'This creates traceability from business risk to concrete controls and verified outcomes.',
      security:'In this app, these mappings are presented for education and authorized security practice; always follow legal/ethical rules and defined scope.',
      related:['Threat Modeling','VAPT','Secure SDLC'] } }),
]