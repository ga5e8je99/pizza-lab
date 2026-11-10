import { getDb, saveDb } from "@/app/lib/db";
import { jsonResponse, handleCors } from "@/app/lib/cors";

export async function OPTIONS(req) {
  return handleCors(req);
}

export async function GET(req) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const grouped = searchParams.get("grouped") === "true";

    let items = db.items || [];
    if (category) {
      items = items.filter(
        (i) => i.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (grouped) {
      // Group items by category to match MenuContext format
      const categories = db.categories || [];
      const groupedData = categories.map((cat) => ({
        category: cat.name,
        nameAr: cat.nameAr,
        items: items.filter((i) => i.category.toLowerCase() === cat.name.toLowerCase()),
      }));
      return jsonResponse({ success: true, data: groupedData });
    }

    return jsonResponse({
      success: true,
      data: items,
      categories: db.categories || [],
    });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const db = await getDb();

    const newItem = {
      id: body.id || `item-${Date.now()}`,
      category: body.category || "Pizza",
      name: body.name || "New Dish",
      nameAr: body.nameAr || body.name || "",
      image: body.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
      price: body.price !== undefined ? Number(body.price) : null,
      priceBySize: body.priceBySize || (body.sizes?.length ? { s: 50, m: 80, l: 110, xl: 140 } : null),
      sizes: body.sizes || (body.priceBySize ? Object.keys(body.priceBySize) : []),
      isDiscount: Boolean(body.isDiscount),
      oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
      discountPercentage: body.discountPercentage ? Number(body.discountPercentage) : null,
      ingredients: Array.isArray(body.ingredients)
        ? body.ingredients
        : typeof body.ingredients === "string"
        ? body.ingredients.split(",").map((s) => s.trim())
        : [],
      description: body.description || "",
      isAvailable: body.isAvailable !== false,
      popular: Boolean(body.popular),
    };

    db.items.unshift(newItem);
    await saveDb(db);

    return jsonResponse({ success: true, item: newItem }, 201);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

