import { isDatabaseUnavailable } from "@/lib/errors";

export async function load<T>(fn: () => Promise<T>): Promise<{ ok: true; data: T } | { ok: false; reason: "database" }> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    if (isDatabaseUnavailable(error)) return { ok: false, reason: "database" };
    throw error;
  }
}
