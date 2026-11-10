# Release verification — 10 November 2026

OSIALI 0.1.0 preserves the incident-investigation purpose. This release validates manual evidence, labels manual outcomes as reported, preserves fallback identifiers in exported cases, protects newer selections from delayed lookups, and improves mobile action/case navigation.

The public repository and canonical domain are `ShalyX/osiali` and `osiali.vercel.app`. The public homepage is `/`; the incident application is `/app/`. Export schema is `osiali-evidence/v1`; manual terminal classifications are REFUND_REPORTED or DELIVERY_REPORTED, with provisional assurance and SUPPLIED lifecycle provenance. Integrations consuming the old schema/name should update their expectations.

Verification before publication:

- 40 automated tests passed; nine red-team scenarios passed; build passed.
- Browser F1/F2/F3, actual manual case download, malformed terminal hashes, flag-only refund and identifier-preserving provisional export passed.
- A deliberately delayed simulated API response did not overwrite a newer F3 selection.
- Desktop/mobile screenshots refreshed; no overflow at widths 390, 760, 761, 1024, 1440.
- Fresh machine-readable test output and repeatability output retained under evidence/.

Public docs were consolidated. Original working notes/checkpoints were preserved locally outside tracking rather than published as current product documentation. Git history was not rewritten. MIT licensing and Node 22/24 CI were added.

Remaining limits: active pending public pages require matching manual evidence; no universal history lookup, independent chain finality, refund execution or impact/adoption claim. No fresh full screen-reader certification or trademark clearance is claimed. Older videos predate the new address/export semantics and need a consistency check before publication. No X post or hackathon submission is included in this release.
