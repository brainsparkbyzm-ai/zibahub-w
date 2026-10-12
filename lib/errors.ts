export class AppError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function jsonError(error: unknown) {
  if (error instanceof AppError) {
    return Response.json(
      { ok: false, error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }
  console.error(error);
  return Response.json(
    { ok: false, error: { code: "internal_error", message: "Something went wrong." } },
    { status: 500 },
  );
}

export function isDatabaseUnavailable(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Can't reach database") ||
    message.includes("ECONNREFUSED") ||
    message.includes("P1001") ||
    message.includes("Environment variable not found: DATABASE_URL") ||
    message.includes("password authentication failed") ||
    message.includes("does not exist")
  );
}
