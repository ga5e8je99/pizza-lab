import { getDb, saveDb } from "@/app/lib/db";
import { jsonResponse, handleCors } from "@/app/lib/cors";

export async function OPTIONS(req) {
  return handleCors(req);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return jsonResponse(
        { success: false, error: "Please enter your email and password." },
        400
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = await getDb();
    db.users = db.users || [];

    let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    // If demo account and not in DB yet, create it
    if (!user && (cleanEmail === "gamal@example.com" || cleanEmail === "admin@example.com")) {
      user = {
        id: `usr-${Date.now()}`,
        name: cleanEmail.split("@")[0],
        email: cleanEmail,
        password: password,
        phone: "+20 100 123 4567",
        address: "New Cairo, Egypt",
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
      await saveDb(db);
    }

    if (!user) {
      return jsonResponse(
        { success: false, error: "Account not found. Please register first." },
        404
      );
    }

    if (user.password !== password) {
      return jsonResponse(
        { success: false, error: "Invalid email or password." },
        401
      );
    }

    const token =
      "pizza_token_" +
      Date.now().toString(36) +
      Math.random().toString(36).substring(2, 10);

    user.token = token;
    await saveDb(db);

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
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
