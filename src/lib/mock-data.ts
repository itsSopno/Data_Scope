import { RecordItem, AnalyticsSummary } from "@/types";

const FIRST_NAMES = ["James", "Emma", "Liam", "Olivia", "Noah", "Sophia", "Lucas", "Ava", "Mason", "Isabella", "Alexander", "Mia", "Ethan", "Charlotte", "Daniel", "Amelia", "Henry", "Harper", "Sebastian", "Evelyn"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const COMPANIES = ["Acme Corp", "Nexus Dynamics", "OmniTech Global", "Starlight Systems", "Quantum Leap Inc", "BlueSky Ventures", "Vanguard Industries", "Apex Logistics", "Solstice Cloud", "Crestview Media", "Horizon BioTech", "Ironclad AI", "CyberPulse", "Vertex Capital", "Synergy Global"];
const COUNTRIES = ["United States", "Germany", "United Kingdom", "France", "Japan", "Canada", "Australia", "Singapore", "Netherlands", "Sweden"];
const CITIES: Record<string, string[]> = {
  "United States": ["San Francisco", "New York", "Austin", "Seattle", "Chicago"],
  "Germany": ["Berlin", "Munich", "Frankfurt", "Hamburg"],
  "United Kingdom": ["London", "Manchester", "Edinburgh"],
  "France": ["Paris", "Lyon", "Marseille"],
  "Japan": ["Tokyo", "Osaka", "Kyoto"],
  "Canada": ["Toronto", "Vancouver", "Montreal"],
  "Australia": ["Sydney", "Melbourne", "Brisbane"],
  "Singapore": ["Singapore"],
  "Netherlands": ["Amsterdam", "Rotterdam"],
  "Sweden": ["Stockholm", "Gothenburg"],
};
const STATUSES: RecordItem["status"][] = ["Active", "Pending", "Suspended", "Archived"];
const TIERS: RecordItem["tier"][] = ["Enterprise", "Growth", "Starter"];
const CHURN_RISKS: RecordItem["churnRisk"][] = ["Low", "Medium", "High"];

// Seedable PRNG for consistent deterministic data
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate realistic simulated records
export function generateMockRecords(count: number = 2000, offsetId: number = 0): RecordItem[] {
  const records: RecordItem[] = [];

  for (let i = 0; i < count; i++) {
    const seed = offsetId + i + 1;
    const fnIdx = Math.floor(pseudoRandom(seed * 1) * FIRST_NAMES.length);
    const lnIdx = Math.floor(pseudoRandom(seed * 2) * LAST_NAMES.length);
    const compIdx = Math.floor(pseudoRandom(seed * 3) * COMPANIES.length);
    const countryIdx = Math.floor(pseudoRandom(seed * 4) * COUNTRIES.length);
    const country = COUNTRIES[countryIdx];
    const cityList = CITIES[country] || ["Capital"];
    const city = cityList[Math.floor(pseudoRandom(seed * 5) * cityList.length)];
    const status = STATUSES[Math.floor(pseudoRandom(seed * 6) * STATUSES.length)];
    const tier = TIERS[Math.floor(pseudoRandom(seed * 7) * TIERS.length)];
    const churn = CHURN_RISKS[Math.floor(pseudoRandom(seed * 8) * CHURN_RISKS.length)];

    const revenueBase = tier === "Enterprise" ? 65000 : tier === "Growth" ? 22000 : 4500;
    const revenue = Math.floor(revenueBase + pseudoRandom(seed * 9) * 45000);
    const dealSize = Math.floor(revenue * (0.8 + pseudoRandom(seed * 10) * 0.4));
    const score = Math.floor(40 + pseudoRandom(seed * 11) * 60);

    const firstName = FIRST_NAMES[fnIdx];
    const lastName = LAST_NAMES[lnIdx];
    const company = COMPANIES[compIdx];

    const daysAgo = Math.floor(pseudoRandom(seed * 12) * 365);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    records.push({
      id: `rec_${(offsetId + i + 100001).toString()}`,
      datasetId: "ds_enterprise_revenue",
      recordNumber: `DS-${(offsetId + i + 10001).toString()}`,
      customerName: `${firstName} ${lastName}`,
      company,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/[^a-z]/g, "")}.com`,
      country,
      city,
      status,
      tier,
      revenue,
      dealSize,
      churnRisk: churn,
      score,
      createdAt: date.toISOString(),
      updatedAt: new Date(date.getTime() + 86400000 * 2).toISOString(),
      tags: [tier, status, country],
      metadata: {
        industry: "Information Technology",
        contractTermMonths: tier === "Enterprise" ? 36 : 12,
        serverRegion: country === "Germany" ? "eu-central-1" : country === "United States" ? "us-east-1" : "ap-southeast-1",
        primaryContact: `${firstName} ${lastName}`,
      },
    });
  }

  return records;
}

export const staticAnalyticsData: AnalyticsSummary = {
  totalRecords: 100000,
  totalRevenue: 284500000,
  activeCount: 64200,
  pendingCount: 18500,
  avgDealSize: 34200,
  recordsByCategory: [
    { category: "Finance", count: 35000, revenue: 125000000 },
    { category: "Logistics", count: 28000, revenue: 76000000 },
    { category: "SaaS", count: 21000, revenue: 54000000 },
    { category: "Healthcare", count: 16000, revenue: 29500000 },
  ],
  recordsByStatus: [
    { status: "Active", count: 64200 },
    { status: "Pending", count: 18500 },
    { status: "Suspended", count: 11300 },
    { status: "Archived", count: 6000 },
  ],
  growthTrends: [
    { month: "Jan", records: 78000, revenue: 210000000 },
    { month: "Feb", records: 82000, revenue: 224000000 },
    { month: "Mar", records: 85500, revenue: 235000000 },
    { month: "Apr", records: 89000, revenue: 248000000 },
    { month: "May", records: 92400, revenue: 259000000 },
    { month: "Jun", records: 95000, revenue: 268000000 },
    { month: "Jul", records: 100000, revenue: 284500000 },
  ],
  frequentFilters: [
    { field: "Country = Germany", usageCount: 4210 },
    { field: "Revenue > $50,000", usageCount: 3890 },
    { field: "Status = Active", usageCount: 3540 },
    { field: "Tier = Enterprise", usageCount: 3120 },
    { field: "Churn Risk = High", usageCount: 1980 },
  ],
};

