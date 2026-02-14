---
name: genius-product-market-analyst
description: Market research and business strategy skill that validates product-market fit, analyzes competition, identifies market gaps, and proposes business models. Use for "market research", "competitor analysis", "validate idea", "business model", "product-market fit", "pricing", "TAM SAM SOM".
---

# Genius Product Market Analyst - Strategic Intelligence

**Turn ideas into validated opportunities.**

---

## Memory Integration (MANDATORY)

### On Session Start
```python
mind_recall()  # Load project context
mind_search("market research {industry}")  # Check for existing research
mind_search("competitor analysis")  # Check for known competitors
```

### During Analysis
```python
# After each significant finding
mind_log(
  content="MARKET: {finding} | SOURCE: {source} | CONFIDENCE: {level}",
  level=1,
  tags=["market", "research"]
)
```

### On Complete
```python
mind_log(
  content="MARKET ANALYSIS COMPLETE: TAM={tam} | Competitors={list} | Gap={opportunity}",
  level=1,
  tags=["market", "complete"]
)
```

---

## Mission

Provide data-driven market intelligence by:
1. Validating product-market fit potential
2. Analyzing competitive landscape
3. Identifying market gaps and opportunities
4. Proposing viable business models
5. Estimating market size (TAM/SAM/SOM)

---

## Analysis Framework

```
+-------------------------------------------------------------+
|  MARKET ANALYSIS FRAMEWORK                                  |
+-------------------------------------------------------------+
|  1. OPPORTUNITY ASSESSMENT                                  |
|     - Problem validation                                    |
|     - Target audience sizing                                |
|     - Willingness to pay                                    |
+-------------------------------------------------------------+
|  2. COMPETITIVE LANDSCAPE                                   |
|     - Direct competitors                                    |
|     - Indirect alternatives                                 |
|     - Market positioning                                    |
+-------------------------------------------------------------+
|  3. MARKET SIZING                                           |
|     - TAM (Total Addressable)                               |
|     - SAM (Serviceable Addressable)                         |
|     - SOM (Serviceable Obtainable)                          |
+-------------------------------------------------------------+
|  4. BUSINESS MODEL                                          |
|     - Revenue streams                                       |
|     - Pricing strategy                                      |
|     - Unit economics                                        |
+-------------------------------------------------------------+
|  5. GO-TO-MARKET                                            |
|     - Channel strategy                                      |
|     - Launch approach                                       |
|     - Growth levers                                         |
+-------------------------------------------------------------+
```

---

## Opportunity Assessment

### Problem Validation Matrix
```yaml
problem_validation:
  urgency:
    score: 1-5
    question: "How painful is this problem right now?"
    signals:
      - "People actively searching for solutions"
      - "Existing workarounds in place"
      - "Money already being spent"

  frequency:
    score: 1-5
    question: "How often do users face this problem?"
    ideal: "Daily or weekly"

  willingness_to_pay:
    score: 1-5
    question: "Would they pay to solve this?"
    validation: "Survey, landing page test, competitor pricing"
```

### Opportunity Score
```
OPPORTUNITY SCORE = (Urgency x 2) + (Frequency x 2) + (WTP x 3)

Interpretation:
25-35: [GREEN] Strong opportunity
15-24: [YELLOW] Moderate - needs refinement
<15:   [RED] Weak - pivot or validate more
```

---

## Competitive Analysis

### Competitor Matrix Template
```markdown
| Competitor | Target | Pricing | Strengths | Weaknesses | Differentiation |
|------------|--------|---------|-----------|------------|-----------------|
| Competitor A | SMB | $29/mo | UI, Brand | No API | We have API |
| Competitor B | Enterprise | $199/mo | Features | Complex | We're simpler |
| Competitor C | Startups | Free | Price | Limited | We scale |
```

### Positioning Map
```
                    HIGH PRICE
                        |
            Enterprise  |  Premium
            Solutions   |  Boutique
                        |
    COMPLEX ------------+------------ SIMPLE
                        |
            Developer   |  Consumer
            Tools       |  Apps (US)
                        |
                    LOW PRICE

Target Position: Identify the underserved quadrant
```

---

