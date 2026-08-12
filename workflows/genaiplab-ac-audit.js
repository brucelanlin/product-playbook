
export const meta = {
  name: 'genaiplab-ac-audit',
  description: 'Audit all GENAIPLAB stories for AC in description field vs customfield_25640',
  phases: [
    { title: 'Fetch stories', detail: 'Get all story keys from GENAIPLAB' },
    { title: 'Audit', detail: 'Check each story for AC in description and customfield_25640' },
    { title: 'Synthesize', detail: 'Produce fix list' },
  ],
}

const ISSUE_SCHEMA = {
  type: 'object',
  properties: {
    key: { type: 'string' },
    summary: { type: 'string' },
    hasACInDescription: { type: 'boolean' },
    hasACInField: { type: 'boolean' },
    acFieldEmpty: { type: 'boolean' },
    descriptionSnippet: { type: 'string' },
    status: { type: 'string' },
  },
  required: ['key', 'summary', 'hasACInDescription', 'hasACInField', 'acFieldEmpty', 'status'],
}

phase('Fetch stories')

// Collect all story keys across pages
const allKeys = []
const ranges = [
  'GENAIPLAB-36 to GENAIPLAB-135',
  'GENAIPLAB-136 to GENAIPLAB-250',
  'GENAIPLAB-251 to GENAIPLAB-394',
]

const keyBatches = await parallel(ranges.map(range => () =>
  agent(`Use the sap-jira MCP tool to search for all Story issues in project GENAIPLAB with keys in the range ${range}. 
Use JQL: project = GENAIPLAB AND issuetype = Story AND key >= "${range.split(' to ')[0]}" AND key <= "${range.split(' to ')[1]}" ORDER BY key ASC
Return just a plain JSON array of issue key strings, e.g. ["GENAIPLAB-36", "GENAIPLAB-37"]. Return up to 100 results.`,
    { label: `fetch-keys:${range}`, phase: 'Fetch stories', schema: { type: 'object', properties: { keys: { type: 'array', items: { type: 'string' } } }, required: ['keys'] } }
  )
))

const allStoryKeys = keyBatches.filter(Boolean).flatMap(b => b.keys)
log(`Found ${allStoryKeys.length} stories to audit`)

phase('Audit')

const results = await pipeline(
  allStoryKeys,
  key => agent(
    `Use the sap-jira MCP get_issue tool to fetch issue ${key} with fields: summary,status,description,customfield_25640.

Then analyse:
1. Does the description field contain an "Acceptance Criteria" section? Look for text like "Acceptance Criteria", "AC:", "Given/When/Then", or a bulleted list of testable conditions that belong in AC. Set hasACInDescription = true if yes.
2. Is customfield_25640 populated (non-null, non-empty array)? Set hasACInField = true if yes, acFieldEmpty = true if null or empty.
3. What is the issue status?
4. If hasACInDescription is true, include a short snippet (max 100 chars) of the AC text found in the description.

Return the result as structured data.`,
    { label: `audit:${key}`, phase: 'Audit', schema: ISSUE_SCHEMA }
  )
)

phase('Synthesize')

const valid = results.filter(Boolean)
const acInDesc = valid.filter(r => r.hasACInDescription)
const noACAnywhere = valid.filter(r => !r.hasACInDescription && r.acFieldEmpty)
const correct = valid.filter(r => !r.hasACInDescription && !r.acFieldEmpty)

log(`Audit complete: ${valid.length} stories checked`)
log(`- AC in description (needs fix): ${acInDesc.length}`)
log(`- No AC anywhere (needs AC added): ${noACAnywhere.length}`)
log(`- Correct (AC only in field): ${correct.length}`)

return {
  acInDescription: acInDesc,
  noACAnywhere: noACAnywhere,
  correct: correct,
  totalChecked: valid.length,
}
