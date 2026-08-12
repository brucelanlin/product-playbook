# pm-cockpit

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║   ██████╗ ███╗   ███╗     ██████╗ ██████╗  ██████╗██╗  ██╗██╗████████╗
║   ██╔══██╗████╗ ████║    ██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██║╚══██╔══╝
║   ██████╔╝██╔████╔██║    ██║     ██║   ██║██║     █████╔╝ ██║   ██║
║   ██╔═══╝ ██║╚██╔╝██║    ██║     ██║   ██║██║     ██╔═██╗ ██║   ██║
║   ██║     ██║ ╚═╝ ██║    ╚██████╗╚██████╔╝╚██████╗██║  ██╗██║   ██║
║   ╚═╝     ╚═╝     ╚═╝     ╚═════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝   ╚═╝
║                                                                    ║
║   Claude Code PM skills for the AI Prototyping Lab                 ║
║   Single entry point · 24 routes · Jira-native · Context-aware    ║
║                                                                    ║
║   Built by Bruce · SAP AI Prototyping Lab · 2026                   ║
╚════════════════════════════════════════════════════════════════════╝
```

A Claude Code PM skill system for product teams using Jira. Built for the AI Prototyping Lab at SAP, but structured so the pattern is reusable on any product.

The core idea: one primary skill acts as a single entry point for all PM work. It identifies the request type, injects your product context, and routes to the right tool. You never have to remember which skill to invoke.

---

## What you can get done

Navigate by what you're trying to accomplish:

**Jira backlog work**
- Create or refine a feature spec → 9-section ARTEAI feature
- Write or refine a user story → GENAIPLAB story with Given/When/Then AC
- Simplify an existing story → fix persona, strip technical detail, INVEST check
- Update the PRD → section-level update grounded in feature registry

**Planning ceremonies**
- Prepare for sprint planning → readiness brief, coverage gaps, dependency flags, sprint goal draft
- PI planning → feature-to-sprint mapping, surface stories not yet written

**Framing and strategy**
- Frame a problem before jumping to solutions → `problem-framing-canvas`
- Write a positioning statement → `positioning-statement`
- Decode a stakeholder request → `incoming-request-advisor`
- Frame an initiative as a testable bet → `epic-hypothesis`
- Turn a vague request into a problem worth solving → `opportunity-solution-tree`

**Discovery and research**
- Plan user interviews → `discovery-interview-prep`
- Mine existing feedback for unmet needs → `voice-of-customer-miner`
- Map what users are trying to accomplish → `jobs-to-be-done`
- Run a full discovery cycle → `discovery-process`
- Validate a hypothesis cheaply → `pol-probe-advisor`

**Stakeholder alignment**
- Identify all stakeholders for an initiative → `stakeholder-identification`
- Map power, interest, and engagement strategy → `stakeholder-mapping`

**Competitive and market intelligence**
- Quick comparison against internal adjacencies → `competitive-research-snapshot`
- Full competitive analysis → `competitive-analysis-process`
- Build a battle card → `battle-card-builder`
- Map the internal tooling landscape → `market-landscape-scan`

**Story and backlog quality**
- Split a large epic → `epic-breakdown-advisor`
- Map a full user journey → `user-story-mapping`

> **Arriving empty-handed? That's fine.** For research, competitive, and strategy routes, you can invoke with just a question or a Jira URL — the context blocks handle the rest. Full pre-flight (auth, registry sync, repo pull) only runs for feature and story creation.

---

## Who this is for

**Using it as-is (AI Prototyping Lab):** Clone, install dependencies, and invoke `prototyping-lab-pm`. Everything is pre-configured for ARTEAI/GENAIPLAB Jira projects, the 4-step wizard platform, and the 3 platform personas.

**Adapting it for your own project:** The routing pattern and skill structure are generic. The product-specific content — Jira field IDs, personas, platform scope, competitive adjacencies — is isolated in clearly marked context blocks. See [Adapting for your project](#adapting-for-your-project).

---

## What's in this repo

| Path | Type | Reusable? | Description |
|---|---|---|---|
| `skills/prototyping-lab-pm/` | Workflow | Adapt | Primary skill — single entry point, 24 routes, platform context blocks |
| `skills/aiplab-sprint-planning/` | Workflow | Adapt | Sprint/PI planning — reads live Jira board state |
| `skills/feature-to-user-stories/` | Component | ✅ Yes | Generic story decomposition, no project-specific content |
| `workflows/genaiplab-ac-audit.js` | Workflow | Adapt | AC field compliance audit — Jira project keys need updating |
| `archive/arteai-feature-story/` | — | Reference | Earlier version of prototyping-lab-pm, superseded |
| `CHANGELOG.md` | — | — | Running log of changes with rationale |

---

## How the system works

```
Your request
    │
    ▼
