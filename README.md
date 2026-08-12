# product-playbook

Claude Code skills and workflows for the AI Prototyping Lab — a SAP-internal platform for governed, reusable AI prototyping. This repo is the PO/PM's working toolkit: everything needed to go from a product idea to a Jira-ready feature spec or story set, with platform context and governance rules built in.

---

## What's in this repo

```
skills/
  prototyping-lab-pm/       # Primary skill — all PM work enters here
  aiplab-sprint-planning/   # Sprint and PI planning assistant — reads live Jira board state
  arteai-feature-story/     # Earlier feature+story skill (superseded by prototyping-lab-pm)
  feature-to-user-stories/  # Generic story decomposition skill (reusable on any product)
workflows/
  genaiplab-ac-audit.js     # Workflow: audit AC field compliance across GENAIPLAB stories
```

---

## Skills

### `prototyping-lab-pm` — Primary skill

**The single entry point for all product work on the AI Prototyping Lab.** Invoke this skill for anything PM-related — feature specs, story writing, stakeholder requests, research, competitive comparisons, backlog planning. It identifies the request type, routes to the right pm-skill if needed, and pre-loads platform context so outputs are always grounded in the PRD, the 3 personas, and the platform scope.

**What it handles:**

| Request type | Delegates to | Output |
|---|---|---|
| Feature creation / refinement | Direct execution | 9-section spec → ARTEAI |
| Story creation / refinement | Direct execution | Given/When/Then stories → GENAIPLAB, board 62344 |
| Stakeholder request decoding | `incoming-request-advisor` | Literal ask vs. job-to-be-done breakdown |
| Frame initiative as hypothesis | `epic-hypothesis` | Testable if/then bet with validation method |
| Opportunity / problem framing | `opportunity-solution-tree` | OST from outcome → opportunities → solutions → experiments |
| Full discovery cycle | `discovery-process` | Structured path from hypothesis to validated opportunity |
| User research planning | `discovery-interview-prep` | Interview plan with methodology and question framework |
| Customer voice / feedback mining | `voice-of-customer-miner` | Themed verbatims and unmet needs |
| Jobs to be done | `jobs-to-be-done` | Functional / social / emotional job map |
| Persona refinement | `proto-persona` | Working persona hypothesis grounded in platform context |
| Quick competitive comparison | `competitive-research-snapshot` | Cited snapshot in 20–40 min |
| Deep competitive analysis | `competitive-analysis-process` | 6-step full analysis for strategy cycles |
| Competitor battle card | `battle-card-builder` | Positioning artifact framed against SAP internal adjacencies |
| Market landscape | `market-landscape-scan` | Segments, players, whitespace in SAP internal tooling space |
| User story mapping | `user-story-mapping` | Wizard-step backbone with release slices |
| Story splitting | `epic-breakdown-advisor` | INVEST-validated vertical slices with sequencing |
| Sprint / PI planning | `aiplab-sprint-planning` (direct) | Sprint readiness brief, goal draft, dependency flags |

**Key rules baked in:**
- Always reads the PRD before generating anything — PRD overrides user prompts on scope
- Always syncs the feature registry from Jira before creating new features
- Always pulls latest code from the 3 repos before drafting stories
- Features go in ARTEAI; stories always go in GENAIPLAB
- AC goes exclusively in `customfield_25640` (Okapya checklist format) — never in the description field
- Default mode is read-only draft — never writes to Jira without explicit confirmation
- After any delegation, output is interpreted through the PRD before being presented

**How delegation works:**

When routing to a pm-skill, the skill pre-loads one or more context blocks as arguments so the pm-skill skips its usual onboarding questions and works directly with your product context:

| Context block | Used for |
|---|---|
| A — Platform & personas | Research, discovery, JTBD, personas, OST, hypothesis |
| B — Scope, structure & constraints | Story splitting, story mapping, Jira routing rules, 4-step wizard breakdown |
| C — Competitive framing | All competitive and market intelligence work |
| D — Stakeholder context | Incoming request decoding |

---

### `aiplab-sprint-planning` — Sprint and PI planning assistant

Reads live board state from Jira and produces a planning brief the team can act on. Unlike `prototyping-lab-pm` which creates and refines individual items, this skill reasons over the board holistically — story readiness, wizard step coverage, dependencies, and sprint goal.

**Triggers:** "sprint planning", "sprint goal", "what's ready to plan", "PI planning", "story readiness", "plan the next sprint", "backlog health"

**What it does:**

| Step | What it checks |
|---|---|
| Board fetch | Active sprint, backlog candidates, story details |
| Readiness check | Missing AC, no parent feature, no priority, no estimate, deferred stories |
| Coverage analysis | Which wizard steps (idea-intake → review-save) are over/under-represented |
| Dependency flags | Blocked stories, blocking stories, circular dependencies |
| Sprint goal draft | "We deliver X so that AI Business Innovator can Y" — one sentence |
| Planning brief | Full structured output ready for the ceremony |

**PI planning mode:** Maps stories to future sprints, surfaces features with no stories yet, flags gaps before the PI event.

**Key rules:**
- Read-only by default — never moves stories or changes sprint without confirmation
- If a story needs AC before it can be pulled in, offers to write it via `prototyping-lab-pm`
- Never touches ARTEAI-335 (deferred)

---

### `feature-to-user-stories` — Generic story decomposition

A general-purpose skill for converting any feature description, Jira Feature key, PRD section, or epic into implementation-ready user stories. Not AI Prototyping Lab-specific — works for any product context.

**Use this when:**
- Working outside the AI Prototyping Lab context
- You want lightweight story decomposition without the full prototyping-lab-pm pre-flight (auth, registry sync, git pulls)
- You need a quick draft from a pasted feature description

