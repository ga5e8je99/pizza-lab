import { getDb, saveDb } from "@/app/lib/db";
import { jsonResponse, handleCors } from "@/app/lib/cors";

export async function OPTIONS(req) {
  return handleCors(req);
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const order = db.orders.find((o) => o.id === id);

    if (!order) {
      return jsonResponse({ success: false, error: "Order not found" }, 404);
    }

    return jsonResponse({ success: true, order });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = await getDb();

    const index = db.orders.findIndex((o) => o.id === id);
    if (index === -1) {
      return jsonResponse({ success: false, error: "Order not found" }, 404);
    }

    const currentOrder = db.orders[index];
    const allowedStatuses = ["pending", "preparing", "on_the_way", "delivered", "cancelled"];

    if (body.status && !allowedStatuses.includes(body.status)) {
      return jsonResponse({ success: false, error: `Invalid status: ${body.status}` }, 400);
    }

    const updatedOrder = {
      ...currentOrder,
      ...body,
      id: currentOrder.id, // Immutable ID
      updatedAt: new Date().toISOString(),
    };

    db.orders[index] = updatedOrder;
    await saveDb(db);

    return jsonResponse({ success: true, order: updatedOrder });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();

    const beforeLen = db.orders.length;
    db.orders = db.orders.filter((o) => o.id !== id);

    if (db.orders.length === beforeLen) {
      return jsonResponse({ success: false, error: "Order not found" }, 404);
    }

    await saveDb(db);
    return jsonResponse({ success: true, message: "Order removed successfully" });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