prototyping-lab-pm          ← single entry point, always invoke this
    │
    ├── Feature / story work    → executes directly (Jira MCP)
    ├── Sprint / PI planning    → aiplab-sprint-planning (Jira MCP)
    └── Everything else         → delegates to a pm-skill with context pre-loaded
                                   (research, competitive, JTBD, OST, splitting...)
```

The key mechanism is **context injection**: when delegating to a pm-skill, the primary skill prepends a context block describing your product, personas, and constraints. The pm-skill skips its generic onboarding questions and works directly with your product context. This is what makes generic pm-skills produce product-specific outputs.

---

## Skills

### `prototyping-lab-pm` — Primary skill ⚑ Adapt for your project

The single entry point. Invoke this for any PM request — it routes internally.

**Full routing table:**

| Request type | Routes to | Output |
|---|---|---|
| Feature creation / refinement | Direct (Jira MCP) | 9-section spec → feature project |
| Story creation / refinement | Direct (Jira MCP) | Given/When/Then stories → story project |
| Sprint / PI planning | `aiplab-sprint-planning` | Readiness brief, goal draft, dependency flags |
| Stakeholder request decoding | `incoming-request-advisor` | Literal ask vs. job-to-be-done |
| Frame initiative as hypothesis | `epic-hypothesis` | Testable if/then bet with validation method |
| Opportunity / problem framing | `opportunity-solution-tree` | OST: outcome → opportunities → solutions → experiments |
| Full discovery cycle | `discovery-process` | Hypothesis to validated opportunity |
| User research planning | `discovery-interview-prep` | Interview plan with methodology |
| Customer voice / feedback mining | `voice-of-customer-miner` | Themed verbatims, unmet needs |
| Jobs to be done | `jobs-to-be-done` | Functional / social / emotional job map |
| Persona refinement | `proto-persona` | Working persona hypothesis |
| Quick competitive comparison | `competitive-research-snapshot` | Cited snapshot, 20–40 min |
| Deep competitive analysis | `competitive-analysis-process` | 6-step full analysis |
| Competitor battle card | `battle-card-builder` | Positioning artifact |
| Market landscape | `market-landscape-scan` | Segments, players, whitespace |
| User story mapping | `user-story-mapping` | Backbone with release slices |
| Story splitting | `epic-breakdown-advisor` | INVEST-validated vertical slices |
| Story refinement | Direct (Jira MCP) | Simplified description + AC, INVEST check, persona fix |
| Problem framing | `problem-framing-canvas` | MITRE Look Inward/Outward/Reframe — use before OST when the problem is unclear |
| Positioning statement | `positioning-statement` | Geoffrey Moore template framed for SAP internal tooling |
| Stakeholder identification | `stakeholder-identification` | Brainstorm → allies/audiences/influencers → priority targets |
| Stakeholder mapping | `stakeholder-mapping` | Power × Interest + Impact × Power grids |
| Validation / proof of life | `pol-probe-advisor` | Recommends cheapest prototype type for the hypothesis |
| PRD refinement | Direct (file write) | Read prd.md + feature registry, propose section update, write on confirmation |

**Context blocks (the product-specific layer):**

| Block | Injects | Used for |
|---|---|---|
| A — Platform & personas | Product description, wizard steps, patterns, formats, 3 personas, PRD principles | Research, discovery, JTBD, personas, OST, hypothesis |
| B — Scope & constraints | SAP-internal only, current phase, wizard structure, module labels, deferred features, Jira routing | Story splitting, story mapping, Jira work |
| C — Competitive framing | Internal adjacencies, decision context, internal adoption framing | All competitive and market work |
| D — Stakeholder context | PO role, stakeholder types, MVP phase constraint, PRD authority | Incoming request decoding |

**Invariant rules (change these if your project differs):**
- Always reads the PRD before generating — PRD overrides user prompts on scope
- Always syncs feature registry from Jira before creating features
- Always pulls latest code from repos before drafting stories
- AC goes exclusively in `customfield_25640` — never in the description field
- Default is read-only draft — never writes to Jira without explicit confirmation

---

### `aiplab-sprint-planning` — Sprint and PI planning ⚑ Adapt for your project

Reads live board state from Jira and produces a planning brief. Handles what `prototyping-lab-pm` can't: reasoning over the board as a whole rather than creating individual items.

**What it checks:**

| Step | Checks |
|---|---|
| Readiness | Missing AC, no parent feature, no priority, no estimate, deferred stories |
| Coverage | Which product modules are over/under-represented in the candidate pool |
| Dependencies | Blocked stories, blocking stories, circular dependencies |
| Sprint goal | Drafts "We deliver X so that [primary persona] can Y" |
| PI mode | Maps stories to future sprints, surfaces features with no stories yet |

**Project-specific content to update when adapting:** board ID, project keys, module labels, sprint goal persona name, deferred feature keys.

---

### `feature-to-user-stories` — Generic story decomposition ✅ Use as-is

Converts any feature description, Jira key, PRD section, or epic into implementation-ready stories. No project-specific content — works on any product.

Produces: Given/When/Then AC, sizing, priority, dependencies, open questions, Jira-ready summary table.

Use this when you want lightweight story decomposition without the full pre-flight (auth, registry sync, repo pull) that `prototyping-lab-pm` runs.

---

### `arteai-feature-story` — Archived, superseded

The original feature and story skill. Predates the routing table, INVEST gate, Humanizing Work splitting patterns, and pm-skill delegation. Moved to `archive/` — use `prototyping-lab-pm` for all active work.

---

### Refining existing stories

One of the most frequent use cases: taking an existing story and simplifying it for the team. Trigger with "simplify this story", "refine this Jira", "apply the same treatment", or just paste a Jira URL.

The skill applies a consistent treatment in 5 steps:
1. **Fetch** the story from Jira
2. **Analyse** — persona, description structure, AC quality, INVEST criteria
3. **Propose** changes to Bruce before touching anything
4. **Apply** description and AC in a single update
5. **INVEST check** on the final state — reported alongside the confirmation

**Story content rules baked in:**
- No `*User Story*` header — redundant given Jira issue type
- No technical decisions, architect notes, or implementation checklists
- Description structure: persona → background → in scope → out of scope → dependencies → assumptions → size
- Plain English in AC — no internal symbol names, variable names, or function calls
- Persona must be a named platform persona, never "a user" or "the platform"
- "So that" must explain motivation, not restate the action

---

### `genaiplab-ac-audit` workflow — ⚑ Adapt for your project

Audits all stories in a Jira project for AC field compliance — checks whether AC is in the correct custom field vs. incorrectly written into the description. Produces a fix list.

Run after batch story creation or to audit backlog compliance. Update the project key and key ranges before using on a different project.

---

## Skill relationships

```
prototyping-lab-pm  ◄──── single entry point (invoke this for all PM work)
    │
    ├── direct ──────────────► feature creation (Jira)
    ├── direct ──────────────► story creation (Jira)
    ├── direct ──────────────► story refinement (Jira)
    ├── direct ──────────────► PRD refinement (prd.md)
    ├── direct ──────────────► aiplab-sprint-planning
    │
    ├── [block D] ───────────► pm-essentials:incoming-request-advisor
    ├── [block A+B] ─────────► pm-essentials:epic-hypothesis
    ├── [block A] ───────────► pm-essentials:opportunity-solution-tree
    ├── [block A] ───────────► pm-essentials:problem-framing-canvas
    ├── [block A] ───────────► pm-essentials:discovery-process
    ├── [block A] ───────────► pm-essentials:discovery-interview-prep
    ├── [block A] ───────────► pm-essentials:voice-of-customer-miner
    ├── [block A] ───────────► pm-essentials:jobs-to-be-done
    ├── [block A+B] ─────────► pm-essentials:proto-persona
    ├── [block A] ───────────► pm-essentials:pol-probe-advisor
    ├── [block C] ───────────► pm-essentials:positioning-statement
    ├── [block C] ───────────► pm-essentials:competitive-research-snapshot
    ├── [block C] ───────────► pm-essentials:competitive-analysis-process
    ├── [block C] ───────────► pm-essentials:battle-card-builder
    ├── [block C] ───────────► pm-essentials:market-landscape-scan
    ├── [block E] ───────────► pm-essentials:stakeholder-identification
    ├── [block E] ───────────► pm-essentials:stakeholder-mapping
    ├── [block A+B] ─────────► pm-essentials:user-story-mapping
    └── [block B] ───────────► pm-essentials:epic-breakdown-advisor

