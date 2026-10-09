import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.ts";
import { openDatabase } from "../src/db.ts";
import { seedIncident } from "../src/seed.ts";

describe("casos do logs/incident.jsonl que os testes não nomeiam", () => {
  it("não credita de novo quando a chave reenviada termina em zero-width space", async () => {
    const db = openDatabase(":memory:");
    seedIncident(db);
    const app = createApp(db);
    const approve = (idempotencyKey: string) =>
      app.request("/approvals", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mission_id: "msn_2044",
          approved_at: "2026-03-12T21:05:00.000Z",
          idempotency_key: idempotencyKey,
        }),
      });

    const first = await approve("pay_7c1");
    const retry = await approve("pay_7c1​");

    expect(first.status).toBe(201);
    expect(retry.status).toBe(200);
    const mission = await app.request("/missions/msn_2044");
    const body = (await mission.json()) as { ledger: Array<{ amount_brl: number }> };
    expect(body.ledger).toHaveLength(1);
    expect(body.ledger[0]?.amount_brl).toBe(80);
  });
});
