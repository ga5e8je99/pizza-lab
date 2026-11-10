import { getDb, saveDb } from "@/app/lib/db";
import { jsonResponse, handleCors } from "@/app/lib/cors";

export async function OPTIONS(req) {
  return handleCors(req);
}

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();

    if (!token) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    const db = await getDb();
    const user = (db.users || []).find((u) => u.token === token);

    if (!user) {
      return jsonResponse({ success: false, error: "Invalid token" }, 401);
    }

    // Get user's orders
    const orders = (db.orders || []).filter(
      (o) =>
        o.customer?.phone === user.phone ||
        o.customer?.name?.toLowerCase() === user.name?.toLowerCase()
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      createdAt: user.createdAt,
    };

    return jsonResponse({
      success: true,
      user: safeUser,
      orders,
    });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function PUT(req) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();

    if (!token) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    const body = await req.json();
    const db = await getDb();
    const userIdx = (db.users || []).findIndex((u) => u.token === token);

    if (userIdx === -1) {
      return jsonResponse({ success: false, error: "User not found" }, 404);
    }

    const currentUser = db.users[userIdx];
    const updated = {
      ...currentUser,
      name: body.name || currentUser.name,
      phone: body.phone !== undefined ? body.phone : currentUser.phone,
      address: body.address !== undefined ? body.address : currentUser.address,
    };

    if (body.newPassword && body.newPassword.length >= 6) {
      updated.password = body.newPassword;
    }

    db.users[userIdx] = updated;
    await saveDb(db);

    const safeUser = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone || "",
      address: updated.address || "",
      createdAt: updated.createdAt,
    };

    return jsonResponse({
      success: true,
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
