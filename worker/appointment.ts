export interface AppointmentEnv {
  APPOINTFLOW_URL?: string;
  APPOINTFLOW_API_KEY?: string;
}

function json(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

export async function handleAppointment(request: Request, env: AppointmentEnv): Promise<Response> {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return json({ error: "Please submit the form from the hospital website." }, 403);
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json({ error: "Invalid request." }, 415);
  }
  let payload: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 8192) return json({ error: "Request is too large." }, 413);
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return json({ error: "Invalid request." }, 400);
    payload = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  const field = (name: string, max: number) => {
    const value = payload[name];
    return typeof value === "string" && value.trim().length <= max ? value.trim() : "";
  };
  const externalId = field("externalId", 100);
  const patientName = field("name", 100);
  const rawPhone = field("phone", 24);
  const digits = rawPhone.replace(/\D/g, "");
  const phone = digits.length === 10 ? `+91${digits}` : `+${digits}`;
  const doctor = field("doctor", 100);
  const department = field("department", 80);
  const date = field("date", 10);
  const address = field("address", 300);
  const message = field("message", 200);
  if (!/^website-[0-9a-f-]{36}$/i.test(externalId) || !patientName || !/^[+\d\s()-]+$/.test(rawPhone) || digits.length < 10 || digits.length > 15 || !doctor || !department || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date || (typeof payload.message === "string" && payload.message.trim().length > 200) || (typeof payload.address === "string" && payload.address.trim().length > 300)) {
    return json({ error: "Please check your name, phone number, doctor, department and preferred date." }, 422);
  }
  const unavailable = { error: "We could not send your request. Please try again or call +91 7351028221." };
  if (!env.APPOINTFLOW_URL || !env.APPOINTFLOW_API_KEY) return json(unavailable, 503);
  try {
    const endpoint = new URL("/api/intake", env.APPOINTFLOW_URL);
    if (endpoint.protocol !== "https:") return json(unavailable, 503);
    const response = await fetch(endpoint, {
      method: "POST",
      redirect: "error",
      headers: { "content-type": "application/json", authorization: `Bearer ${env.APPOINTFLOW_API_KEY}` },
      body: JSON.stringify({ externalId, patientName, phone, address, source: "website", message: `Doctor: ${doctor}\nDepartment: ${department}\nPreferred date: ${date}\n${message}` }),
      signal: AbortSignal.timeout(15000),
    });
    if (response.status !== 202) return json(unavailable, 502);
    const receipt = await response.json() as { request?: { id?: unknown; status?: unknown } };
    if (typeof receipt.request?.id !== "string" || typeof receipt.request.status !== "string") return json(unavailable, 502);
    return json({ received: true }, 202);
  } catch {
    return json(unavailable, 502);
  }
}
