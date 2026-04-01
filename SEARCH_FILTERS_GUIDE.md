# دليل البحث والفلاتر المتقدمة - دلني

## نظرة عامة

يوفر تطبيق دلني نظام بحث وفلاتر متقدم يشمل:

- **Debounced Search** - بحث محسّن بدون تأخير
- **Search History** - تذكر عمليات البحث السابقة
- **Advanced Filters** - فلاتر متقدمة وقابلة للتخصيص
- **Filter Preferences** - حفظ تفضيلات الفلاتر
- **Recent Searches** - عرض عمليات البحث الأخيرة

---

## 1. Debouncing للبحث

### useDebounce Hook

```tsx
import { useDebounce } from "@/hooks/use-debounce";

export function MyComponent() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500); // تأخير 500ms

  useEffect(() => {
    if (debouncedQuery) {
      // تنفيذ البحث فقط عند توقف الكتابة
      searchProducts(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <TextInput
      value={query}
      onChangeText={setQuery}
      placeholder="ابحث..."
    />
  );
}
```

### useDebouncedCallback Hook

```tsx
import { useDebouncedCallback } from "@/hooks/use-debounce";

export function MyComponent() {
  const handleSearch = useDebouncedCallback((query: string) => {
    console.log("البحث عن:", query);
    // تنفيذ البحث
  }, 500);

  return (
    <TextInput
      onChangeText={handleSearch}
      placeholder="ابحث..."
    />
  );
}
```

### useAdvancedDebounce Hook

```tsx
import { useAdvancedDebounce } from "@/hooks/use-debounce";

export function MyComponent() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useAdvancedDebounce(query, 500, {
    leading: true,   // تنفيذ فوري عند البدء
    trailing: true,  // تنفيذ عند التوقف
    maxWait: 2000,   // تنفيذ إجباري بعد 2 ثانية
  });

  return <TextInput value={query} onChangeText={setQuery} />;
}
```

---

## 2. SearchInput Component

### الاستخدام الأساسي

```tsx
import { SearchInput } from "@/components/search-input";

export function MyScreen() {
  const handleSearch = (query: string) => {
    console.log("البحث عن:", query);
    // تنفيذ البحث
  };

  return (
    <SearchInput
      placeholder="ابحث عن المنتجات..."
      onSearch={handleSearch}
      debounceDelay={500}
    />
  );
}
```

### مع Suggestions

```tsx
<SearchInput
  placeholder="ابحث..."
  onSearch={handleSearch}
  suggestions={["تي شيرت", "جينز", "حذاء", "حقيبة"]}
  onSuggestionSelect={(suggestion) => {
    console.log("تم اختيار:", suggestion);
  }}
/>
```

### مع History

```tsx
const { searchHistory } = useSearch();

<SearchInput
  placeholder="ابحث..."
  onSearch={handleSearch}
  showHistory={true}
  history={searchHistory}
  onClear={() => {
    // تنظيف البحث
  }}
/>
```

---

## 3. FilterPanel Component

### الاستخدام الأساسي

```tsx
import { FilterPanel, FilterOption } from "@/components/filter-panel";

export function MyScreen() {
  const filters: FilterOption[] = [
    {
      id: "category",
      label: "الفئة",
      type: "radio",
      options: [
        { id: "all", label: "الكل" },
        { id: "men", label: "رجالي" },
        { id: "women", label: "نسائي" },
      ],
    },
    {
      id: "size",
      label: "الحجم",
      type: "checkbox",
      options: [
        { id: "s", label: "صغير" },
        { id: "m", label: "متوسط" },
        { id: "l", label: "كبير" },
      ],
    },
    {
      id: "inStock",
      label: "في المخزن فقط",
      type: "toggle",
    },
  ];

  const handleFilterChange = (filterId: string, value: any) => {
    console.log(`تغيير الفلتر ${filterId}:`, value);
  };

  const handleApply = () => {
    console.log("تطبيق الفلاتر");
  };

  const handleReset = () => {
    console.log("إعادة تعيين الفلاتر");
  };

  return (
    <FilterPanel
      filters={filters}
      onFilterChange={handleFilterChange}
      onApply={handleApply}
      onReset={handleReset}
      title="الفلاتر"
    />
  );
}
```

---

## 4. useSearch Hook

### الاستخدام الأساسي

```tsx
import { useSearch } from "@/hooks/use-search";

export function MyScreen() {
  const {
    query,
    debouncedQuery,
    searchHistory,
    recentSearches,
    isLoading,
    handleSearch,
    handleClear,
    handleRemoveFromHistory,
    handleSearchComplete,
  } = useSearch({
    debounceDelay: 500,
    saveHistory: true,
    onSearch: (query) => {
      console.log("البحث عن:", query);
      // تنفيذ البحث
    },
  });

  return (
    <View>
      <SearchInput
        value={query}
        onChangeText={handleSearch}
        onClear={handleClear}
        history={searchHistory}
      />

      {isLoading && <LoadingState />}

      {/* عرض النتائج */}
    </View>
  );
}
```

---

## 5. Preferences Storage

### حفظ وتحميل السجل

```tsx
import {
  saveSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  removeFromSearchHistory,
} from "@/lib/preferences";

// حفظ البحث
await saveSearchHistory("تي شيرت");

// الحصول على السجل
const history = await getSearchHistory();
console.log(history); // ["تي شيرت", "جينز", ...]

// حذف عنصر
await removeFromSearchHistory("تي شيرت");

// مسح السجل
await clearSearchHistory();
```

