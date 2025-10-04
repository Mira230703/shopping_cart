<template>
  <transition name="slide">
    <aside
      v-if="show"
      class="cart-drawer fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-6 overflow-y-auto z-50"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">🛒 購物車</h2>
        <button
          @click="$emit('close')"
          class="text-stone-500 hover:text-stone-700"
          aria-label="關閉購物車"
        >
          ✖
        </button>
      </div>

      <!-- Cart Items -->
      <ul v-if="cart.length" class="space-y-3">
        <li
          v-for="item in cart"
          :key="item.id"
          class="flex justify-between items-center border-b pb-2"
        >
          <div>
            <p class="font-semibold">{{ item.name }}</p>
            <p class="text-sm text-stone-600">
              {{ formatPrice(item.price) }} × {{ item.quantity }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="$emit('decrease', item.id)"
              aria-label="減少數量"
              class="px-2 py-1 border rounded hover:bg-gray-100"
            >
              ➖
            </button>
            <span>{{ item.quantity }}</span>
            <button
              @click="$emit('increase', item.id)"
              aria-label="增加數量"
              class="px-2 py-1 border rounded hover:bg-gray-100"
            >
              ➕
            </button>
          </div>
        </li>
      </ul>

      <!-- Empty Cart -->
      <p v-else class="text-center text-stone-500 mt-10">購物車是空的</p>

      <!-- Footer -->
      <div class="absolute bottom-0 left-0 w-full p-4 bg-white border-t">
        <div class="flex justify-between items-center mb-3">
          <span class="font-semibold">總金額</span>
          <span class="text-lg font-bold">{{ formatPrice(total) }}</span>
        </div>

        <!-- 清空購物車 + 結帳 -->
        <div class="flex gap-2">
          <!-- 清空購物車（邊框按鈕） -->
          <button
            @click="$emit('clear')"
            class="w-1/2 border border-[#b9a2a6] text-[#b9a2a6] rounded px-4 py-2 hover:bg-[#f7f5f6] transition"
            :disabled="!cart.length"
          >
            清空購物車
          </button>

          <!-- 結帳（主色） -->
          <button
            @click="$emit('checkout')"
            class="w-1/2 bg-[#b9a2a6] text-white rounded px-4 py-2 hover:opacity-90 disabled:opacity-50 transition"
            :disabled="!cart.length"
          >
            結帳
          </button>
        </div>
      </div>

    </aside>
  </transition>
</template>

<script setup>
const props = defineProps({
  cart: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  show: { type: Boolean, default: false }
})

defineEmits(['close', 'increase', 'decrease', 'checkout', 'clear'])

// 價格格式化（取整數）
const formatPrice = (value) => {
  return `NT$${Math.floor(value)}`
}
</script>
