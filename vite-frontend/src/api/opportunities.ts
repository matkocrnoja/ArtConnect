import { req, req_priv } from "./client";
import type { Opportunity, OpportunityInput, OpportunityType } from "./types";

export class OpportunityApiError extends Error {
  status: number;
  code?: string;
  applicationCount?: number;

  constructor(
    message: string,
    status: number,
    code?: string,
    applicationCount?: number,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.applicationCount = applicationCount;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: {
      message?: string;
      code?: string;
      applicationCount?: number;
    } = {};

    try {
      errorData = await response.json();
    } catch {}

    throw new OpportunityApiError(
      errorData.message ?? `Server error (${response.status}).`,
      response.status,
      errorData.code,
      errorData.applicationCount,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getMyOpportunities(): Promise<Opportunity[]> {
  const response = await req_priv("/me/prilike");
  return handleResponse<Opportunity[]>(response);
}

// GET /prilike/{id}
export async function getOpportunity(id: string): Promise<Opportunity> {
  const response = await req(`/prilike/${encodeURIComponent(id)}`);
  return handleResponse<Opportunity>(response);
}

// GET /vrste-prilika
export async function getOpportunityTypes(): Promise<OpportunityType[]> {
  const response = await req("/vrste-prilika");
  return handleResponse<OpportunityType[]>(response);
}

export async function getArtAreas(): Promise<unknown[]> {
  const response = await req("/podrucja");
  return handleResponse<unknown[]>(response);
}

function createFormData(
  data: OpportunityInput,
  files: File[],
  removedFileIds: string[] = [],
): FormData {
  const formData = new FormData();

  formData.append("data", JSON.stringify(data));

  files.forEach((file) => {
    formData.append("files", file);
  });

  removedFileIds.forEach((id) => {
    formData.append("removedFileIds", id);
  });

  return formData;
}

export async function createOpportunity(
  data: OpportunityInput,
  files: File[] = [],
): Promise<Opportunity> {
  const response = await req_priv("/me/prilike", {
    method: "POST",
    body: createFormData(data, files),
  });

  return handleResponse<Opportunity>(response);
}

export async function updateOpportunity(
  id: string,
  data: OpportunityInput,
  files: File[] = [],
  removedFileIds: string[] = [],
): Promise<Opportunity> {
  const response = await req_priv(`/me/prilike/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: createFormData(data, files, removedFileIds),
  });

  return handleResponse<Opportunity>(response);
}

export async function deleteOpportunity(id: string): Promise<void> {
  const response = await req_priv(`/me/prilike/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  return handleResponse<void>(response);
}
