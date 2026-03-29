import {
  getDb,
  upsertUser,
  getUserByOpenId,
  createProduct,
  getProductById,
} from "../server/db";

async function seedTestData() {
  console.log("🌱 Starting test data seeding...");
  
  const db = await getDb();
  if (!db) {
    console.error("❌ Database connection failed");
    return;
  }

  try {
    // 1. Create test users (consumers and merchants)
    console.log("📝 Creating test users...");
    
    const testUsers = [
      {
        openId: "test-consumer-1",
        name: "أحمد محمد",
        email: "ahmed@example.com",
        loginMethod: "google",
        accountType: "consumer" as const,
      },
      {
        openId: "test-consumer-2",
        name: "فاطمة علي",
        email: "fatima@example.com",
        loginMethod: "google",
        accountType: "consumer" as const,
      },
      {
        openId: "test-merchant-1",
        name: "متجر الأزياء",
        email: "fashion-store@example.com",
        loginMethod: "google",
        accountType: "merchant" as const,
      },
      {
        openId: "test-merchant-2",
        name: "متجر الإلكترونيات",
        email: "electronics-store@example.com",
        loginMethod: "google",
        accountType: "merchant" as const,
      },
      {
        openId: "test-merchant-3",
        name: "متجر الكتب",
        email: "books-store@example.com",
        loginMethod: "google",
        accountType: "merchant" as const,
      },
    ];

    const createdUsers: any[] = [];
    for (const user of testUsers) {
      try {
        await upsertUser(user);
        const createdUser = await getUserByOpenId(user.openId);
        if (createdUser) {
          createdUsers.push(createdUser);
          console.log(`  ✓ User ${user.name} ready`);
        }
      } catch (e) {
        console.log(`  ℹ User ${user.name} setup skipped`);
      }
    }

    // 2. Create test categories (using raw db)
    console.log("📂 Creating test categories...");
    
    const { categories } = await import("../drizzle/schema");
    const testCategories = [
      { name: "أزياء", icon: "👗" },
      { name: "إلكترونيات", icon: "📱" },
      { name: "كتب", icon: "📚" },
      { name: "أحذية", icon: "👟" },
      { name: "إكسسوارات", icon: "💍" },
    ];

    const createdCategories: any[] = [];
    for (const cat of testCategories) {
      try {
        await db.insert(categories).values(cat);
        console.log(`  ✓ Created category: ${cat.name}`);
        createdCategories.push(cat);
      } catch (e) {
        console.log(`  ℹ Category ${cat.name} already exists`);
      }
    }

    // 3. Create test products
    console.log("🛍️ Creating test products...");
    
    const merchantIds = createdUsers
      .filter((u: any) => u.role !== "admin" && (u as any).accountType === "merchant")
      .map((u: any) => u.id);

    const testProducts = [
      {
        storeId: merchantIds[0] || 1,
        category: "أزياء",
        name: "فستان أسود أنيق",
        description: "فستان أسود فاخر مناسب للمناسبات",
        price: "150",
        image: "https://via.placeholder.com/300?text=Black+Dress",
      },
      {
        storeId: merchantIds[0] || 1,
        category: "أزياء",
        name: "قميص أبيض كلاسيكي",
        description: "قميص أبيض 100% قطن",
        price: "80",
        image: "https://via.placeholder.com/300?text=White+Shirt",
      },
      {
        storeId: merchantIds[1] || 2,
        category: "إلكترونيات",
        name: "هاتف ذكي جديد",
        description: "هاتف ذكي بأحدث التقنيات",
        price: "800",
        image: "https://via.placeholder.com/300?text=Smartphone",
      },
      {
        storeId: merchantIds[1] || 2,
        category: "إلكترونيات",
        name: "سماعات لاسلكية",
        description: "سماعات بلوتوث عالية الجودة",
        price: "120",
        image: "https://via.placeholder.com/300?text=Headphones",
      },
      {
        storeId: merchantIds[2] || 3,
        category: "كتب",
        name: "رواية أدب عربي",
        description: "رواية مشهورة للأدب العربي",
        price: "40",
        image: "https://via.placeholder.com/300?text=Arabic+Novel",
      },
      {
        storeId: merchantIds[2] || 3,
        category: "كتب",
        name: "كتاب تطوير الذات",
        description: "كتاب يساعدك على تطوير مهاراتك",
        price: "50",
        image: "https://via.placeholder.com/300?text=Self+Help+Book",
      },
    ];

    const createdProducts: any[] = [];
    for (const prod of testProducts) {
      try {
        const productId = await createProduct(prod);
        if (productId) {
          const product = await getProductById(productId);
          if (product) {
            createdProducts.push(product);
            console.log(`  ✓ Created product: ${prod.name}`);
          }
        }
      } catch (e) {
        console.log(`  ℹ Product ${prod.name} creation skipped`);
      }
    }

    // 4. Create test ratings and comments
    console.log("⭐ Creating test ratings and comments...");
    
    const { ratings, comments } = await import("../drizzle/schema");
    const consumerIds = createdUsers
      .filter((u: any) => (u as any).accountType === "consumer")
      .map((u: any) => u.id);

    for (let i = 0; i < createdProducts.length; i++) {
      const product = createdProducts[i];
      const consumerId = consumerIds[i % consumerIds.length];

      // Add rating
      const ratingValue = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
      try {
        await db.insert(ratings).values({
          productId: product.id,
          userId: consumerId,
          rating: ratingValue,
        });
      } catch (e) {
        // Skip if rating already exists
      }

      // Add comment
      const comments_text = [
        "منتج رائع وجودة ممتازة!",
        "أنصح الجميع بشراء هذا المنتج",
        "تجربة شراء رائعة جداً",
        "سعر مناسب وجودة عالية",
        "خدمة عملاء ممتازة",
      ];

      try {
        await db.insert(comments).values({
          productId: product.id,
          userId: consumerId,
          content: comments_text[i % comments_text.length],
        });
      } catch (e) {
        // Skip if comment already exists
      }

      console.log(`  ✓ Added rating and comment for: ${product.name}`);
    }

    // 5. Create test likes
    console.log("❤️ Creating test likes...");
    
    const { likes } = await import("../drizzle/schema");
    for (const product of createdProducts) {
      for (let i = 0; i < Math.min(2, consumerIds.length); i++) {
        const consumerId = consumerIds[i];
        try {
          await db.insert(likes).values({
            productId: product.id,
            userId: consumerId,
          });
        } catch (e) {
          // Skip if like already exists
        }
      }
      console.log(`  ✓ Added likes for: ${product.name}`);
    }

    // 6. Create test follows
    console.log("👥 Creating test follows...");
    
    const { follows } = await import("../drizzle/schema");
    const consumers = createdUsers.filter((u: any) => (u as any).accountType === "consumer");
    const merchants = createdUsers.filter((u: any) => (u as any).accountType === "merchant");
    
    for (const consumer of consumers) {
      for (const merchant of merchants) {
        try {
          await db.insert(follows).values({
            followerId: consumer.id,
            followingUserId: merchant.id,
          });
        } catch (e) {
          // Skip if follow already exists
        }
      }
      console.log(`  ✓ ${consumer.name} is now following merchants`);
    }

    console.log("✅ Test data seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`  - Users created: ${createdUsers.length}`);
    console.log(`  - Categories created: ${createdCategories.length}`);
    console.log(`  - Products created: ${createdProducts.length}`);
    console.log(`  - Ratings added: ${createdProducts.length}`);
    console.log(`  - Comments added: ${createdProducts.length}`);
    console.log(`  - Follows created: ${consumers.length * merchants.length}`);
  } catch (error) {
    console.error("❌ Error seeding test data:", error);
    throw error;
  }
}

// Run the seed function
seedTestData().then(() => {
  console.log("\n🎉 All done!");
  process.exit(0);
}).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
