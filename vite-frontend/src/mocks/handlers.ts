import { http, HttpResponse, delay } from "msw";
import { mockOpportunities, mockOpportunityTypes } from "./data";
import type { Opportunity, OpportunityInput } from "../api/types";

const API_URL = import.meta.env.DEV ? "http://localhost:8000" : "/api";

function createId() {
  return crypto.randomUUID();
}

export const handlers = [
  // GET /me/prilike
  http.get(`${API_URL}/me/prilike`, async () => {
    await delay(500);
    return HttpResponse.json(mockOpportunities);
  }),

  // GET /prilike/:id
  http.get(`${API_URL}/prilike/:id`, async ({ params }) => {
    await delay(300);

    const opportunity = mockOpportunities.find((item) => item.id === params.id);

    if (!opportunity) {
      return HttpResponse.json(
        { message: "Prilika nije pronađena." },
        { status: 404 },
      );
    }

    return HttpResponse.json(opportunity);
  }),

  // GET /vrste-prilika
  http.get(`${API_URL}/vrste-prilika`, async () => {
    await delay(300);
    return HttpResponse.json(mockOpportunityTypes);
  }),

  // POST /me/prilike
  http.post(`${API_URL}/me/prilike`, async ({ request }) => {
    await delay(500);

    const formData = await request.formData();
    const rawData = formData.get("data");

    if (typeof rawData !== "string") {
      return HttpResponse.json(
        { message: "Nedostaju podaci prilike." },
        { status: 400 },
      );
    }

    let data: OpportunityInput;

    try {
      data = JSON.parse(rawData) as OpportunityInput;
    } catch {
      return HttpResponse.json(
        { message: "Neispravni podaci prilike." },
        { status: 400 },
      );
    }

    const files = formData
      .getAll("files")
      .filter((file): file is File => file instanceof File);

    const newOpportunity: Opportunity = {
      ...data,
      id: createId(),
      status: "PRIPREMA",
      applicationCount: 0,
      files: files.map((file) => ({
        id: createId(),
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        url: URL.createObjectURL(file),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockOpportunities.unshift(newOpportunity);

    return HttpResponse.json(newOpportunity, { status: 201 });
  }),

  // PUT /me/prilike/:id
  http.put(`${API_URL}/me/prilike/:id`, async ({ params, request }) => {
    await delay(500);

    const opportunityIndex = mockOpportunities.findIndex(
      (item) => item.id === params.id,
    );

    if (opportunityIndex === -1) {
      return HttpResponse.json(
        { message: "Prilika nije pronađena." },
        { status: 404 },
      );
    }

    const formData = await request.formData();
    const rawData = formData.get("data");

    if (typeof rawData !== "string") {
      return HttpResponse.json(
        { message: "Nedostaju podaci prilike." },
        { status: 400 },
      );
    }

    let data: OpportunityInput;

    try {
      data = JSON.parse(rawData) as OpportunityInput;
    } catch {
      return HttpResponse.json(
        { message: "Neispravni podaci prilike." },
        { status: 400 },
      );
    }

    const existing = mockOpportunities[opportunityIndex];

    const removedFileIds = formData
      .getAll("removedFileIds")
      .filter((id): id is string => typeof id === "string");

    const newFiles = formData
      .getAll("files")
      .filter((file): file is File => file instanceof File);

    const updatedOpportunity: Opportunity = {
      ...existing,
      ...data,
      files: [
        ...existing.files.filter((file) => !removedFileIds.includes(file.id)),
        ...newFiles.map((file) => ({
          id: createId(),
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          url: URL.createObjectURL(file),
        })),
      ],
      updatedAt: new Date().toISOString(),
    };

    mockOpportunities[opportunityIndex] = updatedOpportunity;

    return HttpResponse.json(updatedOpportunity);
  }),

  // DELETE /me/prilike/:id
  http.delete(`${API_URL}/me/prilike/:id`, async ({ params }) => {
    await delay(500);

    const opportunityIndex = mockOpportunities.findIndex(
      (item) => item.id === params.id,
    );

    if (opportunityIndex === -1) {
      return HttpResponse.json(
        { message: "Prilika nije pronađena." },
        { status: 404 },
      );
    }

    const opportunity = mockOpportunities[opportunityIndex];

    if (opportunity.applicationCount > 0) {
      return HttpResponse.json(
        {
          status: 409,
          code: "OPPORTUNITY_HAS_APPLICATIONS",
          applicationCount: opportunity.applicationCount,
        },
        { status: 409 },
      );
    }

    mockOpportunities.splice(opportunityIndex, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];
