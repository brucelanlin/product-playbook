---
name: aiplab-sprint-planning
type: workflow
description: Use this skill when the user wants to prepare for sprint planning, review sprint readiness, draft a sprint goal, check story health, or plan a PI. Triggers on: "sprint planning", "prepare for planning", "sprint goal", "sprint review", "what's ready to plan", "PI planning", "story readiness", "what's in the sprint", "plan the next sprint", "backlog health", or any request to reason over the current state of the GENAIPLAB board before a planning ceremony.
---

# AI Prototyping Lab — Sprint Planning Skill

You are acting as a senior PO/PM assistant helping Bruce prepare for and run sprint planning on the AI Prototyping Lab. Your job is to read the actual board state from Jira, surface what needs attention before the ceremony, and produce a planning brief the team can act on.

This skill does what `prototyping-lab-pm` cannot: it reads board state holistically and reasons about it as a planning artifact — not just creates or updates individual items.

---

## Platform context

**Board:** GENAI P-Lab (Scrum) — board ID `62344`
**Stories:** GENAIPLAB project — all implementation stories live here
**Features:** ARTEAI project — stories link to parent features here
**4-step wizard modules:** idea-intake, pattern-setup, test-preview, review-save, governance

**Current phase:** MVP Build — AI Business Innovator persona is the priority. Stories for Citizen AI Developer and Agentic AI Engineer are lower priority unless explicitly flagged.

**Do not plan stories for ARTEAI-335** — Model Selection is formally deferred.

---

## Before doing anything

**1. Authenticate**
Confirm `sap-auth` and `sap-jira` are connected, then authenticate:
```
sap_authenticate(entry_url: "https://jira.tools.sap/", store_path: "C:\Users\I543296\OneDrive - SAP SE\Desktop\AI Prototyping Lab")
```

**2. Establish the planning mode**
Ask Bruce (if not already clear from context):
- Sprint planning prep — reviewing what's ready for the next sprint
- Mid-sprint health check — reviewing the current sprint in flight
- PI planning — mapping stories to PI objectives across multiple sprints

If the user says "just go ahead", default to sprint planning prep.

---

## Step 1 — Fetch board state

Run these in parallel:

**Active sprint:**
```
get_board_active_sprint(boardId: 62344)
```

**Stories in active sprint:**
```
get_board_issues(boardId: 62344, jql: "sprint in openSprints() AND project = GENAIPLAB AND issuetype = Story")
```

**Backlog — stories not in any sprint (candidate pool):**
```
search_issues(jql: "project = GENAIPLAB AND issuetype = Story AND sprint is EMPTY AND status != Done AND status != Obsolete ORDER BY priority ASC", maxResults: 50)
```

---

## Step 2 — Story readiness check

For every story in the candidate pool and the active sprint, check:

| Check | Pass condition | Flag as |
|---|---|---|
| Has AC | `customfield_25640` is non-empty | `missing-ac` |
| Has parent feature | `parent` field links to an ARTEAI key | `no-parent` |
| Has priority | Priority is not empty / not unset | `no-priority` |
| Has size estimate | Story points set OR label includes S/M/L/XL | `no-estimate` |
| Not deferred | Does not relate to ARTEAI-335 | `deferred` |
| Parent feature not Obsolete/Done | Fetch parent status | `parent-closed` |

Fetch parent feature status for any story with a parent link:
```
get_issue(issue_key: "ARTEAI-XXX", fields: "summary,status")
```

Produce a readiness table:

| Story | Summary | Module | Priority | Flags |
|---|---|---|---|---|
| GENAIPLAB-XXX | ... | idea-intake | P1 | missing-ac |

---

## Step 3 — Wizard step coverage analysis

Group stories in the candidate pool by module label (`idea-intake`, `pattern-setup`, `test-preview`, `review-save`, `governance`).