**Does not include:** Jira field validation, feature registry sync, codebase cross-reference, or the routing table. For AI Prototyping Lab work, use `prototyping-lab-pm` instead.

**Produces:** Full story set with Given/When/Then AC, sizing, priority, dependencies, open questions, and a Jira-ready summary table.

---

### `arteai-feature-story` — Earlier generation (superseded)

The original feature and story skill for the AI Prototyping Lab. Covers the same core workflow as `prototyping-lab-pm` but predates: the feature registry sync, the 3-repo git pull requirement, the request routing table, the INVEST gate, the Humanizing Work splitting patterns, and the research/competitive delegation to pm-skills.

**Status:** Kept for reference. For all active work, use `prototyping-lab-pm`.

---

## Skill relationships

```
prototyping-lab-pm  ◄──── single entry point for all AI Prototyping Lab PM work
    │
    ├── executes directly ──► feature creation (ARTEAI)
    ├── executes directly ──► story creation (GENAIPLAB, board 62344)
    ├── executes directly ──► aiplab-sprint-planning (sprint / PI planning)
    │
    ├── [context block D] ──► pm-essentials:incoming-request-advisor   (decode stakeholder ask)
    ├── [context A + B]   ──► pm-essentials:epic-hypothesis             (frame as testable bet)
    ├── [context block A] ──► pm-essentials:opportunity-solution-tree   (problem framing)
    ├── [context block A] ──► pm-essentials:discovery-process           (full discovery cycle)
    ├── [context block A] ──► pm-essentials:discovery-interview-prep    (interview planning)
    ├── [context block A] ──► pm-essentials:voice-of-customer-miner     (VOC / feedback mining)
    ├── [context block A] ──► pm-essentials:jobs-to-be-done             (JTBD)
    ├── [context A + B]   ──► pm-essentials:proto-persona               (persona refinement)
    ├── [context block C] ──► pm-essentials:competitive-research-snapshot (quick comparison)
    ├── [context block C] ──► pm-essentials:competitive-analysis-process  (deep analysis)
    ├── [context block C] ──► pm-essentials:battle-card-builder           (battle card)
    ├── [context block C] ──► pm-essentials:market-landscape-scan         (landscape)
    ├── [context A + B]   ──► pm-essentials:user-story-mapping            (story map)
    └── [context block B] ──► pm-essentials:epic-breakdown-advisor        (story splitting)

aiplab-sprint-planning   ◄── sprint/PI planning, reads live Jira board state directly
feature-to-user-stories  ◄── generic, reusable on any product
arteai-feature-story     ◄── superseded by prototyping-lab-pm
```

pm-skills are installed separately via `/plugin marketplace add deanpeters/Product-Manager-Skills` and are not committed to this repo. `prototyping-lab-pm` delegates to them at runtime.

---

## Workflow

### `genaiplab-ac-audit`

Audits all GENAIPLAB stories to check whether Acceptance Criteria are in the correct field (`customfield_25640`) vs. incorrectly in the description field. Produces a fix list of stories that need remediation.

**Run when:** After a batch story creation session, or to verify AC field compliance across the backlog.

---

## Platform context (quick reference)

**Product:** AI Prototyping Lab — SAP-internal platform for governed, reusable AI prototyping.

**Core concept:** Pattern × Format × Tool

**4-step wizard:** Idea Intake → Pattern & Setup → Test & Preview → Review & Save

**Patterns:** Content Summarization, Data Extraction, Knowledge Q&A, Document Review & Comparison

**Formats:** n8n Workflow, Web Application (Full Project / Standalone HTML / Production-ready IRAD-BTP)

**Personas:**
| Persona | Role | Phase |
|---|---|---|
| AI Business Innovator (No-Code) | Product Managers, Designers, BPEs, Innovation Teams | Active MVP target |
| Citizen AI Developer (Low-Code) | Solution Architects, Consultants | KIV post-MVP |
| Agentic AI Engineer (Pro-Code) | AI Engineers, Technical POs | Coming Soon |

**Jira projects:**
| Project | Purpose |
|---|---|
| `ARTEAI` | Features (issue type ID `11500`) |
| `GENAIPLAB` | User stories (board ID `62344`) |

---

## Reusing these skills on another project

`prototyping-lab-pm` and `arteai-feature-story` are project-specific. To adapt them:

1. Update Jira project keys (`ARTEAI` → your feature project, `GENAIPLAB` → your story project)
2. Update board ID (`62344` → your scrum board)
3. Update custom field IDs (`customfield_25640`, `customfield_29648`, `customfield_48641`)
4. Update component ID (`334205`) and label taxonomy
5. Replace file paths with your local paths
6. Replace the platform context section and context blocks A–D with your product's personas, modules, principles, and stakeholder types
7. Update the competitive adjacencies in context block C

`feature-to-user-stories` is generic and reusable as-is.

---

## Dependencies

These skills rely on:
- **Claude Code** with the `sap-auth` and `sap-jira` MCP servers connected
- **pm-essentials marketplace** — install with `/plugin marketplace add deanpeters/Product-Manager-Skills`
- Local file access to `prd.md`, `features/`, and the 3 product repos (`prototypinglab-ui`, `prototypinglab-builder`, `prototypinglab-mcpserver`)

---

## Keeping skills in sync

After editing any skill or workflow:

```bash
cd "/path/to/AI Prototyping Lab/.claude"
git add skills/ workflows/
git commit -m "description of what changed"
git push
```

`settings.local.json` is excluded by `.gitignore` — it contains machine-specific tool permissions and should never be committed.
