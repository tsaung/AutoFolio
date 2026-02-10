# AutoFolio Specifications

This directory contains the **Living Specifications** for the project.
Unlike traditional "Plans" which are transient, these files document the **current state** of the system.

## Workflow Rule
1.  Before writing code, read the relevant spec to understand the *intended* behavior.
2.  When implementing a new feature or changing behavior, **update the spec** first (or in the same PR).
3.  **TDD:** All changes must be verified by tests. The tests verify that the code meets the spec.

## Structure
- `00-workflow.md`: The mandatory AI-Driven TDD Workflow and development protocols.
- `01-system-overview.md`: High-level architecture, tech stack, and core principles.
- `02-features.md`: Detailed breakdown of implemented features.
- `03-database.md`: Schema, RLS policies, and data flow.
