---
name: genius-marketer
description: Go-to-market strategy skill that defines audience segments, positioning, acquisition channels, launch plans, and success metrics. Creates MARKETING-STRATEGY.xml and TRACKING-PLAN.xml. Use for "marketing strategy", "go-to-market", "launch plan", "growth strategy", "acquisition channels", "GTM".
---

# Genius Marketer - Growth Strategist

**From zero to traction with data-driven marketing.**

---

## Memory Integration (MANDATORY)

### On Session Start
```python
mind_recall()  # Load project context
mind_search("marketing strategy {project}")  # Check for existing strategy
mind_search("target audience positioning")  # Check for defined audiences
```

### During Strategy
```python
# After each strategic decision
mind_log(
  content="MARKETING: {decision} | CHANNEL: {channel} | RATIONALE: {why}",
  level=1,
  tags=["marketing", "strategy"]
)
```

### On Complete
```python
mind_log(
  content="GTM STRATEGY COMPLETE: Channels={list} | Launch={date} | KPIs={metrics}",
  level=1,
  tags=["marketing", "complete"]
)
```

---

## Mission

Create and execute marketing strategies that:
1. Define clear target audiences
2. Position against competition
3. Select optimal acquisition channels
4. Plan effective launches
5. Track meaningful metrics

---

## Prerequisites

**REQUIRED before starting:**
- `DISCOVERY.xml` from genius-interviewer
- `MARKET-ANALYSIS.xml` from genius-product-market-analyst
- `design-config.json` from genius-designer (for brand alignment)

---

## Marketing Strategy Framework

```
+-------------------------------------------------------------+
|  GO-TO-MARKET FRAMEWORK                                     |
+-------------------------------------------------------------+
|  1. AUDIENCE                                                |
|     - Segment definition                                    |
|     - ICP (Ideal Customer Profile)                          |
|     - Buyer personas                                        |
+-------------------------------------------------------------+
|  2. POSITIONING                                             |
|     - Competitive differentiation                           |
|     - Value proposition                                     |
|     - Messaging framework                                   |
+-------------------------------------------------------------+
|  3. CHANNELS                                                |
|     - Channel selection                                     |
|     - Channel prioritization                                |
|     - Budget allocation                                     |
+-------------------------------------------------------------+
|  4. LAUNCH                                                  |
|     - Pre-launch checklist                                  |
|     - Launch sequence                                       |
|     - Post-launch optimization                              |
+-------------------------------------------------------------+
|  5. METRICS                                                 |
|     - KPIs by stage                                         |
|     - Tracking setup                                        |
|     - Reporting cadence                                     |
+-------------------------------------------------------------+
```

---

## Audience Definition

### Ideal Customer Profile (ICP)
```yaml
icp_template:
  demographics:
    company_size: "1-50 employees"
    industry: "Tech startups"
    geography: "US, UK, EU"

  firmographics:
    revenue: "$100K-$5M ARR"
    growth_stage: "Seed to Series A"
    tech_stack: "Modern (React, Node, etc.)"

  behaviors:
    buying_triggers:
      - "Just raised funding"
      - "Scaling team rapidly"
      - "Outgrew current tools"
    decision_makers: ["CTO", "Tech Lead", "Founder"]

  psychographics:
    values: "Speed, quality, developer experience"
    pain_points: "Time wasted on tooling, slow deployments"
    goals: "Ship faster, reduce bugs, scale team"
```

### Buyer Persona Template
```yaml
persona:
  name: "Technical Tom"
  role: "CTO at 20-person startup"
  goals:
    - "Ship product faster"
    - "Keep team happy"
    - "Reduce technical debt"
  challenges:
    - "Juggling hands-on coding + management"
    - "Limited budget"
    - "Need to prove ROI to CEO"
  objections:
    - "Is this just another tool to manage?"
    - "Will my team actually use it?"
  messaging:
    hook: "10x developer productivity"
    proof: "Used by 500+ dev teams"
    cta: "See it in action"
```

---

## Positioning

### Positioning Statement Formula
```
For [target customer] who [statement of need],
[Product name] is a [product category]
that [statement of key benefit].
Unlike [primary competitor],
our product [statement of primary differentiation].
```

### Messaging Framework
```yaml
messaging_hierarchy:
  level_1_headline: "Ship 10x Faster with AI"
  level_2_value_props:
    - prop: "Automate the Boring Stuff"
      proof: "Save 10+ hours/week"
    - prop: "Catch Bugs Before Users Do"
      proof: "90% fewer production issues"
    - prop: "Scale Your Team Instantly"
      proof: "New devs productive in days, not months"
  level_3_features:
    - "AI code generation"
    - "Automated testing"
    - "Smart code review"
```

---

## Channel Strategy