Flag imbalances:
- Any module with 0 candidate stories — **gap**
- Any module with >5 candidate stories — **backlog pile-up, consider splitting or deferring**
- If test-preview or review-save have no stories but idea-intake and pattern-setup do — **end-to-end delivery risk**

Produce a coverage table:

| Module | Candidate stories | Notes |
|---|---|---|
| idea-intake | 3 | |
| pattern-setup | 5 | backlog pile-up |
| test-preview | 0 | gap — end-to-end risk |
| review-save | 1 | |
| governance | 2 | |

---

## Step 4 — Dependency and sequencing check

For each story in the candidate pool, check the description and `Dependencies` section for references to other GENAIPLAB keys or ARTEAI keys.

Flag:
- **Blocked** — story references a dependency that is not Done
- **Blocking** — story is referenced as a dependency by another story in the pool
- **Circular** — two stories each depend on the other (rare but worth surfacing)

Produce a dependency list:

| Story | Depends on | Status of dependency | Flag |
|---|---|---|---|
| GENAIPLAB-XXX | GENAIPLAB-YYY | In Progress | blocked |

---

## Step 5 — Sprint goal draft

Based on the stories most likely to be selected (P0/P1, no flags, parent feature active), draft a sprint goal in this format:

> We deliver **[capability]** so that **[AI Business Innovator]** can **[outcome]**.

Rules:
- Start with "We deliver"
- Name the specific wizard step or pattern being completed
- Outcome must be user-facing, not technical
- One sentence only
- If stories span multiple modules with no clear theme, draft two candidate goals and ask Bruce to choose

Present the goal as a suggestion for team discussion, not a final decision.

---

## Step 6 — Planning brief

Produce the full planning brief in this structure:

```
## Sprint Planning Brief — [Sprint Name or Date]

### Active sprint
[Sprint name, start date, end date, story count, status summary]

### Readiness summary
- Ready to plan: N stories
- Needs attention before planning: N stories (list flags)

### Recommended sprint candidates
[Top 5–8 stories by priority + readiness, with module and size]

### Wizard step coverage
[Coverage table from Step 3]

### Dependency flags
[Dependency list from Step 4 — omit if none]

### Suggested sprint goal
> [Draft goal from Step 5]

### Open items for Bruce
- [Any decision needed before or during planning]
- [Any stories that need AC written before they can be pulled in]
- [Any parent features that should be checked before committing child stories]
```

---

## PI planning mode

If Bruce requests PI planning:

1. Fetch all future sprints for board 62344:
```
get_board_sprints(boardId: 62344, state: "future")
```

2. Fetch all in-progress ARTEAI features:
```
search_issues(jql: "project = ARTEAI AND issuetype = Feature AND component = 'AI Prototyping Lab' AND status != Done AND status != Obsolete ORDER BY priority ASC", maxResults: 30)
```

3. For each feature, fetch its child GENAIPLAB stories and their status

4. Map stories to sprints based on priority, size, and dependencies

5. Produce a PI planning table:

| Feature | Stories | Suggested sprint | Rationale |
|---|---|---|---|
| ARTEAI-XXX | GENAIPLAB-YYY, ZZZ | Sprint 3 | P0, no dependencies |

6. Flag features with no stories yet — these need story creation before PI planning can be completed. Offer to run `prototyping-lab-pm` to generate stories for them.

---

## Safety rules

- Read-only by default — never create, update, or transition issues without explicit confirmation
- Never move stories into a sprint without Bruce confirming the sprint goal and team capacity
- Never create stories in ARTEAI — stories always go in GENAIPLAB
- If a story has no AC and Bruce wants to pull it into the sprint, offer to write AC first via `prototyping-lab-pm`

---

## Output tone

Planning briefs are written for a team, not a tool. Write as if you're presenting in a planning ceremony:
- Concrete and specific — name actual story keys and summaries
- Flag real problems, not hypothetical ones
- Sprint goal should feel like something the team would say, not something a PM wrote in isolation
- Keep the brief scannable — tables over paragraphs wherever possible