### حفظ تفضيلات الفلاتر

```tsx
import {
  saveFilterPreferences,
  getFilterPreferences,
  getFilterPreference,
} from "@/lib/preferences";

// حفظ التفضيلات
await saveFilterPreferences("category", {
  selected: ["men", "women"],
  timestamp: Date.now(),
});

// الحصول على التفضيلات
const prefs = await getFilterPreferences();
const categoryPrefs = await getFilterPreference("category");
```

### حفظ مجموعات الفلاتر المفضلة

```tsx
import {
  saveFavoriteFilters,
  getFavoriteFilters,
  deleteFavoriteFilters,
} from "@/lib/preferences";

// حفظ مجموعة فلاتر
await saveFavoriteFilters("الملابس الرجالية", {
  category: "men",
  size: ["m", "l"],
  inStock: true,
});

// الحصول على المفضلة
const favorites = await getFavoriteFilters();

// حذف مجموعة
await deleteFavoriteFilters("الملابس الرجالية");
```

### حفظ عمليات البحث الأخيرة

```tsx
import {
  saveRecentSearch,
  getRecentSearches,
} from "@/lib/preferences";

// حفظ البحث مع عدد النتائج
await saveRecentSearch("تي شيرت", 42);

// الحصول على الأخيرة
const recent = await getRecentSearches();
// [
//   { query: "تي شيرت", results: 42, timestamp: 1234567890 },
//   { query: "جينز", results: 28, timestamp: 1234567880 },
// ]
```

---

## 6. أمثلة عملية متكاملة

### مثال 1: شاشة بحث متقدمة

```tsx
import { ScreenContainer } from "@/components/screen-container";
import { SearchInput } from "@/components/search-input";
import { FilterPanel } from "@/components/filter-panel";
import { useSearch } from "@/hooks/use-search";
import { useState } from "react";

export default function SearchScreen() {
  const {
    query,
    searchHistory,
    recentSearches,
    handleSearch,
    handleClear,
  } = useSearch({ saveHistory: true });

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters((prev) => ({ ...prev, [filterId]: value }));
  };

  return (
    <ScreenContainer>
      {/* البحث */}
      <SearchInput
        value={query}
        onChangeText={handleSearch}
        onClear={handleClear}
        history={searchHistory}
        suggestions={["تي شيرت", "جينز", "حذاء"]}
      />

      {/* زر الفلاتر */}
      <TouchableOpacity
        onPress={() => setShowFilters(!showFilters)}
        className="mt-4 py-2 px-4 rounded-lg bg-surface border border-border"
      >
        <Text>الفلاتر</Text>
      </TouchableOpacity>

      {/* لوحة الفلاتر */}
      {showFilters && (
        <FilterPanel
          filters={[
            {
              id: "category",
              label: "الفئة",
              type: "radio",
              options: [
                { id: "all", label: "الكل" },
                { id: "men", label: "رجالي" },
              ],
            },
          ]}
          onFilterChange={handleFilterChange}
          onApply={() => setShowFilters(false)}
          onReset={() => setFilters({})}
        />
      )}

      {/* النتائج */}
      <FlatList
        data={results}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id}
      />
    </ScreenContainer>
  );
}
```

### مثال 2: البحث مع الفلاتر المحفوظة

```tsx
export function SearchWithSavedFilters() {
  const { query, handleSearch } = useSearch();
  const [favoriteFilters, setFavoriteFilters] = useState([]);

  useEffect(() => {
    loadFavoriteFilters();
  }, []);

  const loadFavoriteFilters = async () => {
    const favorites = await getFavoriteFilters();
    setFavoriteFilters(Object.keys(favorites));
  };

  const handleApplyFavorite = async (filterName: string) => {
    const favorites = await getFavoriteFilters();
    const filters = favorites[filterName];
    // تطبيق الفلاتر المحفوظة
    applyFilters(filters);
  };

  return (
    <View>
      <SearchInput onSearch={handleSearch} />

      {/* الفلاتر المحفوظة */}
      <ScrollView horizontal>
        {favoriteFilters.map((name) => (
          <TouchableOpacity
            key={name}
            onPress={() => handleApplyFavorite(name)}
            className="mr-2 px-4 py-2 rounded-full bg-primary"
          >
            <Text className="text-white">{name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
```

---

## 7. أفضل الممارسات

### ✅ افعل

- استخدم debouncing للبحث لتقليل الطلبات
- احفظ سجل البحث للمستخدمين
- وفر suggestions بناءً على البيانات
- اسمح بحفظ مجموعات الفلاتر المفضلة
- عرّض الفلاتر الحالية بوضوح

### ❌ لا تفعل

- لا تنفذ البحث على كل ضغطة مفتاح
- لا تحفظ بيانات حساسة في السجل
- لا تعرض عدد كبير جداً من الـ suggestions
- لا تنسَ تنظيف السجل القديم
- لا تفرض الفلاتر على المستخدم

---

## 8. الخطوات التالية

- [ ] إضافة advanced search operators (AND, OR, NOT)
- [ ] إضافة search analytics
- [ ] تحسين الـ suggestions بالـ AI
- [ ] إضافة voice search
- [ ] تحسين الأداء للبحث الكبير
