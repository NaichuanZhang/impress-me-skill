# Research Methodology

Detailed guidelines for executing web-based deep research. Read this reference during Phase 2 (Research Execution).

## Source Targets by Depth

| Depth | Search Queries | Sources Read | Sources Cited | Themes |
|-------|---------------|-------------|---------------|--------|
| Quick Overview | 3-4 | 8-10 | 5-8 | 2-3 |
| Standard Research | 5-8 | 15-20 | 10-15 | 3-5 |
| Deep Dive | 8-12 | 25-35 | 15-25 | 5-8 |

## Search Strategy

Execute searches in this order, building on findings from each round:

### Round 1: Broad Initial Search
- Search the topic as stated by the user
- Use 2-3 varied phrasings to capture different angles
- Tools: `mcp__searxng__searxng_web_search`

### Round 2: Refined Searches
- Based on key themes from Round 1, search for specific sub-topics
- Add qualifiers: "recent developments", "data", "statistics", "expert analysis"
- Tools: `mcp__searxng__searxng_web_search`

### Round 3: Deep Reading
- For each quality source found, fetch and read the full content
- Extract: key claims, data points, quotes, methodology, dates
- Tools: `mcp__searxng__web_url_read` or `WebFetch`

### Round 4: Recency Check
- Search with time constraints for the most recent information
- Use query modifiers: "2025", "2026", "latest", "recent"

### Round 5: Counter-Perspective Search
- Search for criticism, limitations, or alternative viewpoints
- Query patterns: "[topic] criticism", "[topic] limitations", "[topic] debate"
- Ensures balanced, credible research

## Source Evaluation Criteria

Rate each source on these dimensions:

| Criterion | High Quality | Low Quality |
|-----------|-------------|------------|
| **Credibility** | Academic journals, government reports, established news, domain experts | Anonymous blogs, content farms, social media posts |
| **Recency** | Published within 2 years (unless historical context) | Outdated data, superseded findings |
| **Specificity** | Contains data, quotes, methodology, specific claims | Vague generalizations, rehashed summaries |
| **Diversity** | Unique perspective not duplicated by other sources | Same information restated from another source |

Aim for credibility distribution:
- High credibility: at least 60% of cited sources
- Medium credibility: up to 30%
- Low credibility: at most 10% (use only for specific claims with caveats)

## Research Compilation

### summary.md Format

```markdown
# {Topic}: Executive Summary

**Research Date:** {YYYY-MM-DD}
**Sources Consulted:** {count}
**Depth:** {Quick Overview | Standard Research | Deep Dive}

## Key Findings
1. {Finding 1 — one clear sentence}
2. {Finding 2 — one clear sentence}
3. {Finding 3 — one clear sentence}
...

## Overview
{2-3 paragraphs summarizing the research landscape. Include the most important
context, current state, and key tensions or debates.}

## Key Statistics
- {Stat 1 with source attribution}
- {Stat 2 with source attribution}
- {Stat 3 with source attribution}
```

### detailed.md Format

```markdown
# {Topic}: Detailed Research

## Theme 1: {Name}

### Background
{2-3 paragraphs of context}

### Key Points
- {Point with evidence}
- {Point with evidence}

### Notable Quotes
> "{Exact quote}" — {Author}, {Source} ({Date})

### Data Points
| Metric | Value | Source |
|--------|-------|--------|
| {metric} | {value} | {source} |

---

## Theme 2: {Name}
{Same structure as above}

---

## Emerging Trends
{Cross-cutting observations across themes}

## Limitations & Caveats
{What the research could not fully address, conflicting claims, data gaps}
```

### sources.md Format

```markdown
# Sources

## Primary Sources (High Credibility)
1. [{Title}]({URL})
   - **Author/Org:** {name}
   - **Date:** {YYYY-MM-DD}
   - **Credibility:** High
   - **Used for:** {What information this source provided}

## Secondary Sources (Medium Credibility)
{Same format}

## Additional Sources
{Same format}

## Sources Consulted but Not Cited
{URLs reviewed but not used, with brief reason why}
```

### raw/ Directory

Save fetched content snippets as `raw/{source-slug}.md` with:
- Source URL at the top
- Relevant excerpts (not full page content)
- Key data points highlighted

## Quality Checklist

Before completing research:
- [ ] Minimum source count met for chosen depth
- [ ] At least 60% high-credibility sources
- [ ] Counter-perspectives included
- [ ] All statistics have source attribution
- [ ] Quotes are exact with proper attribution
- [ ] summary.md, detailed.md, and sources.md all created
- [ ] No duplicate information across themes
- [ ] Key findings are specific and evidence-based (not generic)
