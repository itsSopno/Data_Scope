import { db, client } from "../src/db";
import { users, datasets, datasetRecords, savedViews } from "../src/db/schema";
import { generateMockRecords } from "../src/lib/mock-data";

async function runSeed() {
  console.log("🌱 Starting DataScope 100,000 Records Seeding Engine...");
  const startTime = performance.now();

  try {
    // 1. Seed Default Admin, Analyst, Viewer Users
    console.log("👤 Seeding system users (Admin, Analyst, Viewer)...");
    await db
      .insert(users)
      .values([
        {
          id: "usr_admin_101",
          name: "Alex Vance",
          email: "admin@datascope.enterprise",
          role: "admin",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
        },
        {
          id: "usr_analyst_102",
          name: "Sarah Connor",
          email: "analyst@datascope.enterprise",
          role: "analyst",
        },
        {
          id: "usr_viewer_103",
          name: "David Bowman",
          email: "viewer@datascope.enterprise",
          role: "viewer",
        },
      ])
      .onConflictDoNothing();

    // 2. Seed Master Datasets
    console.log("📁 Seeding master datasets...");
    const primaryDatasetId = "ds_enterprise_revenue";
    await db
      .insert(datasets)
      .values([
        {
          id: primaryDatasetId,
          name: "Global Enterprise Accounts & Revenue",
          description: "Multi-regional B2B accounts, contract valuations, risk scoring, and churn analytics.",
          category: "Finance",
          source: "PostgreSQL Production Core (Replicated)",
          totalRecords: 100000,
          accessPermissions: ["admin", "analyst", "viewer"],
        },
        {
          id: "ds_ecommerce_orders",
          name: "Omnichannel Logistics & High-Volume Orders",
          description: "Transaction logs, inventory movements, carrier tracking, and order fulfillment states.",
          category: "Logistics",
          source: "PostgreSQL Partitioned Archive",
          totalRecords: 250000,
          accessPermissions: ["admin", "analyst"],
        },
      ])
      .onConflictDoNothing();

    // 3. Batch Ingest 100,000 Records
    const TOTAL_RECORDS = 100000;
    const BATCH_SIZE = 2500;
    const TOTAL_BATCHES = TOTAL_RECORDS / BATCH_SIZE;

    console.log(`⚡ Generating & inserting ${TOTAL_RECORDS.toLocaleString()} records in batches of ${BATCH_SIZE}...`);

    for (let b = 0; b < TOTAL_BATCHES; b++) {
      const offset = b * BATCH_SIZE;
      const mockBatch = generateMockRecords(BATCH_SIZE, offset).map((r) => ({
        id: r.id,
        datasetId: primaryDatasetId,
        recordNumber: r.recordNumber,
        customerName: r.customerName,
        company: r.company,
        email: r.email,
        country: r.country,
        city: r.city,
        status: r.status,
        tier: r.tier,
        revenue: r.revenue,
        dealSize: r.dealSize,
        churnRisk: r.churnRisk,
        score: r.score,
        metadata: r.metadata,
        tags: r.tags,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
      }));

      await db.insert(datasetRecords).values(mockBatch).onConflictDoNothing();

      const progress = (((b + 1) / TOTAL_BATCHES) * 100).toFixed(0);
      process.stdout.write(`\r   Progress: [${progress}%] - Inserted ${(b + 1) * BATCH_SIZE} records`);
    }

    console.log("\n\n✅ 100,000 Records Successfully Ingested and Indexed!");
    const duration = ((performance.now() - startTime) / 1000).toFixed(2);
    console.log(`⏱️ Total Execution Time: ${duration} seconds.`);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await client.end();
    process.exit(0);
  }
}

runSeed();

