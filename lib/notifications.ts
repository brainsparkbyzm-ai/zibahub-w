import { db } from "@/lib/db";
import type { NotificationType } from "@prisma/client";

export async function notify(input: { userId: string; type: NotificationType; title: string; body: string; href?: string }) {
  await db.notification.create({ data: input });
}
