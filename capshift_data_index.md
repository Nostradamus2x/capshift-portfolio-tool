# CapShift Portfolio Dashboard — Data Index & Schema Reference

---

## 1. Schema Field Definitions

| Field | Type | Description |
|---|---|---|
| `id` | Integer | Unique portfolio record identifier |
| `name` | String | Investment or fund name |
| `sector` | String | Primary impact sector (e.g., Affordable Housing, Climate) |
| `fund_type` | String | Specific vehicle type (e.g., CDFI Loan Fund, Climate VC) |
| `capital` | String | Capital committed by the investor/donor |
| `structure` | Enum | Legal/financial structure of the deployment — see §3 |
| `financial_score` | Integer (1–10) | Financial health and return trajectory — see §4 |
| `operational_score` | Integer (1–10) | Team, governance, and execution quality — see §4 |
| `impact_score` | Integer (1–10) | Impact metric achievement vs. stated targets — see §4 |
| `composite_score` | Integer (3–30) | Sum of all three scores; drives status threshold — see §5 |
| `status` | Enum | Portfolio health signal: `green`, `amber`, `red` — see §5 |
| `sdg_primary` | String (list) | UN Sustainable Development Goals this investment addresses |
| `geography` | String | Primary market or region of deployment |
| `vintage_year` | Integer | Year capital was first deployed |
| `stage` | Enum | Investment lifecycle stage: `Early`, `Growth`, `Mature` |
| `investee_type` | Enum | Legal structure of investee: `Nonprofit`, `For-Profit`, `Hybrid` |
| `notes` | String | Current monitoring observations or highlights |

---

## 2. Capital Structure Definitions

### Recoverable Grant
Charitable capital deployed as a grant with the possibility of partial or full return. If the investee fails, the capital reverts to a traditional grant and the organization retains it. If the investee succeeds, returned funds are recycled for future grantmaking. Counted as a charitable distribution — no financial return expected, but return is possible. Common deployers: donor-advised funds (DAFs), foundations.

### PRI (Program-Related Investment)
An investment made by a private foundation primarily to further its charitable purposes, not to produce income. Returns are typically below market rate. PRIs count toward a foundation's mandatory 5% annual distribution requirement. Common forms include low-interest loans, loan guarantees, and equity stakes in mission-aligned entities.

### Private Credit
Market-rate or near-market debt deployed directly to impact enterprises or fund managers. Unlike PRIs, private credit is driven by financial return alongside impact. May appear in family office or institutional portfolios where concessional terms are not required.

---

## 3. Scoring System

All three dimensions are scored on a **1–10 integer scale** by the portfolio monitoring team, based on fund manager reporting, diligence calls, and third-party data where available. Scores are reviewed quarterly.

---

### Financial Health Score (1–10)

Measures the investee's financial trajectory relative to its own projections and the investor's return expectations.

| Score | Meaning |
|---|---|
| **9–10** | Significantly exceeding return targets; strong reserves; no covenant issues |
| **7–8** | On track; sound balance sheet; minor course-corrections may be in progress |
| **5–6** | Slightly below target; monitoring required; manageable and disclosed risks |
| **3–4** | Below target; material financial concerns; active remediation underway |
| **1–2** | Significant financial distress; covenant breach or loss of capital risk |

Key inputs: cash runway, loan repayment rates, revenue vs. budget, reserve ratio, covenant compliance.

---

### Operational Resilience Score (1–10)

Measures the quality of the investee's team, governance structures, and day-to-day execution.

| Score | Meaning |
|---|---|
| **9–10** | Exceptional governance and team depth; strong processes and full transparency |
| **7–8** | Well-run; competent and stable leadership; minor capacity gaps only |
| **5–6** | Meaningful governance gaps or leadership transition risk; capacity support needed |
| **3–4** | Serious structural issues; compliance gaps, unclear succession, or reporting failures |
| **1–2** | Critical operational failure risk; intervention required |

Key inputs: leadership stability, board governance, reporting timeliness, compliance, staff capacity vs. growth plan.

---

### Impact Performance Score (1–10)

Measures achievement of the investee's stated impact objectives and the quality of their impact measurement and management (IMM) practices.

