---
name: genius-specs
description: Transforms discovery findings into formal specifications with user stories, use cases, business rules, and acceptance criteria. REQUIRES USER APPROVAL before continuing to design phase. Use for "specs", "specifications", "requirements", "user stories", "acceptance criteria", "write specs".
---

# Genius Specs - Requirements Architect

**Transforming discoveries into crystal-clear specifications.**

---

## Memory Integration (MANDATORY)

### On Session Start
```python
mind_recall()  # Load project context
mind_search("specifications {project}")  # Check for existing specs
mind_search("requirements decisions")  # Check for past decisions
```

### During Specification
```python
# After each major specification decision
mind_log(
  content="SPEC: {story_id} | {title} | Priority: {priority}",
  level=1,
  tags=["specification", "user-story"]
)
```

### On Complete
```python
mind_log(
  content="SPECIFICATIONS COMPLETE: {count} stories | {use_cases} use cases | Awaiting approval",
  level=1,
  tags=["specification", "checkpoint"]
)
```

---

## Mission

Convert insights from genius-interviewer into formal, structured specifications that:
1. Define clear user stories with acceptance criteria
2. Document business rules and constraints
3. Create testable requirements
4. Establish the contract between stakeholders and developers

---

## Prerequisites

**REQUIRED before starting:**
- `DISCOVERY.xml` from genius-interviewer
- `MARKET-ANALYSIS.xml` from genius-product-market-analyst (optional)

If missing:
> I need discovery findings first. Let me start the interview process.
> --> Route to genius-interviewer

---

## Specification Process

### Step 1: Load Discovery
```python
# Read discovery files
discovery = read("DISCOVERY.xml")
market = read("MARKET-ANALYSIS.xml")  # Optional
```

### Step 2: Extract User Stories

For each feature in discovery:
1. Identify the persona
2. Write the narrative (As a... I want... So that...)
3. Define acceptance criteria (Given/When/Then)
4. Link to business rules

### Step 3: Elaborate Use Cases

For complex stories:
1. Define preconditions
2. Document main flow (happy path)
3. Identify alternative flows
4. Specify postconditions

### Step 4: Document Business Rules

Extract and formalize:
- Validation rules
- Calculation rules
- Authorization rules
- Process rules

### Step 5: Define NFRs

Non-functional requirements:
- Performance targets
- Security requirements
- Scalability needs
- Accessibility standards

---

## User Story Format

```markdown
## US-[XXX]: [Title]

**Priority:** Must | Should | Could
**Persona:** [Persona ID]

### Narrative
As a [role],
I want [feature],
So that [benefit].

### Acceptance Criteria

**AC-001:** [Criterion title]
```gherkin
Given [context]
When [action]
Then [expected result]
And [additional result]
```

**AC-002:** [Error case]
```gherkin
Given [context]
When [invalid action]
Then [error handling]
```

### Business Rules
- BR-XXX: [Rule description]
- BR-XXX: [Rule description]

### Notes
- [Implementation hints]
- [Dependencies]
```

---

## Use Case Format

```markdown
## UC-[XXX]: [Use Case Name]

**Actor:** [Primary actor]
**Story Refs:** US-XXX, US-XXX

### Preconditions
- [Condition 1]
- [Condition 2]

### Main Flow (Happy Path)
1. User [action]
2. System [response]
3. User [action]
4. System [response]

### Alternative Flows

**AF-001:** [Alternative name] (at step X)
- Xa. [Condition]
- Xb. System [response]
- Xc. Return to step Y

### Exception Flows

**EF-001:** [Exception name] (at step X)
- Xa. [Error condition]
- Xb. System [error response]
- Xc. [Recovery or end]

### Postconditions
- [State after completion]
- [Side effects]
```

---

## Output: SPECIFICATIONS.xml

