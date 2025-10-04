import { ref } from 'vue'

const cart = ref([])

export function useCart() {
  // ➕ 加入購物車
  function addToCart(product) {
    const existing = cart.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      cart.value.push({ ...product, quantity: 1 })
    }
  }

  // ❌ 移除單一商品
  function removeFromCart(productId) {
    cart.value = cart.value.filter(item => item.id !== productId)
  }

  // ⬆ 增加數量
  function increaseQuantity(productId) {
    const item = cart.value.find(i => i.id === productId)
    if (item) item.quantity += 1
  }

  // ⬇ 減少數量
  function decreaseQuantity(productId) {
    const item = cart.value.find(i => i.id === productId)
    if (item) {
      item.quantity -= 1
      if (item.quantity <= 0) removeFromCart(productId)
    }
  }

  // 🧹 清空購物車
  function clearCart() {
    cart.value = []
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
  }
}
