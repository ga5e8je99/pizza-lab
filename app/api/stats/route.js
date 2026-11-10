import { getDb } from "@/app/lib/db";
import { jsonResponse, handleCors } from "@/app/lib/cors";

export async function OPTIONS(req) {
  return handleCors(req);
}

export async function GET() {
  try {
    const db = await getDb();
    const orders = db.orders || [];
    const items = db.items || [];

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const preparingOrders = orders.filter((o) => o.status === "preparing").length;
    const onTheWayOrders = orders.filter((o) => o.status === "on_the_way").length;
    const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
    const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;

    // Item popularity calculation
    const itemCounts = {};
    orders.forEach((o) => {
      o.items?.forEach((it) => {
        itemCounts[it.name] = (itemCounts[it.name] || 0) + (it.quantity || 1);
      });
    });

    const topSelling = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return jsonResponse({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingOrders,
        preparingOrders,
        onTheWayOrders,
        deliveredOrders,
        cancelledOrders,
        activeOrders: pendingOrders + preparingOrders + onTheWayOrders,
        totalProducts: items.length,
        availableProducts: items.filter((i) => i.isAvailable !== false).length,
        categoriesCount: (db.categories || []).length,
        topSelling,
      },
    });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