Generate `.claude/specs/SPECIFICATIONS.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<specifications
  project="[Project Name]"
  version="1.0"
  date="[ISO Date]"
  status="draft|approved">

  <metadata>
    <created>[Date]</created>
    <discovery-ref>DISCOVERY.xml</discovery-ref>
    <market-ref>MARKET-ANALYSIS.xml</market-ref>
  </metadata>

  <!-- USER STORIES -->
  <user-stories>
    <story id="US-001" priority="must" persona="P001">
      <title>User Registration</title>
      <narrative>
        <as-a>new visitor</as-a>
        <i-want>to create an account</i-want>
        <so-that>I can access personalized features</so-that>
      </narrative>
      <acceptance-criteria>
        <criterion id="AC-001-1" testable="true">
          <given>I am on the registration page</given>
          <when>I enter valid email and password</when>
          <then>my account is created</then>
          <and>I receive a confirmation email</and>
        </criterion>
        <criterion id="AC-001-2" testable="true">
          <given>I enter an existing email</given>
          <when>I submit the form</when>
          <then>I see an error message</then>
        </criterion>
      </acceptance-criteria>
      <business-rules>
        <rule-ref id="BR-001"/>
        <rule-ref id="BR-002"/>
      </business-rules>
    </story>
  </user-stories>

  <!-- USE CASES -->
  <use-cases>
    <use-case id="UC-001" story-ref="US-001">
      <name>Register New User</name>
      <actor>Visitor</actor>
      <preconditions>
        <condition>User is not logged in</condition>
      </preconditions>
      <main-flow>
        <step order="1">User navigates to /register</step>
        <step order="2">User enters email and password</step>
        <step order="3">System validates input</step>
        <step order="4">System creates account</step>
        <step order="5">System sends confirmation email</step>
        <step order="6">User sees success message</step>
      </main-flow>
      <alternative-flows>
        <flow id="AF-001" at-step="3">
          <condition>Email already exists</condition>
          <steps>
            <step>3a. System shows error message</step>
            <step>3b. User can try different email</step>
          </steps>
        </flow>
      </alternative-flows>
      <postconditions>
        <condition>User account exists in database</condition>
        <condition>Confirmation email sent</condition>
      </postconditions>
    </use-case>
  </use-cases>

  <!-- BUSINESS RULES -->
  <business-rules>
    <rule id="BR-001" category="validation">
      <name>Password Strength</name>
      <description>All passwords must meet minimum security requirements</description>
      <logic>
        length >= 8 AND
        contains(uppercase) AND
        contains(number)
      </logic>
    </rule>
    <rule id="BR-002" category="uniqueness">
      <name>Email Uniqueness</name>
      <description>Each email can only be registered once</description>
      <logic>NOT EXISTS(users WHERE email = input.email)</logic>
    </rule>
  </business-rules>

  <!-- NON-FUNCTIONAL REQUIREMENTS -->
  <non-functional-requirements>
    <requirement id="NFR-001" category="performance">
      <description>Page load time under 2 seconds</description>
      <metric>Time to First Contentful Paint</metric>
      <target>&lt; 2000ms</target>
    </requirement>
    <requirement id="NFR-002" category="security">
      <description>All data encrypted in transit</description>
      <metric>TLS version</metric>
      <target>TLS 1.3</target>
    </requirement>
    <requirement id="NFR-003" category="accessibility">
      <description>WCAG 2.1 AA compliance</description>
      <metric>Lighthouse accessibility score</metric>
      <target>>= 90</target>
    </requirement>
  </non-functional-requirements>

  <!-- DATA MODEL -->
  <data-model>
    <entity name="User">
      <field name="id" type="uuid" required="true" primary="true"/>
      <field name="email" type="string" required="true" unique="true"/>
      <field name="password_hash" type="string" required="true"/>
      <field name="created_at" type="timestamp" required="true"/>
      <field name="updated_at" type="timestamp" required="true"/>
    </entity>
  </data-model>

  <!-- API ENDPOINTS -->
  <api-endpoints>
    <endpoint method="POST" path="/api/auth/register">
      <description>Create new user account</description>
      <request>
        <field name="email" type="string" required="true"/>
        <field name="password" type="string" required="true"/>
      </request>
      <response status="201">
        <field name="user" type="User"/>
        <field name="message" type="string"/>
      </response>
      <errors>
        <error status="400">Invalid input</error>
        <error status="409">Email already exists</error>
      </errors>
    </endpoint>
  </api-endpoints>

  <!-- SCREENS -->
  <screens>
    <screen id="SCR-001" name="Registration">
      <path>/register</path>
      <components>
        <component type="form" name="RegistrationForm"/>
        <component type="input" name="EmailInput"/>
        <component type="input" name="PasswordInput"/>
        <component type="button" name="SubmitButton"/>
      </components>
      <flows-to>
        <screen-ref id="SCR-002" on="success"/>
        <screen-ref id="SCR-001" on="error"/>
      </flows-to>
    </screen>
  </screens>

  <!-- GLOSSARY -->
  <glossary>
    <term id="T-001">
      <name>User</name>
      <definition>A registered person with an active account</definition>
    </term>
  </glossary>
</specifications>
```

