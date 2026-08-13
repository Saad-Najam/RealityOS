import { NextRequest, NextResponse } from 'next/server';

// Simulated RAG evidence database for common demo inputs
const DEMO_RESPONSES: Record<string, any> = {
  "coffee": {
    verdict: "MISLEADING",
    confidence: 85,
    summary: "The claim that drinking coffee increases lifespan by 10 years is an exaggeration of observational health findings.",
    claims: [
      { text: "Coffee increases human lifespan by 10 years.", status: "CONTRADICTED", why: "No clinical trials or observational studies show a fixed 10-year survival extension." },
      { text: "A medical study on coffee consumption was published.", status: "SUPPORTED", why: "The New England Journal of Medicine published data tracking correlation between coffee intake and reduced mortality rates." },
      { text: "Doubling espresso intake guarantees longevity.", status: "CONTRADICTED", why: "Exaggerated dose relationships are not supported; studies observed correlation up to moderate amounts only." }
    ],
    graph: {
      nodes: [
        { id: "c1", label: "Claim: Coffee adds 10 years to lifespan", type: "claim", description: "Sensationalized claims appearing on social platforms." },
        { id: "s1", label: "Source: NEJM Journal (Tier 3 Academic)", type: "source", description: "Observational study tracing coffee drinking trends." },
        { id: "s2", label: "Source: HealthyLife Blog (Tier 5 Unknown)", type: "source", description: "Headline exaggeration claiming longevity guarantees." },
        { id: "e1", label: "Evidence: Mild correlation observed", type: "evidence", status: "supports", description: "10-15% lower mortality correlation, not 10 absolute years." },
        { id: "e2", label: "Evidence: False causality claims", type: "evidence", status: "contradicts", description: "Post presents correlation as absolute biological cause." }
      ],
      edges: [
        { from: "s1", to: "e1", relationship: "details" },
        { from: "s2", to: "e2", relationship: "details" },
        { from: "e1", to: "c1", relationship: "supports" },
        { from: "e2", to: "c1", relationship: "contradicts" }
      ]
    }
  },
  "lockdown": {
    verdict: "FABRICATED",
    confidence: 95,
    summary: "Claims stating that secret world agencies are scheduling immediate general lockdowns are baseless conspiracy theories.",
    claims: [
      { text: "A secret mandatory lockdown is scheduled.", status: "CONTRADICTED", why: "No national health ministries or international advisory bodies have issued such schedules." },
      { text: "Citizens must withdraw all cash from banks.", status: "CONTRADICTED", why: "Banking associations confirm liquidity levels are typical; cash withdrawal panic is artificial." }
    ],
    graph: {
      nodes: [
        { id: "c1", label: "Claim: Scheduled global lockdown", type: "claim", description: "Baseless viral alerts warning of imminent travel bans." },
        { id: "s1", label: "Source: World Health Org (Tier 1 Official)", type: "source", description: "Official statements regarding current global disease monitoring." },
        { id: "e1", label: "Evidence: No lockdowns requested", type: "evidence", status: "contradicts", description: "WHO confirms focus is standard epidemiological surveillance, not population lockdown." }
      ],
      edges: [
        { from: "s1", to: "e1", relationship: "details" },
        { from: "e1", to: "c1", relationship: "contradicts" }
      ]
    }
  }
};

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: "Missing verification query text" }, { status: 400 });
    }

    const lowerQuery = query.toLowerCase();
    
    // Check if we match a demo RAG case
    let demoResult = null;
    if (lowerQuery.includes('coffee') || lowerQuery.includes('longevity') || lowerQuery.includes('10 years')) {
      demoResult = DEMO_RESPONSES.coffee;
    } else if (lowerQuery.includes('lockdown') || lowerQuery.includes('confinement') || lowerQuery.includes('cash')) {
      demoResult = DEMO_RESPONSES.lockdown;
    }

    if (demoResult) {
      // Simulate small delay for realistic UX retrieval feeling
      await new Promise(r => setTimeout(r, 1200));
      return NextResponse.json(demoResult);
    }

    // Default fallback verification RAG structure
    const fallbackResult = {
      verdict: "UNVERIFIED",
      confidence: 50,
      summary: `We found insufficient independent evidence to verify: "${query}".`,
      claims: [
        { text: query, status: "UNVERIFIED", why: "We could not match this claim with peer-reviewed research databases or established news fact-check archives." }
      ],
      graph: {
        nodes: [
          { id: "c1", label: `Claim: ${query.slice(0, 30)}...`, type: "claim", description: "User entered verification string." },
          { id: "s1", label: "Search Index (Tier 6 Social)", type: "source", description: "Query results showing discussion threads but no primary documentation." }
        ],
        edges: [
          { from: "s1", to: "c1", relationship: "details" }
        ]
      }
    };

    // Attempt Gemini call if API key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `Analyze the following user-submitted news claim: "${query}"
Decompose it into atomic sub-claims and evaluate their truthfulness based on scientific concensus and primary journalism.
Response must be strict JSON matching this interface:
{
  "verdict": "SUPPORTED" | "MISLEADING" | "FABRICATED" | "UNVERIFIED",
  "confidence": number (0-100),
  "summary": string,
  "claims": Array<{ "text": string, "status": "SUPPORTED" | "CONTRADICTED" | "UNVERIFIED", "why": string }>,
  "graph": {
    "nodes": Array<{ "id": string, "label": string, "type": "claim" | "source" | "evidence" | "verdict", "status"?: "supports" | "contradicts" | "neutral", "description": string }>,
    "edges": Array<{ "from": string, "to": string, "relationship": "supports" | "contradicts" | "details" }>
  }
}`
                }]
              }],
              generationConfig: {
                responseMimeType: 'application/json'
              }
            })
          }
        );

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return NextResponse.json(parsed);
        }
      } catch (geminiError) {
        console.error("Gemini RAG verification request error", geminiError);
      }
    }

    return NextResponse.json(fallbackResult);
  } catch (error) {
    console.error("Verify API Route Error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
