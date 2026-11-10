import { getDb, saveDb } from "@/app/lib/db";
import { jsonResponse, handleCors } from "@/app/lib/cors";

export async function OPTIONS(req) {
  return handleCors(req);
}

export async function GET() {
  try {
    const db = await getDb();
    return jsonResponse({ success: true, categories: db.categories || [] });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const db = await getDb();

    if (!body.name) {
      return jsonResponse({ success: false, error: "Category name is required" }, 400);
    }

    const newCategory = {
      id: body.id || `cat-${Date.now()}`,
      name: body.name,
      nameAr: body.nameAr || body.name,
      icon: body.icon || "Pizza",
      order: db.categories ? db.categories.length + 1 : 1,
    };

    db.categories = db.categories || [];
    db.categories.push(newCategory);
    await saveDb(db);

    return jsonResponse({ success: true, category: newCategory }, 201);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