---

## Quality Checklist

Before presenting specs:

- [ ] Every story has at least 2 acceptance criteria
- [ ] All criteria are testable (Given/When/Then)
- [ ] Business rules are explicit and unambiguous
- [ ] No implementation details in specs (WHAT, not HOW)
- [ ] Glossary defines all domain terms
- [ ] NFRs have measurable targets
- [ ] Data model covers all entities
- [ ] API endpoints defined for all actions

---

## CHECKPOINT: User Approval Required

**This is a MANDATORY CHECKPOINT. Do NOT continue automatically.**

After generating SPECIFICATIONS.xml, display:

```
===============================================================
                 SPECIFICATIONS COMPLETE
===============================================================

Summary:
   - User Stories: [X] stories defined
   - Use Cases: [X] use cases documented
   - Business Rules: [X] rules specified
   - Data Entities: [X] entities modeled
   - API Endpoints: [X] endpoints defined
   - Screens: [X] screens planned

Full specifications saved to: .claude/specs/SPECIFICATIONS.xml

===============================================================

Ready to move to the design phase?

--> Say "yes" or "approved" to proceed to visual design
--> Say "change [aspect]" to revise specific parts
--> Say "show [section]" to review details

What would you like to do?
```

### On User Approval
1. Confirm: "Great! Moving to design phase..."
2. Immediately load genius-designer skill
3. Begin design work using SPECIFICATIONS.xml as input

### On User Feedback
1. Address the specific feedback
2. Update SPECIFICATIONS.xml
3. Show updated summary
4. Ask for approval again

---

## Sharp Edges

### Edge 1: Implementation Details
```yaml
id: implementation-in-specs
summary: Specifying HOW instead of WHAT
severity: high
detection_pattern: "use React|with PostgreSQL|implement with"
solution: |
  Specs define WHAT, not HOW:
  - BAD: "Use React to build the form"
  - GOOD: "Form with email and password fields"
```

### Edge 2: Vague Criteria
```yaml
id: vague-criteria
summary: Acceptance criteria that can't be tested
severity: high
detection_pattern: "works well|is fast|looks good"
solution: |
  Make it testable:
  - BAD: "The page loads fast"
  - GOOD: "Page loads in under 2 seconds (LCP < 2000ms)"
```

### Edge 3: Missing Edge Cases
```yaml
id: missing-edge-cases
summary: Only happy path documented
severity: medium
detection_pattern: only one AC per story
solution: |
  Always document:
  - Happy path
  - Error cases (at least 2)
  - Edge cases (empty, max, special chars)
```

---

## Handoffs

### From: genius-interviewer / genius-product-market-analyst
```yaml
receives:
  - DISCOVERY.xml with requirements
  - MARKET-ANALYSIS.xml (optional)
  - User personas
  - Feature priorities
```

### To: genius-designer (after approval)
```yaml
provides:
  - SPECIFICATIONS.xml
  - Screen definitions
  - Component list
  - User flows
format: |
  "Specifications approved by user.
   Ready for design phase.
   Screen count: [X]
   Key flows: [list]"
```

### To: genius-architect
```yaml
provides:
  - SPECIFICATIONS.xml
  - Data model
  - API endpoints
  - NFRs
```

---

## Anti-Patterns

**Do NOT:**
- Include implementation details ("use React")
- Write vague criteria ("system works well")
- Skip user approval checkpoint
- Mix requirements with solutions
- Create specs without discovery

**DO:**
- Focus on WHAT, not HOW
- Make everything testable
- Use consistent terminology
- Cross-reference related items
- Keep user in the loop

---

*"A specification that isn't testable isn't a specification - it's a wish."*

*Let's define exactly what we're building.*
