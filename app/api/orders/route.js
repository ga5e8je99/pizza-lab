import { getDb, saveDb } from "@/app/lib/db";
import { jsonResponse, handleCors } from "@/app/lib/cors";

export async function OPTIONS(req) {
  return handleCors(req);
}

export async function GET(req) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let orders = [...(db.orders || [])];

    // Sort newest first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (status && status !== "all") {
      orders = orders.filter((o) => o.status === status);
    }

    return jsonResponse({
      success: true,
      orders,
      total: orders.length,
      counts: {
        all: db.orders?.length || 0,
        pending: db.orders?.filter((o) => o.status === "pending").length || 0,
        preparing: db.orders?.filter((o) => o.status === "preparing").length || 0,
        on_the_way: db.orders?.filter((o) => o.status === "on_the_way").length || 0,
        delivered: db.orders?.filter((o) => o.status === "delivered").length || 0,
        cancelled: db.orders?.filter((o) => o.status === "cancelled").length || 0,
      },
    });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const db = await getDb();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return jsonResponse({ success: false, error: "Cart is empty" }, 400);
    }

    // Generate unique readable order ID
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderId = `ORD-${dateStr}-${randomSuffix}`;

    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        name: body.customer?.name || body.name || "عميل غير معروف",
        phone: body.customer?.phone || body.phone || "",
        city: body.customer?.city || body.city || "Cairo",
        street: body.customer?.street || body.street || "",
        building: body.customer?.building || body.building || "",
        floor: body.customer?.floor || body.floor || "",
        apartment: body.customer?.apartment || body.apartment || "",
        notes: body.customer?.notes || body.notes || "",
      },
      items: body.items.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size || null,
        price: item.price || item.priceWithAddonOnesItem || 0,
        quantity: item.quantity || 1,
        addons: item.addons || [],
      })),
      subtotal: Number(body.subtotal) || 0,
      deliveryFee: Number(body.deliveryFee) || (db.settings?.deliveryFee || 30),
      tax: Number(body.tax) || 0,
      discount: body.discount || null,
      total: Number(body.total) || 0,
      paymentMethod: body.paymentMethod || "cash",
      status: "pending", // Always start as pending
    };

    db.orders = db.orders || [];
    db.orders.unshift(newOrder);
    await saveDb(db);

    return jsonResponse({ success: true, order: newOrder }, 201);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