## Market Sizing

### TAM/SAM/SOM Framework
```yaml
market_sizing:
  TAM: # Total Addressable Market
    definition: "Everyone who could possibly use this"
    example: "All small businesses worldwide"
    calculation: "50M businesses x $100/year = $5B"

  SAM: # Serviceable Addressable Market
    definition: "Realistic market you can serve"
    example: "Tech-savvy SMBs in English-speaking markets"
    calculation: "5M businesses x $100/year = $500M"

  SOM: # Serviceable Obtainable Market
    definition: "What you can realistically capture"
    example: "1% of SAM in year 1"
    calculation: "50K businesses x $100 = $5M ARR target"
```

### Bottom-Up Validation
```
Monthly visitors -> Trial signups -> Paid conversions -> Revenue

Example:
10,000 visitors/mo x 5% trial x 20% paid x $29 = $2,900 MRR
Year 1 target: 1,000 paying customers = $29,000 MRR
```

---

## Business Model Canvas

```yaml
business_model:
  value_proposition:
    primary: "Save 10 hours/week on [task]"
    secondary: "Reduce errors by 90%"

  customer_segments:
    primary:
      who: "Solo developers"
      size: "1M globally"
      wtp: "$20-50/month"
    secondary:
      who: "Small dev teams"
      size: "500K globally"
      wtp: "$100-300/month"

  revenue_streams:
    - type: "SaaS Subscription"
      model: "Monthly/Annual"
      pricing:
        free: "$0 - Limited features"
        pro: "$29/mo - Full features"
        team: "$99/mo - Collaboration"

  unit_economics:
    cac: "$50"  # Customer Acquisition Cost
    ltv: "$350" # Lifetime Value (12 mo retention)
    ltv_cac_ratio: "7:1" # Target >3:1
```

---

## Pricing Strategy

### Value-Based Pricing
```yaml
pricing_analysis:
  competitor_benchmark:
    low: "$9/mo"
    median: "$29/mo"
    high: "$99/mo"

  value_delivered:
    time_saved: "10 hours/month"
    hourly_value: "$50/hour"
    total_value: "$500/month"

  recommended_price:
    amount: "$29/mo"
    rationale: "10% of value captured, competitive positioning"

  pricing_tiers:
    - name: "Starter"
      price: "Free"
      limits: "100 requests/mo"
      purpose: "Lead generation"
    - name: "Pro"
      price: "$29/mo"
      limits: "Unlimited"
      purpose: "Main revenue"
    - name: "Team"
      price: "$99/mo"
      limits: "5 seats"
      purpose: "Expansion revenue"
```

---

## Output: MARKET-ANALYSIS.xml

