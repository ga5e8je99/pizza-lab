import { getDb, saveDb } from "@/app/lib/db";
import { jsonResponse, handleCors } from "@/app/lib/cors";

export async function OPTIONS(req) {
  return handleCors(req);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, phone, address } = body;

    if (!email || !password || !name) {
      return jsonResponse(
        { success: false, error: "Please provide name, email, and password." },
        400
      );
    }

    if (password.length < 6) {
      return jsonResponse(
        { success: false, error: "Password must be at least 6 characters long." },
        400
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = await getDb();
    db.users = db.users || [];

    const existingUser = db.users.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (existingUser) {
      return jsonResponse(
        { success: false, error: "An account with this email already exists." },
        409
      );
    }

    const token =
      "pizza_token_" +
      Date.now().toString(36) +
      Math.random().toString(36).substring(2, 10);

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password, // In real prod use bcrypt; here stored cleanly in json DB
      phone: phone || "",
      address: address || "",
      token: token,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    await saveDb(db);

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      createdAt: newUser.createdAt,
    };

    return jsonResponse(
      {
        success: true,
        message: "Registration successful",
        token,
        user: safeUser,
      },
      201
    );
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
