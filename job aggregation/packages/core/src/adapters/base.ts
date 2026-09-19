export interface JobListingInput {
  sourceJobId: string;
  title: string;
  companyName: string;
  jobUrl: string;
  applyUrl?: string;
  locationRaw?: string;
  description: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  remoteType?: 'REMOTE' | 'HYBRID' | 'ONSITE' | 'UNKNOWN';
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  postedAt?: Date;
  rawPayload?: any;
}

export interface JobSourceAdapter {
  key: string;
  displayName: string;
  fetchListings(cursor?: string): Promise<{
    listings: JobListingInput[];
    nextCursor?: string;
  }>;
}