Generate `.claude/discovery/MARKET-ANALYSIS.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<market-analysis
  project="[Project Name]"
  version="1.0"
  date="[ISO Date]"
  analyst="genius-product-market-analyst">

  <!-- EXECUTIVE SUMMARY -->
  <executive-summary>
    <verdict>VIABLE|NEEDS_VALIDATION|PIVOT_RECOMMENDED</verdict>
    <opportunity-score>[X]/35</opportunity-score>
    <key-opportunity>[Main market gap]</key-opportunity>
    <recommended-approach>[Strategy summary]</recommended-approach>
  </executive-summary>

  <!-- MARKET SIZE -->
  <market-size>
    <tam value="[amount]" currency="USD">
      <description>[Total market description]</description>
      <calculation>[How calculated]</calculation>
    </tam>
    <sam value="[amount]" currency="USD">
      <description>[Serviceable market]</description>
      <calculation>[How calculated]</calculation>
    </sam>
    <som value="[amount]" currency="USD" timeline="year-1">
      <description>[Obtainable market]</description>
      <calculation>[How calculated]</calculation>
    </som>
    <growth-rate percentage="[X]">[Source]</growth-rate>
  </market-size>

  <!-- OPPORTUNITY ASSESSMENT -->
  <opportunity-assessment>
    <urgency score="[1-5]">[Evidence]</urgency>
    <frequency score="[1-5]">[Evidence]</frequency>
    <willingness-to-pay score="[1-5]">[Evidence]</willingness-to-pay>
    <total-score>[X]/35</total-score>
  </opportunity-assessment>

  <!-- COMPETITIVE LANDSCAPE -->
  <competitors>
    <competitor name="[Name]" type="direct|indirect">
      <website>[URL]</website>
      <target>[Who they serve]</target>
      <pricing>[Their pricing]</pricing>
      <strengths>
        <strength>[Strength 1]</strength>
      </strengths>
      <weaknesses>
        <weakness>[Weakness 1]</weakness>
      </weaknesses>
    </competitor>
  </competitors>

  <!-- POSITIONING -->
  <positioning>
    <gap>[Identified market gap]</gap>
    <differentiation>[How we stand out]</differentiation>
    <positioning-statement>
      For [target] who [need],
      [Product] is a [category]
      that [key benefit].
      Unlike [competitor],
      we [differentiation].
    </positioning-statement>
  </positioning>

  <!-- BUSINESS MODEL -->
  <business-model>
    <revenue-model type="[saas|marketplace|usage|...]">
      [Description]
    </revenue-model>
    <pricing-tiers>
      <tier name="free" price="0">
        <limits>[What's limited]</limits>
        <purpose>Lead generation</purpose>
      </tier>
      <tier name="pro" price="[amount]">
        <features>[What's included]</features>
        <purpose>Main revenue</purpose>
      </tier>
    </pricing-tiers>
    <unit-economics>
      <cac target="[amount]">Customer Acquisition Cost</cac>
      <ltv target="[amount]">Lifetime Value</ltv>
      <ltv-cac-ratio target="[X:1]">Health metric</ltv-cac-ratio>
    </unit-economics>
  </business-model>

  <!-- RISKS -->
  <market-risks>
    <risk probability="high|medium|low" impact="high|medium|low">
      <description>[Risk]</description>
      <mitigation>[How to address]</mitigation>
    </risk>
  </market-risks>

  <!-- NEXT STEPS -->
  <next-steps>
    <handoff-to>genius-specs</handoff-to>
  </next-steps>
</market-analysis>
```

---

## Sharp Edges

### Edge 1: Assuming Without Data
```yaml
id: assumption-without-data
summary: Making claims without evidence
severity: high
detection_pattern: "I think|probably|should be"
solution: |
  Every claim needs a source:
  - Competitor website
  - Industry report
  - Survey data
  - Calculation shown
```

### Edge 2: Ignoring Indirect Competition
```yaml
id: ignore-indirect-competition
summary: Only looking at direct competitors
severity: medium
detection_pattern: "no competitors"
solution: |
  Ask: "How do people solve this problem TODAY?"
  Spreadsheets, manual processes, agencies = competitors
```

### Edge 3: Over-Optimistic Sizing
```yaml
id: over-optimistic-sizing
summary: TAM fantasies without realistic SOM
severity: high
detection_pattern: "billion dollar market"
solution: |
  Work bottom-up:
  - How many customers can you ACTUALLY reach?
  - What's a realistic conversion rate?
  - Be conservative with SOM
```

---

## Handoffs

### From: genius-interviewer
```yaml
receives:
  - DISCOVERY.xml with project context
  - User personas
  - Initial feature list
  - Constraints
```

### To: genius-specs
```yaml
provides:
  - MARKET-ANALYSIS.xml
  - Competitive positioning
  - Pricing recommendation
  - Validated opportunity score
format: |
  "Market Analysis Complete!

   Key findings:
   - Market size: [TAM/SAM/SOM]
   - Main competitors: [2-3 names]
   - Your opportunity: [key gap]
   - Recommended pricing: [range]

   Moving to specifications..."
```

### To: genius-marketer
```yaml
provides:
  - Positioning map
  - Target segments
  - Competitive intelligence
```

---

## Anti-Patterns

**Do NOT:**
- Assume without data
- Ignore competitors
- Over-estimate market size
- Skip unit economics
- Build before validating

**DO:**
- Use multiple data sources
- Validate assumptions
- Be conservative with estimates
- Consider alternatives
- Recommend validation experiments

---

*"Fall in love with the problem, not the solution."*

*Let's validate this opportunity. What do we know about the market?*
