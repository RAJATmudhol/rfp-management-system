
import OpenAI from 'openai'


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})


function extractJSON(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : '{}';
}

function safeJSONParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(extractJSON(text)) as T;
  } catch {
    return fallback;
  }
}


export async function parseRFP(input: string) {
  const prompt = `
  Parse this procurement need into JSON:
  ${input}
  Output format:
  {
    "description": "",
    "budget": 0,
    "deliveryDays": 0,
    "items": [{ "name": "", "quantity": 0, "specs": "" }],
    "paymentTerms": "",
    "warranty": ""
  }`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.choices[0]?.message?.content ?? '{}';
  return safeJSONParse(content, {
    description: '',
    budget: 0,
    deliveryDays: 0,
    items: [],
    paymentTerms: '',
    warranty: '',
  });
}




function safeParse(text: string, fallback: any) {
  try {
    return JSON.parse(extractJSON(text));
  } catch {
    return fallback;
  }
}

/* ----------------------------------------------------------
   Parse vendor proposal email → normalized JSON
---------------------------------------------------------- */
function extractVendorReply(text: string): string {
  // Split using Gmail quoted reply pattern
  const parts = text.split(/\nOn .* wrote:\n/i);

  // Vendor reply is always before the first quoted message
  const reply = parts[0].trim();

  return reply;
}

export async function parseProposal(emailBody: string) {

  const vendorReply = extractVendorReply(emailBody);

  const prompt = `
You are an AI assistant that extracts structured purchasing proposal data
from vendor replies. Ignore quoted email threads.

Vendor Reply:
${vendorReply}

Extract:
- prices (array of { item, price })
- totalPrice
- paymentTerms
- warranty
- deliveryDays
- conditions

Return JSON:
{
  "prices": [],
  "totalPrice": 0,
  "paymentTerms": "",
  "warranty": "",
  "deliveryDays": 0,
  "conditions": ""
}
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return safeParse(res.choices[0].message.content ?? "", {
    prices: [],
    totalPrice: 0,
    paymentTerms: "",
    warranty: "",
    deliveryDays: 0,
    conditions: ""
  });
}


/* ------------------------------------------------------
 Compare proposals (AI-based weighted scoring)
-------------------------------------------------------- */
export async function aiCompareProposals(proposals: any[]) {
  const prompt = `
You are selecting the best vendor proposal.

Each proposal has:
- totalPrice (lower is better)
- deliveryDays (lower is better)
- warranty (longer is better)
- paymentTerms (clear & flexible is better)
- conditions (fewer restrictions is better)

Compare the proposals below and choose the best one:

${JSON.stringify(proposals, null, 2)}

Return ONLY this JSON example:
{
  "recommendedVendor": "Vendor Name",
  "reason": "why",
  "score": 0
}
`;

  const res:any = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(res.choices[0].message.content);
}
