import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function audit(actorId: string | null, action: string, entity: string, entityId?: string | null, metadata?: Prisma.InputJsonValue) {
  await db.auditLog.create({
    data: { actorId, action, entity, entityId: entityId || null, metadata },
  });
}
