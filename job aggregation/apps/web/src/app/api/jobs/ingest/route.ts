import { NextResponse } from "next/server";
import { prisma } from "@skillmatch/db";
import { MockJobSourceAdapter } from "@skillmatch/core";

export async function POST() {
  try {
    const adapter = new MockJobSourceAdapter();
    const { listings } = await adapter.fetchListings();

    // Ensure job source exists
    const source = await prisma.jobSource.upsert({
      where: { key: adapter.key },
      update: { enabled: true },
      create: {
        key: adapter.key,
        displayName: adapter.displayName,
        kind: "MANUAL",
        adapterClass: "MockJobSourceAdapter",
        enabled: true,
      },
    });

    const createdJobs = [];

    for (const listing of listings) {
      // 1. Ensure company exists
      const normalizedName = listing.companyName.toLowerCase().replace(/\s+/g, "-");
      const company = await prisma.company.upsert({
        where: { normalizedName },
        update: {},
        create: {
          name: listing.companyName,
          normalizedName,
        },
      });

      // 2. Create dedup key and content hash
      const dedupKey = `${normalizedName}:${listing.title.toLowerCase().replace(/\s+/g, "-")}`;
      const contentHash = Buffer.from(listing.description).toString("base64").slice(0, 32);

      // 3. Create or Update Job
      const job = await prisma.job.create({
        data: {
          title: listing.title,
          companyId: company.id,
          locationRaw: listing.locationRaw,
          city: listing.locationRaw?.split(",")[0],
          country: listing.locationRaw?.split(",")[1]?.trim(),
          remoteType: listing.remoteType,
          employmentType: listing.employmentType,
          salaryMin: listing.salaryMin,
          salaryMax: listing.salaryMax,
          salaryCurrency: listing.salaryCurrency,
          description: listing.description,
          dedupKey,
          contentHash,
          postedAt: listing.postedAt,
        },
      });

      // 4. Create Job Listing
      await prisma.jobListing.create({
        data: {
          jobId: job.id,
          sourceId: source.id,
          sourceJobId: listing.sourceJobId,
          jobUrl: listing.jobUrl,
          applyUrl: listing.applyUrl,
          titleRaw: listing.title,
          companyNameRaw: listing.companyName,
          locationRaw: listing.locationRaw,
          urlHash: Buffer.from(listing.jobUrl).toString("base64").slice(0, 32),
          fingerprint: contentHash,
        },
      });

      createdJobs.push(job);
    }

    return NextResponse.json({ success: true, count: createdJobs.length });
  } catch (error) {
    console.error("Error ingesting jobs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