| Score | Meaning |
|---|---|
| **9–10** | Exceeding all impact KPIs; IRIS+ or equivalent aligned; robust IMM practices |
| **7–8** | Meeting key impact metrics; solid data collection; minor gaps in secondary metrics |
| **5–6** | Partial achievement; one or more key metrics lagging; some data quality concerns |
| **3–4** | Impact outcomes unclear; significant underperformance vs. targets; reporting gaps |
| **1–2** | No meaningful impact data; objectives not being met; IMM framework absent |

Key inputs: output vs. target (people served, units built, loans disbursed, tons CO₂ avoided, etc.), data quality, IRIS+ alignment, SDG contribution evidence.

---

## 4. Composite Score & Status Thresholds

The **Composite Score** is the sum of Financial + Operational + Impact scores (max = 30).

### Status Logic

| Status | Rule |
|---|---|
| 🟢 **Green** | Composite ≥ 22 AND no individual score ≤ 5 |
| 🟡 **Amber** | Composite 17–21, OR any single score = 5–6, even if composite is high |
| 🔴 **Red** | Composite ≤ 16, OR any single score ≤ 4 |

> **Note:** A fund can be Amber even with a strong composite if one pillar has a 5–6 score — this ensures single-dimension weaknesses are never hidden by strong averages.

---

## 5. Capital Structures at a Glance

| Structure | Risk to Investor | Expected Return | Typical Deployer | Counts Toward Foundation Payout? |
|---|---|---|---|---|
| Recoverable Grant | Low–Medium | None expected | DAF, Foundation | Yes |
| PRI | Medium | Below-market | Foundation | Yes |
| Private Credit | Medium–High | Market rate | Family Office, Institution | No |
| CDFI Equity | High | Below-market | Foundation, DFI | Yes (if PRI-qualifying) |

---

## 6. Sector Reference

| Sector | Description | Key SDGs |
|---|---|---|
| Financial Inclusion / CDFI | Community development financial institutions serving underbanked populations | SDG 8, 10 |
| Climate / Clean Energy | Renewable energy, decarbonization, and climate mitigation | SDG 7, 13 |
| Affordable Housing | Acquisition, construction, and preservation of below-market housing | SDG 11, 10 |
| Agricultural Finance | Credit and capital for smallholder farmers and agri-supply chains | SDG 2, 8 |
| WASH / Water Access | Water, sanitation, and hygiene infrastructure | SDG 6, 3 |
| Community Health | Primary care, mental health, and preventive services for underserved communities | SDG 3, 10 |
| Education Technology | Platforms and tools expanding access to quality education | SDG 4, 10 |
| Workforce Development | Job training, placement, and skills programs | SDG 8, 10 |
| Financial Inclusion / Fintech | Digital financial services for unbanked and low-income populations | SDG 8, 10 |
| Climate Adaptation | Infrastructure and nature-based solutions to climate resilience | SDG 11, 13 |
| Microfinance (Gender Lens) | Small loans to women entrepreneurs in emerging markets | SDG 5, 8, 10 |

---

## 7. Investment Stage Definitions

| Stage | Description |
|---|---|
| **Early** | Fund or enterprise <2 years post-deployment; team building; limited operating history |
| **Growth** | 2–4 years post-deployment; operations established; scaling impact and financial model |
| **Mature** | 4+ years; proven track record; approaching harvest or renewal decision |

---

## 8. SDG Reference (UN Sustainable Development Goals cited in portfolio)

| SDG | Title |
|---|---|
| SDG 2 | Zero Hunger |
| SDG 3 | Good Health and Well-Being |
| SDG 4 | Quality Education |
| SDG 5 | Gender Equality |
| SDG 6 | Clean Water and Sanitation |
| SDG 7 | Affordable and Clean Energy |
| SDG 8 | Decent Work and Economic Growth |
| SDG 9 | Industry, Innovation and Infrastructure |
| SDG 10 | Reduced Inequalities |
| SDG 11 | Sustainable Cities and Communities |
| SDG 13 | Climate Action |

---

*Data Index v1.0 — CapShift Dashboard Mock Dataset*
