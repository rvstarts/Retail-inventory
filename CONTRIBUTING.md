# Contributing Guidelines
## Retail Inventory Management System (RIMS)
**Project Code:** `PRG_RIMS_001`  
**Client:** XYZ Retail Corporation  

Thank you for contributing to the Retail Inventory Management System (RIMS). We welcome contributions that maintain enterprise-grade software quality, documentation integrity, and comprehensive test coverage.

---

## 1. Code of Conduct
All contributors are expected to uphold professional standards:
- Treat all team members with respect and courtesy.
- Write clear, constructive code reviews.
- Adhere strictly to clean architecture, zero-negative inventory invariants, and secure coding practices.

---

## 2. Branching & Git Workflow

We use a modified Gitflow workflow:
- `main`: Production-ready code deployed to AWS ECS Production.
- `develop`: Integration branch for sprint features.
- `feature/US-xxx-short-desc`: Feature branches branched from `develop`.
- `bugfix/BUG-xxx-short-desc`: Defect remediation branches.
- `release/vX.Y.Z`: Release stabilization branches.

### Commit Message Conventions
Format: `<type>(<scope>): <subject>`  
Examples:
- `feat(catalog): add bulk CSV product import streaming`
- `fix(order): release reserved stock on order cancellation`
- `test(inventory): add unit tests for zero negative stock rule`
- `docs(api): update OpenAPI 3.0 specs for RFID reader adapter`

---

## 3. Development Standards

### Java Backend (Spring Boot 3.x / Java 21)
- Follow Google Java Style Guide.
- Enforce immutability and record-based DTOs where appropriate.
- Annotate transactional methods with `@Transactional(rollbackFor = Exception.class)`.
- Never bypass Spring Security role checks or write raw unparameterized SQL queries.
- Ensure all new service methods have corresponding JUnit 5 unit tests with Mockito mocks.

### React Frontend (React 18 / TypeScript / Tailwind CSS)
- Write modular, accessible TypeScript components with explicit interface props.
- Adhere to the established slate/navy design palette with Lucide React icons.
- Verify production bundling prior to submitting PRs: `npm run build`.

---

## 4. Pull Request Checklist
Before submitting a PR, verify:
- [ ] Backend tests pass: `.\mvnw.cmd test` (0 failures, 0 errors).
- [ ] Frontend builds with zero TypeScript errors: `npm run build`.
- [ ] No hardcoded credentials or passwords in code (use environment variables).
- [ ] Documentation updated in `API.md` or `DATABASE.md` if schema/endpoints changed.

---
© 2026 XYZ Retail Corporation • Document Reference: `PRG_RIMS_001_CONTRIB_V1`

