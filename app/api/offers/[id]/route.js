import { getDb, saveDb } from "@/app/lib/db";
import { jsonResponse, handleCors } from "@/app/lib/cors";

export async function OPTIONS(req) {
  return handleCors(req);
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();

    // Check if deleting promo or offer
    if (db.promoCodes && db.promoCodes.some((p) => p.code === id)) {
      db.promoCodes = db.promoCodes.filter((p) => p.code !== id);
      await saveDb(db);
      return jsonResponse({ success: true, message: "Promo code deleted" });
    }

    db.offers = (db.offers || []).filter((o) => String(o.id) !== String(id));
    await saveDb(db);
    return jsonResponse({ success: true, message: "Offer deleted" });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