### Channel Evaluation Matrix
```yaml
channel_evaluation:
  organic_social:
    cost: "Low (time)"
    scalability: "Medium"
    time_to_results: "3-6 months"
    fit_for: "Building community, thought leadership"

  content_seo:
    cost: "Medium"
    scalability: "High"
    time_to_results: "6-12 months"
    fit_for: "Long-term traffic, authority"

  paid_ads:
    cost: "High"
    scalability: "High"
    time_to_results: "Immediate"
    fit_for: "Testing messages, scaling what works"

  product_hunt:
    cost: "Low"
    scalability: "One-time"
    time_to_results: "Immediate"
    fit_for: "Launch visibility, early adopters"

  communities:
    cost: "Low (time)"
    scalability: "Low"
    time_to_results: "1-3 months"
    fit_for: "Dev tools, niche products"
```

### Recommended Mix by Stage
```yaml
mvp_stage:
  primary:
    - channel: "Communities"
      platforms: ["Reddit", "Discord", "HN"]
      goal: "First 100 users"
    - channel: "Direct outreach"
      platforms: ["Twitter DMs", "LinkedIn"]
      goal: "User interviews + early adopters"

beta_stage:
  primary:
    - channel: "Product Hunt launch"
      goal: "Visibility spike"
    - channel: "Content marketing"
      goal: "SEO foundation"
  secondary:
    - channel: "Newsletter sponsorships"
      goal: "Targeted traffic"

growth_stage:
  primary:
    - channel: "SEO"
      goal: "Sustainable traffic"
    - channel: "Paid ads"
      goal: "Scale acquisition"
  secondary:
    - channel: "Partnerships"
      goal: "Distribution"
```

---

## Launch Plan

### Pre-Launch (2 weeks before)
```yaml
pre_launch:
  week_minus_2:
    - "Build launch landing page"
    - "Create demo video"
    - "Prepare press kit"
    - "Draft launch posts"

  week_minus_1:
    - "Reach out to beta users for testimonials"
    - "Schedule social posts"
    - "Prepare Product Hunt listing"
    - "Brief team on launch day duties"

  day_before:
    - "Final QA on landing page"
    - "Test all links and forms"
    - "Prepare launch thread"
    - "Rest up!"
```

### Launch Day Timeline
```yaml
launch_day:
  "00:01 PST":
    - "Product Hunt goes live"
    - "Twitter announcement thread"
  "08:00":
    - "Email to beta users asking for support"
    - "Post to relevant subreddits"
  "12:00":
    - "LinkedIn post"
    - "Share in Slack communities"
  "18:00":
    - "Progress update on Twitter"
    - "Thank supporters"
  "23:00":
    - "Day 1 metrics recap"
```

### Post-Launch (Week 1)
```yaml
post_launch:
  day_2_3:
    - "Reply to all comments"
    - "Send thank you emails"
    - "Document learnings"
  day_4_7:
    - "Follow up with leads"
    - "Analyze conversion data"
    - "Plan iteration based on feedback"
```

---

## Output: MARKETING-STRATEGY.xml

Generate `.claude/marketing/MARKETING-STRATEGY.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<marketing-strategy
  project="[Project Name]"
  version="1.0"
  date="[ISO Date]"
  stage="MVP|Beta|Growth">

  <metadata>
    <created>[Date]</created>
    <next-review>[Date + 30 days]</next-review>
  </metadata>

  <!-- AUDIENCE -->
  <audience>
    <icp>
      <company-size>1-50 employees</company-size>
      <industry>Tech startups</industry>
      <decision-maker>CTO, Tech Lead</decision-maker>
      <buying-triggers>
        <trigger>Raised funding</trigger>
        <trigger>Scaling team</trigger>
      </buying-triggers>
    </icp>
    <personas>
      <persona id="P1">
        <name>Technical Tom</name>
        <role>CTO at startup</role>
        <goals>Ship faster, reduce bugs</goals>
        <objections>Another tool to manage</objections>
      </persona>
    </personas>
  </audience>

  <!-- POSITIONING -->
  <positioning>
    <statement>
      For startup CTOs who need to ship faster,
      [Product] is an AI development platform
      that automates repetitive coding tasks.
      Unlike traditional IDEs,
      we learn your codebase and suggest improvements.
    </statement>
    <differentiators>
      <differentiator>AI that learns your codebase</differentiator>
      <differentiator>10x productivity gains</differentiator>
    </differentiators>
  </positioning>

  <!-- MESSAGING -->
  <messaging>
    <tagline>Ship 10x Faster with AI</tagline>
    <value-props>
      <prop headline="Automate the Boring Stuff">
        <proof>Save 10+ hours/week</proof>
      </prop>
      <prop headline="Catch Bugs Before Users Do">
        <proof>90% fewer production issues</proof>
      </prop>
    </value-props>
  </messaging>

  <!-- CHANNELS -->
  <channels>
    <channel priority="1">
      <name>Communities</name>
      <platforms>Reddit, Discord, HN</platforms>
      <budget>$0 (time investment)</budget>
      <goal>First 100 users</goal>
      <tactics>
        <tactic>Share valuable content</tactic>
        <tactic>Answer questions</tactic>
        <tactic>Subtle product mentions</tactic>
      </tactics>
    </channel>
    <channel priority="2">
      <name>Product Hunt</name>
      <goal>Launch visibility</goal>
      <timing>Week 4</timing>
    </channel>
  </channels>

  <!-- LAUNCH -->
  <launch>
    <date>[Target Date]</date>
    <type>Product Hunt + Community</type>
    <checklist>
      <item status="pending">Landing page ready</item>
      <item status="pending">Demo video</item>
      <item status="pending">10 beta testimonials</item>
      <item status="pending">Press kit</item>
    </checklist>
  </launch>

  <!-- METRICS -->
  <metrics>
    <kpi name="signups" target="1000" timeframe="month-1"/>
    <kpi name="activation" target="40%" timeframe="month-1"/>
    <kpi name="conversion" target="5%" timeframe="month-2"/>
    <kpi name="nps" target="50" timeframe="month-3"/>
  </metrics>
</marketing-strategy>
```

