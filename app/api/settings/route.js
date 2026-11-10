import { getDb, saveDb } from "@/app/lib/db";
import { jsonResponse, handleCors } from "@/app/lib/cors";

export async function OPTIONS(req) {
  return handleCors(req);
}

export async function GET() {
  try {
    const db = await getDb();
    return jsonResponse({ success: true, settings: db.settings || {} });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const db = await getDb();

    db.settings = {
      ...(db.settings || {}),
      ...body,
    };

    await saveDb(db);
    return jsonResponse({ success: true, settings: db.settings });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

