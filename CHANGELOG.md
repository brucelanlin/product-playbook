# CHANGELOG

A running log of meaningful changes to this skill system — what changed and why.

---

## 2026-08-12

### Added: Story content rules section (`prototyping-lab-pm`)
Encodes preferences learned from refinement sessions:
- Description structure order: persona → background → in scope → out of scope → dependencies → assumptions → size
- No `*User Story*` header — redundant given Jira issue type
- No technical decisions, architect notes, or pre-implementation checklists in descriptions
- Plain English over internal symbol names in both description and AC
- Persona must be a named platform persona, never "a user" or "the platform"

### Added: Story refinement route and workflow (`prototyping-lab-pm`)
Encodes the treatment applied across GENAIPLAB-247, -377, -378, -388 into a repeatable 5-step workflow: fetch → analyse → propose → apply → INVEST check. Triggered by "simplify", "refine", "clean up", "apply the same treatment", or a pasted Jira URL.

### Added: INVEST check table to post-creation audit (`prototyping-lab-pm`)
INVEST was only applied at story generation time. Added a check table to the post-creation audit so it runs on every story created or updated, not just new ones. Each criterion has an explicit failure action.

### Added: Story splitting patterns from Humanizing Work (`prototyping-lab-pm`)
Added CRUD operations, simple/complex, defer performance, spike, and thin end-to-end slice patterns to the splitting strategy section. Post-split validation prompt added.

### Added: Request routing table with 16 routes (`prototyping-lab-pm`)
Single entry point now covers: feature/story creation, sprint planning, stakeholder request decoding, epic hypothesis, OST, discovery, VOC, JTBD, persona refinement, quick/deep competitive, battle card, market landscape, story mapping, story splitting. Context blocks A–D inject platform context before delegation.

### Added: `aiplab-sprint-planning` skill
Sprint and PI planning assistant that reads live GENAIPLAB board state. Covers readiness checks, wizard step coverage analysis, dependency flags, sprint goal drafting, and PI planning mode.

### Extended: `genaiplab-ac-audit` key ranges
Added GENAIPLAB-395 to GENAIPLAB-500 range. Added comment explaining how to extend as backlog grows.

### Archived: `arteai-feature-story`
Moved to `archive/` — superseded by `prototyping-lab-pm` which is a strict superset.

### Added: README restructured for external reusability
- Reusability map table per skill (use as-is / adapt / reference only)
- Step-by-step adaptation guides for `prototyping-lab-pm`, `aiplab-sprint-planning`, `genaiplab-ac-audit`
- Quick start for both AI Prototyping Lab users and adapters
- Clarified that any Jira MCP server works, not just SAP-specific

---

## 2026-08-06 (approx)

### Initial commit
- `prototyping-lab-pm` — feature and story creation skill for ARTEAI/GENAIPLAB
- `feature-to-user-stories` — generic story decomposition, no project-specific content
- `arteai-feature-story` — original feature/story skill (later archived)
- `genaiplab-ac-audit.js` — workflow to audit AC field compliance across GENAIPLAB stories
- `.gitignore` — excludes `settings.local.json` (machine-specific tool permissions)