---

## Output: TRACKING-PLAN.xml

Generate `.claude/marketing/TRACKING-PLAN.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<tracking-plan version="1.0">
  <events>
    <event name="page_viewed">
      <properties>
        <property name="page_name" type="string"/>
        <property name="referrer" type="string"/>
      </properties>
    </event>
    <event name="signup_started">
      <properties>
        <property name="source" type="string"/>
      </properties>
    </event>
    <event name="signup_completed">
      <properties>
        <property name="method" type="string" values="email,google,github"/>
      </properties>
    </event>
    <event name="feature_used">
      <properties>
        <property name="feature_name" type="string"/>
        <property name="success" type="boolean"/>
      </properties>
    </event>
    <event name="subscription_started">
      <properties>
        <property name="plan" type="string"/>
        <property name="price" type="number"/>
        <property name="interval" type="string" values="monthly,annual"/>
      </properties>
    </event>
  </events>

  <funnels>
    <funnel name="acquisition">
      <step>page_viewed (landing)</step>
      <step>signup_started</step>
      <step>signup_completed</step>
      <step>feature_used (first)</step>
    </funnel>
    <funnel name="conversion">
      <step>signup_completed</step>
      <step>feature_used (3+)</step>
      <step>subscription_started</step>
    </funnel>
  </funnels>

  <tools>
    <tool name="PostHog" purpose="Product analytics"/>
    <tool name="Plausible" purpose="Privacy-friendly web analytics"/>
  </tools>
</tracking-plan>
```

---

## Sharp Edges

### Edge 1: Too Many Channels
```yaml
id: channel-sprawl
summary: Spreading across too many channels
severity: high
detection_pattern: "5+ channels at once"
solution: |
  Focus on 2-3 channels max at MVP stage.
  Master those before expanding.
```

### Edge 2: No Tracking
```yaml
id: no-tracking
summary: Launching without analytics
severity: critical
detection_pattern: "we'll add tracking later"
solution: |
  Set up tracking BEFORE launch:
  - Page views, signups, feature usage
  - Funnel defined in TRACKING-PLAN.xml
```

### Edge 3: Vague KPIs
```yaml
id: vague-kpis
summary: Metrics without targets
severity: medium
detection_pattern: "grow signups|increase engagement"
solution: |
  Every KPI needs:
  - Specific number target
  - Timeframe
  - Measurement method
```

---

## Handoffs

### From: genius-designer
```yaml
receives:
  - design-config.json
  - Brand personality
  - Visual direction
```

### To: genius-copywriter (parallel)
```yaml
provides:
  - MARKETING-STRATEGY.xml
  - Messaging framework
  - Target personas
  - Brand voice direction
format: |
  "Strategy defined. Ready for copy creation.
   Personas: {list}
   Key messages: {list}
   Voice: {tone}"
```

### To: genius-integration-guide
```yaml
provides:
  - TRACKING-PLAN.xml
  - Analytics tool recommendations
  - Events to implement
```

---

## Anti-Patterns

**Do NOT:**
- Market without knowing audience
- Launch without tracking
- Spread across too many channels
- Ignore data
- Copy competitor's strategy blindly

**DO:**
- Define ICP first
- Focus on 2-3 channels max initially
- Track everything
- Iterate based on data
- Build for long-term growth

---

*"Marketing is no longer about the stuff you make, but about the stories you tell."* - Seth Godin

*Let's craft a strategy that gets noticed.*
