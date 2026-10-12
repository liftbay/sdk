import createClient, { type Client, type ClientOptions } from "openapi-fetch";
import type { components, paths } from "./schema.d.ts";

export type { components, paths };
export type Schemas = components["schemas"];

/** Every error from the API has this shape; `fields` names invalid inputs on validation errors. */
export class LiftbayApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields: Record<string, string> = {},
  ) {
    super(message);
    this.name = "LiftbayApiError";
  }
}

export type LiftbayClient = Client<paths>;

export type LiftbayClientOptions = {
  /** API origin, e.g. https://api.liftbay.dev. Empty string means same origin (the dashboard). */
  baseUrl?: string;
  /** Organization API token (`lbt_…`) for the CLI, CI and agents. Browsers use the session cookie instead. */
  token?: string;
  fetch?: ClientOptions["fetch"];
  /** "include" when a browser app calls the API on another origin with its session cookie. */
  credentials?: "include" | "same-origin" | "omit";
  headers?: Record<string, string>;
};

/**
 * Typed client for the Liftbay API. Paths, parameters, bodies and responses are checked
 * against the API's OpenAPI document at compile time.
 *
 *   const lb = createLiftbayClient({ token: process.env.LIFTBAY_TOKEN });
 *   const builds = await unwrap(lb.GET("/v1/orgs/{org}/projects/{project}/builds", { params: { path: { org, project } } }));
 */
export function createLiftbayClient(options: LiftbayClientOptions = {}): LiftbayClient {
  return createClient<paths>({
    baseUrl: options.baseUrl ?? "https://api.liftbay.dev",
    fetch: options.fetch,
    credentials: options.credentials ?? "same-origin",
    headers: { ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}), ...options.headers },
  });
}

type FetchResult<T> = { data?: T; error?: unknown; response: Response };

/** Returns the response body, or throws a LiftbayApiError carrying the API's error details. */
export async function unwrap<T>(request: Promise<FetchResult<T>>): Promise<T> {
  const { data, error, response } = await request;
  if (response.ok) return data as T;
  const body = (error ?? {}) as { error?: { code?: string; message?: string; fields?: Record<string, string> } };
  throw new LiftbayApiError(
    response.status,
    body.error?.code ?? "http_error",
    body.error?.message ?? `Request failed (${response.status})`,
    body.error?.fields ?? {},
  );
}
