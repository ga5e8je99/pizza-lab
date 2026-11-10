import { getDb, saveDb } from "@/app/lib/db";
import { jsonResponse, handleCors } from "@/app/lib/cors";

export async function OPTIONS(req) {
  return handleCors(req);
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const item = db.items.find((i) => i.id === id);

    if (!item) {
      return jsonResponse({ success: false, error: "Item not found" }, 404);
    }

    return jsonResponse({ success: true, item });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = await getDb();

    const index = db.items.findIndex((i) => i.id === id);
    if (index === -1) {
      return jsonResponse({ success: false, error: "Item not found" }, 404);
    }

    const current = db.items[index];
    const updated = {
      ...current,
      ...body,
      id: current.id, // Preserve ID
      price: body.price !== undefined ? (body.price === null ? null : Number(body.price)) : current.price,
      oldPrice: body.oldPrice !== undefined ? (body.oldPrice === null ? null : Number(body.oldPrice)) : current.oldPrice,
      discountPercentage: body.discountPercentage !== undefined ? (body.discountPercentage === null ? null : Number(body.discountPercentage)) : current.discountPercentage,
      ingredients: Array.isArray(body.ingredients)
        ? body.ingredients
        : typeof body.ingredients === "string"
        ? body.ingredients.split(",").map((s) => s.trim())
        : current.ingredients,
    };

    db.items[index] = updated;
    await saveDb(db);

    return jsonResponse({ success: true, item: updated });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();

    const beforeLength = db.items.length;
    db.items = db.items.filter((i) => i.id !== id);

    if (db.items.length === beforeLength) {
      return jsonResponse({ success: false, error: "Item not found" }, 404);
    }

    await saveDb(db);
    return jsonResponse({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