aiplab-sprint-planning   ◄── reads Jira board state, produces planning brief
feature-to-user-stories  ◄── generic, no project-specific content
archive/arteai-feature-story  ◄── superseded, kept for reference
```

pm-skills are installed separately — not committed to this repo. See [Dependencies](#dependencies).

---

## Adapting for your project

### Reusability map

| Skill | What to keep | What to replace |
|---|---|---|
| `prototyping-lab-pm` | Routing table structure, context block mechanism, all delegation logic, invariant rules | Context blocks A–D, Jira field IDs, file paths, repo paths |
| `aiplab-sprint-planning` | All 6 steps, PI planning mode, readiness checks, safety rules | Board ID, project keys, module labels, sprint goal persona, deferred feature keys |
| `feature-to-user-stories` | Everything | Nothing — use as-is |
| `genaiplab-ac-audit.js` | Workflow structure, audit logic | Project key, key ranges |

### Step-by-step: adapting `prototyping-lab-pm`

**1. Jira configuration**

In the feature creation fields section, update:
```json
"project": { "key": "YOUR-FEATURE-PROJECT" }     // was ARTEAI
"issuetype": { "id": "YOUR-FEATURE-ISSUE-TYPE-ID" } // was 11500
"components": [{ "id": "YOUR-COMPONENT-ID" }]     // was 334205
"customfield_29648": [{ "id": "YOUR-PLATFORM-ID" }] // platform field — remove if not applicable
"customfield_48641": [{ "id": "YOUR-DELIVERY-ID" }] // delivery setup — remove if not applicable
```

For stories:
```
projectKey: "YOUR-STORY-PROJECT"    // was GENAIPLAB
boardId: YOUR-BOARD-ID              // was 62344
customfield_25640                   // AC field — verify this ID exists in your project
```

**2. Context block A — Platform & personas**

Replace the product description, wizard/workflow steps, patterns, formats, and personas with your product's equivalents. Keep the same structure — it's what the pm-skills read to skip their onboarding questions.

```
Platform: [Your product name and one-line description]
Core concept: [Your product's core model]
Workflow: [Your key workflow steps, e.g. intake → configure → test → ship]
Target users — [N] personas:
1. [Persona name] — [Roles]. [Phase/status].
...
Product principles: [2-3 governing principles]
```

**3. Context block B — Scope & constraints**

Replace:
- Scope description (SAP-internal → your org/market)
- Current phase
- Workflow structure with your module names and step descriptions
- Module labels (used as Jira labels)
- Any deferred features or hard out-of-scope items

**4. Context block C — Competitive framing**

Replace:
- The 5 named adjacencies with your actual competitors or internal alternatives
- The decision context (roadmap prioritisation within X)
- Scope framing (internal adoption → your actual market/context)
- PRD file path

**5. Context block D — Stakeholder context**

Replace:
- Your role/title
- Your actual stakeholder types
- Current phase and scope governance model

**6. File paths**

Search and replace `C:\Users\I543296\OneDrive - SAP SE\Desktop\AI Prototyping Lab\` with your project root.

**7. Repo paths**

Update the 3 git pull commands in "Before doing anything" with your actual repo paths, or remove if you don't have multiple repos to sync.

### Step-by-step: adapting `aiplab-sprint-planning`

1. Replace `boardId: 62344` with your board ID
2. Replace `project = GENAIPLAB` with your story project key
3. Replace `project = ARTEAI` with your feature project key
4. Replace module labels (`idea-intake`, `pattern-setup`, etc.) with your product's module taxonomy
5. Update the sprint goal template persona ("AI Business Innovator") with your primary persona name
6. Remove or replace the ARTEAI-335 deferred feature reference

### Step-by-step: adapting `genaiplab-ac-audit.js`

1. Replace `GENAIPLAB` with your story project key
2. Update the key ranges in the `ranges` array to match your project's issue key range
3. If your AC field is not `customfield_25640`, update the field name throughout

---

## Dependencies

**Required for all skills:**
- [Claude Code](https://claude.ai/code) — the CLI that runs skills
- A Jira MCP server connected to your Jira instance
  - This repo uses `sap-jira` and `sap-auth` — replace with your own MCP server if using a different Jira setup
  - Any Jira MCP server that exposes `search_issues`, `get_issue`, `create_issue`, `update_issue`, and `get_board_issues` will work

**Required for pm-skill delegation (research, competitive, splitting):**
- pm-essentials marketplace: `/plugin marketplace add deanpeters/Product-Manager-Skills`
- These skills are not committed to this repo — they install to `~/.claude/plugins/marketplaces/pm-skills/`

**Required for `prototyping-lab-pm` specifically:**
- A PRD file at the path specified in context block C
- A features registry folder (`features/SYNC-STATUS.md`)
- Local access to your product repos (for story technical notes)

---

## Quick start

### If you're on the AI Prototyping Lab

```bash
git clone https://github.com/brucelanlin/pm-cockpit.git .claude
# Install pm-skills
/plugin marketplace add deanpeters/Product-Manager-Skills
# Authenticate with Jira
# Then just talk to Claude — prototyping-lab-pm triggers automatically
```

### If you're adapting for your own project

```bash
git clone https://github.com/brucelanlin/pm-cockpit.git .claude
# Follow the adaptation steps above for each skill you want to use
# feature-to-user-stories works immediately with no changes
# Install pm-skills if you want research/competitive delegation
/plugin marketplace add deanpeters/Product-Manager-Skills
```

---

## Keeping skills in sync

After editing any skill or workflow:

```bash
cd /path/to/your/project/.claude
git add skills/ workflows/
git commit -m "describe what changed and why"
git push
```

`settings.local.json` is excluded by `.gitignore` — it contains machine-specific tool permissions and should never be committed.
