<template>
  <div class="min-h-screen bg-gray-50 text-stone-800">
    <!-- Header -->
    <Header    
      v-model="searchQuery"
      :cart-count="cart.length"
      @toggle-cart="showCart = !showCart"
    />


    <div class="page-container py-8">
      <div v-if="pending" class="text-center text-gray-500">載入中...</div>
      <div v-else-if="!product" class="text-center text-red-500">找不到商品</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- 圖片 -->
        <div class="flex justify-center items-start">
          <img
            :src="product.image || '/default-product.png'"
            alt="商品圖片"
            class="w-full max-w-md object-contain rounded-lg border shadow"
          />
        </div>

        <!-- 商品資訊 -->
        <div class="flex flex-col">
          <h1 class="text-2xl font-bold mb-4">{{ product.name || product.name_zh }}</h1>
          <p class="text-gray-600 mb-2">分類：{{ product.category || '未分類' }}</p>
          <p class="text-gray-700 leading-relaxed mb-6">
            {{ product.description || '此商品暫無詳細介紹' }}
          </p>
          <p class="text-xl font-bold text-[#b9a2a6] mb-6">
            NT$ {{ formatPrice(product.price) }}
          </p>

          <!-- 加入購物車 -->
          <button
            class="bg-[#b9a2a6] text-white px-6 py-3 rounded hover:opacity-90 w-full md:w-auto"
            @click="addToCart(product)"
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>

    <!-- 推薦商品 -->
    <section class="page-container my-12" v-if="recommended.length">
      <h2 class="text-xl font-bold mb-4">✨ 推薦商品</h2>
      <div class="flex gap-4 overflow-x-auto pb-2">
        <div
          v-for="p in recommended"
          :key="p.id"
          class="min-w-[220px] max-w-[220px] flex-shrink-0 border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer"
          @click="$router.push(`/product/${p.id}`)"
        >
          <img
            :src="p.image || '/default-product.png'"
            alt="商品圖片"
            class="w-full h-40 object-contain mb-2"
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

    <!-- 購物車 -->
    <CartDrawer
      :cart="cart"
      :total="total"
      :show="showCart"
      @increase="increaseQuantity"
      @decrease="decreaseQuantity"
      @checkout="checkout"
      @close="showCart = false"
      @clear="clearCart"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCart } from '~/composables/useCart'
import Header from '~/components/Header.vue'
import CartDrawer from '~/components/CartDrawer.vue'

const route = useRoute()
const { cart, addToCart, increaseQuantity, decreaseQuantity, clearCart } = useCart()

const showCart = ref(false)
const searchQuery = ref('')
const product = ref(null)
const pending = ref(true)

// ⭐ 推薦商品列表
const recommended = ref([])

async function fetchProduct() {
  try {
    const res = await $fetch(`/api/product/${route.params.id}`)
    product.value = res
  } catch (e) {
    console.error('取得商品失敗:', e)
    product.value = null
  } finally {
    pending.value = false
  }
}

// ⭐ 撈推薦結果（快速修正版：固定傳英文名稱）
async function loadRecommended() {
  try {
    if (!product.value?.name_zh) return
    const res = await $fetch('/api/recommendations', {
      query: { item: product.value.name_zh } // ← 一律傳英文名稱
    })
    recommended.value = res?.recommendations || []
  } catch (e) {
    if (e?.statusCode === 404) {
      console.warn('沒有找到推薦商品')
      recommended.value = []
    } else {
      console.error('載入推薦商品失敗:', e)
      recommended.value = []
    }
  }
}

// 初始化載入
onMounted(async () => {
  await fetchProduct()
  await loadRecommended()
})

// 切換路由參數（例如點推薦卡片進入另一個商品）時，重新撈資料
watch(() => route.params.id, async () => {
  pending.value = true
  product.value = null
  recommended.value = []
  await fetchProduct()
  await loadRecommended()
})

const total = computed(() =>
  cart.value.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0)
)

async function checkout() {
  try {
    console.log('[CartDrawer] 結帳中，購物車內容：', cart.value)
    const res = await $fetch('/api/checkout', { method: 'POST', body: cart.value })
    console.log('[CartDrawer] 結帳結果：', res)
    useNuxtApp().$toast?.success?.(res.message || '結帳成功！')
    clearCart()
  } catch (err) {
    console.error('[CartDrawer] 結帳失敗：', err)
    useNuxtApp().$toast?.error?.('結帳失敗，請稍後再試')
  }
}


function formatPrice(value) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(value || 0)
}
</script>


