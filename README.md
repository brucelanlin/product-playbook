# product-playbook

Claude Code skills and workflows for the AI Prototyping Lab — a SAP-internal platform for governed, reusable AI prototyping. This repo is the PO/PM's working toolkit: everything needed to go from a product idea to a Jira-ready feature spec or story set, with platform context and governance rules built in.

---

## What's in this repo

```
skills/
  prototyping-lab-pm/       # Primary skill — all PM work enters here
  arteai-feature-story/     # Earlier feature+story skill (superseded by prototyping-lab-pm)
  feature-to-user-stories/  # Generic story decomposition skill
workflows/
  genaiplab-ac-audit.js     # Workflow: audit AC field compliance across GENAIPLAB stories
```

---

## Skills

### `prototyping-lab-pm` — Primary skill

**The single entry point for all product work on the AI Prototyping Lab.** Invoke this skill whenever you need to create or refine a feature, write or split stories, do user research, or run competitive analysis. It routes the request to the right workflow and pre-loads platform context so outputs are always grounded in the PRD, the 3 personas, and the platform scope.

**Triggers:** "create a feature", "write a story", "ARTEAI", "GENAIPLAB", "backlog", "AC for", "sprint planning", "compare to Joule", "what do users say", "interview", "JTBD", and more.

**What it produces:**

| Request type | Output | Destination |
|---|---|---|
| Feature creation | 9-section spec in Jira Wiki Markup | ARTEAI project, issue type Feature |
| Story creation | Given/When/Then AC stories | GENAIPLAB project, board 62344 |
| User research planning | Interview plan with question framework | Draft (no Jira) |
| Customer voice mining | Themed verbatims and unmet needs | Draft, feeds feature problem statement |
| Jobs to be done | Functional/social/emotional job map | Draft, feeds feature personas section |
| Competitive analysis | Landscape framed against SAP internal adjacencies | Draft, feeds PRD |
| Story splitting | INVEST-validated story set with sequencing | Draft or GENAIPLAB |

**Key rules baked in:**
- Always reads the PRD before generating anything — PRD overrides user prompts on scope
- Always syncs the feature registry from Jira before creating new features
- Always pulls latest code from the 3 repos before drafting stories
- Features go in ARTEAI; stories always go in GENAIPLAB
- AC goes exclusively in `customfield_25640` (Okapya checklist format) — never in the description field
- Default mode is read-only draft — never writes to Jira without explicit confirmation

---

### `feature-to-user-stories` — Generic story decomposition

A general-purpose skill for converting any feature description, Jira Feature key, PRD section, or epic into implementation-ready user stories. Not AI Prototyping Lab-specific — works for any product context.

**Use this when:**
- You're working outside the AI Prototyping Lab context
- You want a lightweight story decomposition without the full prototyping-lab-pm pre-flight (auth, registry sync, git pulls)
- You need a quick draft from a pasted feature description

**Does not include:** Jira field validation, feature registry sync, codebase cross-reference, or the platform-specific routing table. For AI Prototyping Lab work, use `prototyping-lab-pm` instead — it's a superset.

**Produces:** Full story set with Given/When/Then AC, sizing, priority, dependencies, open questions, and a Jira-ready summary table.

---

### `arteai-feature-story` — Earlier generation (superseded)

The original feature and story skill for the AI Prototyping Lab. Covers the same core workflow as `prototyping-lab-pm` but predates: the feature registry sync, the 3-repo git pull requirement, the request routing table, the INVEST gate, the Humanizing Work splitting patterns, and the research/competitive delegation to pm-skills.

**Status:** Kept for reference and backwards compatibility. For all active work, use `prototyping-lab-pm`.

---

## Skill relationships

```
prototyping-lab-pm  ◄──── primary entry point for all AI Prototyping Lab PM work
    │
    ├── executes directly ──► feature creation (ARTEAI)
    ├── executes directly ──► story creation (GENAIPLAB, board 62344)
    ├── delegates ──────────► pm-essentials:discovery-interview-prep   (research)
    ├── delegates ──────────► pm-essentials:voice-of-customer-miner    (VOC)
    ├── delegates ──────────► pm-essentials:jobs-to-be-done            (JTBD)
    ├── delegates ──────────► pm-essentials:proto-persona              (personas)
    ├── delegates ──────────► pm-essentials:competitive-analysis-process
    ├── delegates ──────────► pm-essentials:market-landscape-scan
    └── delegates ──────────► pm-essentials:epic-breakdown-advisor     (splitting)

feature-to-user-stories  ◄── generic, non-project-specific story decomposition
arteai-feature-story     ◄── superseded by prototyping-lab-pm
```

When `prototyping-lab-pm` delegates to a pm-skill, it injects platform context (personas, PRD principles, adjacencies) so outputs are grounded in the actual product — not generic PM frameworks.

---

## Workflow

### `genaiplab-ac-audit`

Audits all GENAIPLAB stories to check whether Acceptance Criteria are in the correct field (`customfield_25640`) vs. incorrectly in the description. Produces a fix list of stories that need remediation.

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
6. Replace the platform context section with your product's personas, modules, and principles
7. Update the competitive adjacencies in context block C

`feature-to-user-stories` is generic and reusable as-is.

---

## Dependencies

These skills rely on:
- **Claude Code** with the `sap-auth` and `sap-jira` MCP servers connected
- **pm-essentials marketplace** (`/plugin marketplace add deanpeters/Product-Manager-Skills`) for research and competitive delegation
- Local file access to `prd.md`, `features/`, and the 3 product repos

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
