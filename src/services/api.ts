import type {
  CreatePostInput,
  Opportunity,
  Post,
  UpdateOpportunityInput,
  UpdatePostInput,
} from "../types";

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();

    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }

    if (
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string"
    ) {
      return data.error;
    }
  } catch {
    // The response may not contain JSON.
  }

  return `Request failed with status ${response.status}`;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json() as Promise<T>;
}

export function getPosts(): Promise<Post[]> {
  return request<Post[]>("/api/posts");
}

export function createPost(input: CreatePostInput): Promise<Post> {
  return request<Post>("/api/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updatePost(
  postId: number,
  input: UpdatePostInput,
): Promise<Post> {
  return request<Post>(`/api/posts/${postId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function getOpportunities(): Promise<Opportunity[]> {
  return request<Opportunity[]>("/api/opportunities");
}

export function updateOpportunity(
  opportunityId: number,
  input: UpdateOpportunityInput,
): Promise<Opportunity> {
  return request<Opportunity>(`/api/opportunities/${opportunityId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
