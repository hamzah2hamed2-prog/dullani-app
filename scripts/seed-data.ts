import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  users,
  stores,
  products,
  categories,
  ratings,
  likes,
  comments,
  follows,
  wishlist,
} from "../drizzle/schema";

const DATABASE_URL = process.env.DATABASE_URL || "mysql://root:password@localhost:3306/dullani";

async function seedData() {
  console.log("🌱 Starting database seeding...");

  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  try {
    // 1. Create test users
    console.log("👥 Creating test users...");
    const testUsers = [
      {
        openId: "user-consumer-1",
        name: "أحمد علي",
        email: "ahmed@example.com",
        loginMethod: "oauth",
        accountType: "consumer" as const,
      },
      {
        openId: "user-consumer-2",
        name: "فاطمة محمد",
        email: "fatima@example.com",
        loginMethod: "oauth",
        accountType: "consumer" as const,
      },
      {
        openId: "merchant-1",
        name: "متجر الملابس الفاخرة",
        email: "store1@example.com",
        loginMethod: "oauth",
        accountType: "merchant" as const,
      },
      {
        openId: "merchant-2",
        name: "متجر الإلكترونيات",
        email: "store2@example.com",
        loginMethod: "oauth",
        accountType: "merchant" as const,
      },
      {
        openId: "merchant-3",
        name: "متجر الأحذية",
        email: "store3@example.com",
        loginMethod: "oauth",
        accountType: "merchant" as const,
      },
    ];

    for (const user of testUsers) {
      await db.insert(users).values(user).onDuplicateKeyUpdate({
        set: { name: user.name, email: user.email },
      });
    }
    console.log("✅ Users created");

    // 2. Get user IDs
    const allUsers = await db.select().from(users);
    const consumer1 = allUsers.find((u) => u.openId === "user-consumer-1");
    const consumer2 = allUsers.find((u) => u.openId === "user-consumer-2");
    const merchant1 = allUsers.find((u) => u.openId === "merchant-1");
    const merchant2 = allUsers.find((u) => u.openId === "merchant-2");
    const merchant3 = allUsers.find((u) => u.openId === "merchant-3");

    if (!consumer1 || !merchant1 || !merchant2 || !merchant3) {
      throw new Error("Failed to create users");
    }

    // 3. Create test stores
    console.log("🏪 Creating test stores...");
    const testStores = [
      {
        userId: merchant1.id,
        name: "متجر الملابس الفاخرة",
        description: "متجر متخصص في الملابس الفاخرة والعصرية",
        logo: "https://ui-avatars.com/api/?name=luxury-fashion&background=FF6B6B",
        address: "الرياض، شارع التحلية",
        latitude: "24.7136",
        longitude: "46.6753",
        phone: "966501234567",
        rating: "4.8",
        verified: 1,
      },
      {
        userId: merchant2.id,
        name: "متجر الإلكترونيات الحديثة",
        description: "أحدث الأجهزة الإلكترونية والملحقات",
        logo: "https://ui-avatars.com/api/?name=electronics&background=4ECDC4",
        address: "الرياض، حي الملز",
        latitude: "24.7500",
        longitude: "46.7000",
        phone: "966502345678",
        rating: "4.6",
        verified: 1,
      },
      {
        userId: merchant3.id,
        name: "متجر الأحذية الراقية",
        description: "أحذية عالمية الجودة وتصاميم حصرية",
        logo: "https://ui-avatars.com/api/?name=shoes&background=95E1D3",
        address: "الرياض، حي العليا",
        latitude: "24.7600",
        longitude: "46.7100",
        phone: "966503456789",
        rating: "4.9",
        verified: 1,
      },
    ];

    for (const store of testStores) {
      await db.insert(stores).values(store);
    }
    console.log("✅ Stores created");

    // 4. Get store IDs
    const allStores = await db.select().from(stores);
    const store1 = allStores[0];
    const store2 = allStores[1];
    const store3 = allStores[2];

    // 5. Create categories
    console.log("📂 Creating categories...");
    const testCategories = [
      { name: "ملابس", icon: "👕" },
      { name: "أحذية", icon: "👟" },
      { name: "إلكترونيات", icon: "📱" },
      { name: "إكسسوارات", icon: "👜" },
      { name: "ساعات", icon: "⌚" },
    ];

    for (const category of testCategories) {
      await db.insert(categories).values(category).onDuplicateKeyUpdate({
        set: { icon: category.icon },
      });
    }
    console.log("✅ Categories created");

    // 6. Create test products
    console.log("🛍️ Creating test products...");
    const testProducts = [
      // Store 1 products
      {
        storeId: store1.id,
        name: "فستان سهرة أسود فاخر",
        description: "فستان سهرة من القماش الحرير الفاخر، مناسب للحفلات والمناسبات الرسمية",
        price: "850",
        image: "https://via.placeholder.com/400?text=Black+Dress",
        category: "ملابس",
        inStock: 1,
      },
      {
        storeId: store1.id,
        name: "بنطال جينز أزرق كلاسيكي",
        description: "بنطال جينز من أفضل الماركات العالمية، مريح وعملي",
        price: "320",
        image: "https://via.placeholder.com/400?text=Blue+Jeans",
        category: "ملابس",
        inStock: 1,
      },
      {
        storeId: store1.id,
        name: "قميص أبيض كتان",
        description: "قميص كتان 100% طبيعي، مثالي للصيف والمناسبات الكاجوال",
        price: "280",
        image: "https://via.placeholder.com/400?text=White+Shirt",
        category: "ملابس",
        inStock: 1,
      },
      // Store 2 products
      {
        storeId: store2.id,
        name: "هاتف ذكي 5G",
        description: "هاتف ذكي بأحدث التقنيات، كاميرا احترافية، بطارية طويلة الأمد",
        price: "2500",
        image: "https://via.placeholder.com/400?text=5G+Phone",
        category: "إلكترونيات",
        inStock: 1,
      },
      {
        storeId: store2.id,
        name: "سماعات لاسلكية بلوتوث",
        description: "سماعات عالية الجودة مع تقنية الضوضاء النشطة",
        price: "450",
        image: "https://via.placeholder.com/400?text=Wireless+Headphones",
        category: "إلكترونيات",
        inStock: 1,
      },
      {
        storeId: store2.id,
        name: "شاحن سريع 65W",
        description: "شاحن سريع متعدد الأجهزة، آمن وفعال",
        price: "150",
        image: "https://via.placeholder.com/400?text=Fast+Charger",
        category: "إلكترونيات",
        inStock: 1,
      },
      // Store 3 products
      {
        storeId: store3.id,
        name: "أحذية رياضية عصرية",
        description: "أحذية رياضية مريحة وأنيقة، مناسبة للرياضة والاستخدام اليومي",
        price: "520",
        image: "https://via.placeholder.com/400?text=Sports+Shoes",
        category: "أحذية",
        inStock: 1,
      },
      {
        storeId: store3.id,
        name: "أحذية كلاسيكية جلد طبيعي",
        description: "أحذية جلد طبيعي 100%، تصميم كلاسيكي فاخر",
        price: "680",
        image: "https://via.placeholder.com/400?text=Leather+Shoes",
        category: "أحذية",
        inStock: 1,
      },
      {
        storeId: store3.id,
        name: "صنادل صيفية مريحة",
        description: "صنادل صيفية خفيفة ومريحة، مثالية للشاطئ والنزهات",
        price: "220",
        image: "https://via.placeholder.com/400?text=Summer+Sandals",
        category: "أحذية",
        inStock: 1,
      },
    ];

    for (const product of testProducts) {
      await db.insert(products).values(product);
    }
    console.log("✅ Products created");

    // 7. Get product IDs for ratings and likes
    const allProducts = await db.select().from(products);

    // 8. Create test ratings and reviews
    console.log("⭐ Creating ratings and reviews...");
    const testRatings = [
      {
        userId: consumer1.id,
        productId: allProducts[0].id,
        rating: 5,
        review: "منتج رائع جداً، جودة عالية وسعر مناسب",
      },
      {
        userId: consumer2.id,
        productId: allProducts[0].id,
        rating: 4,
        review: "جميل لكن كان أتوقع أفضل قليلاً",
      },
      {
        userId: consumer1.id,
        productId: allProducts[3].id,
        rating: 5,
        review: "هاتف ممتاز، أداء رائع وكاميرا احترافية",
      },
      {
        userId: consumer2.id,
        productId: allProducts[6].id,
        rating: 4,
        review: "أحذية مريحة جداً، أنصح بها",
      },
    ];

    for (const rating of testRatings) {
      await db.insert(ratings).values(rating);
    }
    console.log("✅ Ratings created");

    // 9. Create test likes
    console.log("❤️ Creating likes...");
    const testLikes = [
      { userId: consumer1.id, productId: allProducts[0].id },
      { userId: consumer1.id, productId: allProducts[3].id },
      { userId: consumer1.id, productId: allProducts[6].id },
      { userId: consumer2.id, productId: allProducts[1].id },
      { userId: consumer2.id, productId: allProducts[4].id },
      { userId: consumer2.id, productId: allProducts[7].id },
    ];

    for (const like of testLikes) {
      await db.insert(likes).values(like);
    }
    console.log("✅ Likes created");

    // 10. Create test comments
    console.log("💬 Creating comments...");
    const testComments = [
      {
        userId: consumer1.id,
        productId: allProducts[0].id,
        content: "هل هناك مقاسات أخرى متاحة؟",
      },
      {
        userId: consumer2.id,
        productId: allProducts[0].id,
        content: "أين يمكن الحصول على هذا المنتج؟",
      },
      {
        userId: consumer1.id,
        productId: allProducts[3].id,
        content: "هل يتوفر باللون الأحمر؟",
      },
    ];

    for (const comment of testComments) {
      await db.insert(comments).values(comment);
    }
    console.log("✅ Comments created");

    // 11. Create test follows
    console.log("👥 Creating follows...");
    const testFollows = [
      { followerId: consumer1.id, followingStoreId: store1.id },
      { followerId: consumer1.id, followingStoreId: store2.id },
      { followerId: consumer2.id, followingStoreId: store1.id },
      { followerId: consumer2.id, followingStoreId: store3.id },
    ];

    for (const follow of testFollows) {
      await db.insert(follows).values(follow);
    }
    console.log("✅ Follows created");

    // 12. Create test wishlist items
    console.log("💝 Creating wishlist items...");
    const testWishlist = [
      { userId: consumer1.id, productId: allProducts[0].id },
      { userId: consumer1.id, productId: allProducts[3].id },
      { userId: consumer2.id, productId: allProducts[1].id },
      { userId: consumer2.id, productId: allProducts[6].id },
    ];

    for (const item of testWishlist) {
      await db.insert(wishlist).values(item);
    }
    console.log("✅ Wishlist items created");

    console.log("\n✨ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Users: ${testUsers.length}`);
    console.log(`   - Stores: ${testStores.length}`);
    console.log(`   - Products: ${testProducts.length}`);
    console.log(`   - Ratings: ${testRatings.length}`);
    console.log(`   - Likes: ${testLikes.length}`);
    console.log(`   - Comments: ${testComments.length}`);
    console.log(`   - Follows: ${testFollows.length}`);
    console.log(`   - Wishlist items: ${testWishlist.length}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedData();
