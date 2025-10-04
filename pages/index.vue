<template>
  <div class="min-h-screen bg-gray-50 text-stone-800">
    <!-- Header -->
    <Header
      v-model="searchQuery"
      :cart-count="cart.length"
      @toggle-cart="showCart = !showCart"
    />

    <!-- Hero 區塊（美化版） -->
    <section class="relative bg-gradient-to-r from-[#b9a2a6] to-[#d7c5c8] text-white py-16 overflow-hidden">
      <div class="page-container grid md:grid-cols-2 gap-8 items-center">
        <!-- 左邊：文字 -->
        <div class="text-center md:text-left z-10">
          <h1 class="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            找到你的理想商品 🛍️
          </h1>
          <p class="text-lg md:text-xl mb-6 opacity-90">
            精選熱銷款式，優惠限時進行中！
          </p>
          <!-- 搜尋框 -->
          <div class="relative max-w-md mx-auto md:mx-0">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜尋你想要的商品..."
              class="w-full pl-10 pr-4 py-3 rounded-full text-stone-700 shadow-lg focus:ring-2 focus:ring-[#b9a2a6] focus:outline-none"
            />
          </div>
        </div>

        <!-- 右邊：插圖 -->
        <div class="hidden md:flex justify-center items-center relative">
          <!-- ✅ 注意：這裡一定要用 /hero-shopping.svg 才會讀 public 資料夾 -->
          <img
            src="/hero-shopping.svg"
            alt="購物插畫"
            class="w-4/5 drop-shadow-xl animate-fadeInUp"
            draggable="false"
          />
        </div>
      </div>

      <!-- 背景裝飾圓圈 -->
      <div class="absolute -top-10 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
    </section>


    <!-- 🔥 Top 10 熱門商品 -->
    <section class="page-container my-8">
      <h2 class="text-xl font-bold mb-4">🔥 熱門前 10 名</h2>
      <div class="flex gap-4 overflow-x-auto pb-2">
        <div
          v-for="p in topProducts"
          :key="p.id"
          class="min-w-[220px] max-w-[220px] flex-shrink-0 border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer"
          @click="$router.push(`/product/${p.id}`)"
        >
          <img
            :src="p.image || '/default-product.png'"
            alt="商品圖片"
            class="w-full h-40 object-contain mb-2"
            @error="e => e.target.src = '/default-product.png'"
          />
          <h3 class="text-sm font-semibold truncate">{{ p.name || p.name_zh }}</h3>
          <p class="text-xs text-gray-500">{{ p.category || '未分類' }}</p>
          <p class="text-base font-bold text-[#b9a2a6]">
            NT$ {{ formatPrice(p.price) }}
          </p>
          <button
            class="mt-2 w-full bg-[#b9a2a6] text-white text-sm px-2 py-1 rounded hover:opacity-90"
            @click.stop="addToCart(p)"
          >
            加入購物車
          </button>
        </div>
      </div>
    </section>

    <!-- 熱賣商品 (無限滾動，下方清單) -->
    <div class="page-container">
      <h2 class="text-xl font-bold mb-4">🔥 熱賣商品</h2>

      <main class="product-grid">
        <ProductCard
          v-for="p in filteredProducts"
          :key="p.id"
          :product="p"
          @add-to-cart="addToCart"
          @show-detail="goDetail(p)"
        />
      </main>

      <!-- loading & 已到底 -->
      <div v-if="pending" class="text-center py-6 text-gray-500">載入中...</div>
      <div v-if="done" class="text-center py-6 text-gray-400">已經到底了</div>
    </div>

    <!-- 購物車 -->
    <CartDrawer
      :cart="cart"
      :total="total"
      :show="showCart"
      @increase="increaseQuantity"
      @decrease="decreaseQuantity"
      @checkout="checkout"
      @close="showCart = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '~/composables/useCart'
import Header from '~/components/Header.vue'
import ProductCard from '~/components/ProductCard.vue'
import CartDrawer from '~/components/CartDrawer.vue'

// router
const router = useRouter()
function goDetail(p) {
  router.push(`/product/${p.id}`)
}

// 購物車
const { cart, addToCart, increaseQuantity, decreaseQuantity, clearCart } = useCart()

// UI 狀態
const showCart = ref(false)

// 查詢條件
const searchQuery = ref('')
const selectedCategory = ref('全部')

// 商品分類 (從 API 抓)
const categories = ref(['全部'])
async function loadCategories() {
  try {
    const res = await $fetch('/api/categories?page=1&limit=50')
    if (res && res.length) {
      categories.value = ['全部', ...res]
    }
  } catch (err) {
    console.error('載入分類失敗:', err)
  }
}

// 分頁 & 無限滾動狀態
const allProducts = ref([])
const page = ref(1)
const pageSize = 20
const totalPages = ref(1)
const pending = ref(false)
const done = ref(false)

// Top 10
const topProducts = ref([])

// API 載入
async function loadProducts() {
  if (pending.value || done.value) return
  pending.value = true
  try {
    const res = await $fetch('/api/products', {
      query: {
        page: page.value,
        pageSize,
        q: searchQuery.value,
        category: selectedCategory.value
      }
    })
    if (res?.data?.length) {
      allProducts.value.push(...res.data)
      totalPages.value = res.pagination.totalPages
      page.value += 1
      if (page.value > totalPages.value) done.value = true
    } else {
      done.value = true
    }
  } catch (e) {
    console.error('載入商品失敗:', e)
  } finally {
    pending.value = false
  }
}

// Top 10 熱門商品
async function loadTop10() {
  try {
    const res = await $fetch('/api/products', {
      query: { page: 1, pageSize: 10, q: searchQuery.value, category: selectedCategory.value }
    })
    topProducts.value = (res?.data || []).map(p => ({
      ...p,
      image: p.image || '/default-product.png'
    }))
  } catch (e) {
    console.error('載入 Top 10 失敗:', e)
  }
}

// 過濾後的商品（排除 Top 10）
const filteredProducts = computed(() => {
  const topIds = new Set(topProducts.value.map(p => p.id))
  return allProducts.value
    .filter(p => !topIds.has(p.id))
    .map(p => ({
      ...p,
      image: p.image || '/default-product.png'
    }))
})

// 捲到底自動載入
function handleScroll() {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
  if (nearBottom && !pending.value && !done.value) loadProducts()
}

// 條件變更時重置
function resetAndSearch() {
  allProducts.value = []
  page.value = 1
  totalPages.value = 1
  done.value = false
  loadTop10()
  loadProducts()
}

// 搜尋 debounce
let searchTimer
watch(searchQuery, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => resetAndSearch(), 350)
})

// 分類變更 → 重查
watch(selectedCategory, () => {
  resetAndSearch()
})

onMounted(() => {
  loadTop10()
  loadProducts()
  loadCategories()
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 金額
const total = computed(() =>
  cart.value.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0)
)

// 格式化金額
function formatPrice(value) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(value || 0)
}

// 結帳
async function checkout() {
  try {
    const res = await $fetch('/api/checkout', { method: 'POST', body: cart.value })
    useNuxtApp().$toast?.success?.(res.message || '結帳成功！')
    clearCart()
  } catch (err) {
    console.error(err)
    useNuxtApp().$toast?.error?.('結帳失敗，請稍後再試')
  }
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
