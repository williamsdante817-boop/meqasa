const MEQASA_BASE_URL = "https://meqasa.com";
const DEFAULT_TIMEOUT_MS = 5000;

export interface MeqasaFetchOptions {
  endpoint: string;
  method?: "GET" | "POST";
  body?: Record<string, string>;
  searchParams?: Record<string, string | number | undefined>;
  timeoutMs?: number;
  revalidate?: number;
  tags?: string[];
  cache?: RequestCache;
  headers?: Record<string, string>;
}

export async function meqasaFetchJson<T>(options: MeqasaFetchOptions): Promise<T> {
  const {
    endpoint,
    method = "GET",
    body,
    searchParams,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    revalidate,
    tags,
    cache = "force-cache",
    headers = {},
  } = options;

  const url = new URL(endpoint, MEQASA_BASE_URL);
  if (searchParams) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }
    url.search = params.toString();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const requestUrl = url.toString();

  const contentType = (headers["Content-Type"] || headers["content-type"] || "application/x-www-form-urlencoded").toLowerCase();
  let requestBody: BodyInit | undefined;

  if (method === "POST" && body) {
    if (contentType.includes("application/json")) {
      requestBody = JSON.stringify(body);
    } else {
      requestBody = new URLSearchParams(body);
    }
  }

  try {
    const response = await fetch(requestUrl, {
      method,
      headers: {
        Accept: "application/json",
        ...(method === "POST"
          ? { "Content-Type": contentType }
          : {}),
        ...headers,
      },
      body: requestBody,
      signal: controller.signal,
      cache,
      next: revalidate
        ? {
            revalidate,
            tags,
          }
        : undefined,
    });

    if (!response.ok) {
      throw new Error(`Meqasa request failed: ${response.status}`);
    }

    if (process.env.LOG_MEQASA_FETCH === "1") {
      console.log("[meqasaFetchJson]", {
        url: requestUrl,
        method,
        cache: response.headers.get("x-cache"),
      });
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function meqasaFetchText(options: MeqasaFetchOptions): Promise<string> {
  const {
    endpoint,
    method = "GET",
    body,
    searchParams,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    revalidate,
    tags,
    cache = "force-cache",
    headers = {},
  } = options;

  const url = new URL(endpoint, MEQASA_BASE_URL);
  if (searchParams) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }
    url.search = params.toString();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const requestUrl = url.toString();

  const contentType = (headers["Content-Type"] || headers["content-type"] || "application/x-www-form-urlencoded").toLowerCase();
  let requestBody: BodyInit | undefined;

  if (method === "POST" && body) {
    if (contentType.includes("application/json")) {
      requestBody = JSON.stringify(body);
    } else {
      requestBody = new URLSearchParams(body);
    }
  }

  try {
    const response = await fetch(requestUrl, {
      method,
      headers: {
        ...(method === "POST"
          ? { "Content-Type": contentType }
          : {}),
        ...headers,
      },
      body: requestBody,
      signal: controller.signal,
      cache,
      next: revalidate
        ? {
            revalidate,
            tags,
          }
        : undefined,
    });

    if (!response.ok) {
      throw new Error(`Meqasa request failed: ${response.status}`);
    }

    if (process.env.LOG_MEQASA_FETCH === "1") {
      console.log("[meqasaFetchText]", {
        url: requestUrl,
        method,
        cache: response.headers.get("x-cache"),
      });
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}
