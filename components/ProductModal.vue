<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white w-1/2 max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
      <!-- 關閉按鈕 -->
      <button
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- 商品圖片 -->
      <img
        :src="product?.image || '/default-product.png'"
        alt="商品圖片"
        class="w-full h-64 object-contain mb-4"
      />

      <!-- 商品名稱 -->
      <h2 class="text-2xl font-bold mb-2">
        {{ product?.name || product?.name_zh || '未命名商品' }}
      </h2>

      <!-- 商品分類 -->
      <p class="text-sm text-gray-500">
        {{ product?.category || '未分類' }}
      </p>

      <!-- 商品價格 -->
      <p class="text-lg font-bold text-[#b9a2a6] mb-4">
        {{ formatPrice(product?.price) }}
      </p>

      <!-- 商品描述 -->
      <p class="text-gray-700 mb-6">
        {{ product?.description || '沒有詳細介紹' }}
      </p>

      <!-- 加入購物車 -->
      <button
        class="w-full bg-[#b9a2a6] text-white px-4 py-2 rounded hover:opacity-90"
        @click="$emit('add-to-cart', product)"
      >
        加入購物車
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: { type: Object, default: () => ({}) }
})

defineEmits(['close', 'add-to-cart'])

// 價格格式化：整數台幣
const formatPrice = (value) => {
  if (!value) return 'NT$ 0'
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}
</script>
