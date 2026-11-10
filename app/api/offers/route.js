import { getDb, saveDb } from "@/app/lib/db";
import { jsonResponse, handleCors } from "@/app/lib/cors";

export async function OPTIONS(req) {
  return handleCors(req);
}

export async function GET() {
  try {
    const db = await getDb();
    return jsonResponse({
      success: true,
      offers: db.offers || [],
      promoCodes: db.promoCodes || [],
    });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const db = await getDb();

    // Check if adding a promoCode or an Offer
    if (body.type === "promo" || body.code) {
      const newPromo = {
        code: (body.code || "").toUpperCase().trim(),
        type: body.discountType || "percentage",
        value: Number(body.value) || 10,
        discountPercentage: Number(body.discountPercentage || body.value) || 10,
        minOrder: Number(body.minOrder) || 0,
        active: body.active !== false,
      };

      db.promoCodes = db.promoCodes || [];
      const existingIdx = db.promoCodes.findIndex((p) => p.code === newPromo.code);
      if (existingIdx >= 0) {
        db.promoCodes[existingIdx] = newPromo;
      } else {
        db.promoCodes.push(newPromo);
      }
      await saveDb(db);
      return jsonResponse({ success: true, promoCode: newPromo }, 201);
    }

    // Otherwise, adding an Offer card
    const newOffer = {
      id: body.id || `off-${Date.now()}`,
      title: body.title || "Special Offer",
      titleAr: body.titleAr || body.title || "عرض خاص",
      desc: body.desc || "",
      descAr: body.descAr || body.desc || "",
      price: Number(body.price) || 0,
      oldPrice: Number(body.oldPrice) || 0,
      discount: body.discount || "20% OFF",
      discountPercentage: Number(body.discountPercentage) || 20,
      image: body.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
      giftLabel: body.giftLabel || null,
      giftLabelAr: body.giftLabelAr || null,
      active: body.active !== false,
    };

    db.offers = db.offers || [];
    db.offers.unshift(newOffer);
    await saveDb(db);

    return jsonResponse({ success: true, offer: newOffer }, 201);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

