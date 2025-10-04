<template>
  <div
    class="border rounded-lg p-6 shadow-md hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105 flex flex-col"
    @click="$emit('show-detail', product)"
  >
    <!-- 上半部：圖片 + 名稱 -->
    <div>
      <!-- 商品圖片 -->
      <img
        :src="product.image || '/default-product.png'"
        alt="商品圖片"
        class="w-full h-56 object-contain mb-4"
      />

      <!-- 商品名稱 -->
      <h3 class="text-xl font-semibold">
        {{ product.name || product.name_zh }}
      </h3>
    </div>

    <!-- 下半部：分類 + 價格 + 按鈕 -->
    <div class="mt-auto">
      <!-- 商品分類 -->
      <p class="text-base text-gray-600 mb-2">
        {{ product.category }}
      </p>

      <!-- 商品價格 -->
      <p class="text-lg font-bold text-[#b9a2a6] mb-4">
        ${{ product.price ?? '未定價' }}
      </p>

      <!-- 加入購物車 -->
      <button
        class="w-full bg-[#b9a2a6] text-white px-4 py-2 rounded hover:opacity-90"
        @click.stop="$emit('add-to-cart', product)"
      >
        加入購物車
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: { type: Object, required: true }
})

defineEmits(['add-to-cart', 'show-detail'])
</script>
