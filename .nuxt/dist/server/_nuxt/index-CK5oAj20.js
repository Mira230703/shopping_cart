import { mergeProps, useSSRContext, ref, computed, watch, unref } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { publicAssetsURL } from "#internal/nuxt/paths";
import { useRouter } from "vue-router";
import { u as useCart, _ as _sfc_main$2, a as _sfc_main$3 } from "./CartDrawer-BsKmEJV1.js";
import { _ as _export_sfc, a as useNuxtApp } from "../server.mjs";
import "ofetch";
import "/workspaces/shopping_cart/node_modules/hookable/dist/index.mjs";
import "/workspaces/shopping_cart/node_modules/unctx/dist/index.mjs";
import "/workspaces/shopping_cart/node_modules/h3/dist/index.mjs";
import "/workspaces/shopping_cart/node_modules/radix3/dist/index.mjs";
import "/workspaces/shopping_cart/node_modules/defu/dist/defu.mjs";
import "/workspaces/shopping_cart/node_modules/ufo/dist/index.mjs";
const _imports_0 = publicAssetsURL("/hero-shopping.svg");
const _sfc_main$1 = {
  __name: "ProductCard",
  __ssrInlineRender: true,
  props: {
    product: { type: Object, required: true }
  },
  emits: ["add-to-cart", "show-detail"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "border rounded-lg p-6 shadow-md hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105 flex flex-col" }, _attrs))}><div><img${ssrRenderAttr("src", __props.product.image || "/default-product.png")} alt="商品圖片" class="w-full h-56 object-contain mb-4"><h3 class="text-xl font-semibold">${ssrInterpolate(__props.product.name || __props.product.name_zh)}</h3></div><div class="mt-auto"><p class="text-base text-gray-600 mb-2">${ssrInterpolate(__props.product.category)}</p><p class="text-lg font-bold text-[#b9a2a6] mb-4"> $${ssrInterpolate(__props.product.price ?? "未定價")}</p><button class="w-full bg-[#b9a2a6] text-white px-4 py-2 rounded hover:opacity-90"> 加入購物車 </button></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProductCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const pageSize = 20;
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    function goDetail(p) {
      router.push(`/product/${p.id}`);
    }
    const { cart, addToCart, increaseQuantity, decreaseQuantity, clearCart } = useCart();
    const showCart = ref(false);
    const searchQuery = ref("");
    const selectedCategory = ref("全部");
    ref(["全部"]);
    const allProducts = ref([]);
    const page = ref(1);
    const totalPages = ref(1);
    const pending = ref(false);
    const done = ref(false);
    const topProducts = ref([]);
    async function loadProducts() {
      if (pending.value || done.value) return;
      pending.value = true;
      try {
        const res = await $fetch("/api/products", {
          query: {
            page: page.value,
            pageSize,
            q: searchQuery.value,
            category: selectedCategory.value
          }
        });
        if (res?.data?.length) {
          allProducts.value.push(...res.data);
          totalPages.value = res.pagination.totalPages;
          page.value += 1;
          if (page.value > totalPages.value) done.value = true;
        } else {
          done.value = true;
        }
      } catch (e) {
        console.error("載入商品失敗:", e);
      } finally {
        pending.value = false;
      }
    }
    async function loadTop10() {
      try {
        const res = await $fetch("/api/products", {
          query: { page: 1, pageSize: 10, q: searchQuery.value, category: selectedCategory.value }
        });
        topProducts.value = (res?.data || []).map((p) => ({
          ...p,
          image: p.image || "/default-product.png"
        }));
      } catch (e) {
        console.error("載入 Top 10 失敗:", e);
      }
    }
    const filteredProducts = computed(() => {
      const topIds = new Set(topProducts.value.map((p) => p.id));
      return allProducts.value.filter((p) => !topIds.has(p.id)).map((p) => ({
        ...p,
        image: p.image || "/default-product.png"
      }));
    });
    function resetAndSearch() {
      allProducts.value = [];
      page.value = 1;
      totalPages.value = 1;
      done.value = false;
      loadTop10();
      loadProducts();
    }
    let searchTimer;
    watch(searchQuery, () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => resetAndSearch(), 350);
    });
    watch(selectedCategory, () => {
      resetAndSearch();
    });
    const total = computed(
      () => cart.value.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0)
    );
    function formatPrice(value) {
      return new Intl.NumberFormat("zh-TW", {
        style: "decimal",
        maximumFractionDigits: 0
      }).format(value || 0);
    }
    async function checkout() {
      try {
        const res = await $fetch("/api/checkout", { method: "POST", body: cart.value });
        useNuxtApp().$toast?.success?.(res.message || "結帳成功！");
        clearCart();
      } catch (err) {
        console.error(err);
        useNuxtApp().$toast?.error?.("結帳失敗，請稍後再試");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 text-stone-800" }, _attrs))} data-v-e145bf50>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        modelValue: searchQuery.value,
        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
        "cart-count": unref(cart).length,
        onToggleCart: ($event) => showCart.value = !showCart.value
      }, null, _parent));
      _push(`<section class="relative bg-gradient-to-r from-[#b9a2a6] to-[#d7c5c8] text-white py-16 overflow-hidden" data-v-e145bf50><div class="page-container grid md:grid-cols-2 gap-8 items-center" data-v-e145bf50><div class="text-center md:text-left z-10" data-v-e145bf50><h1 class="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg" data-v-e145bf50> 找到你的理想商品 🛍️ </h1><p class="text-lg md:text-xl mb-6 opacity-90" data-v-e145bf50> 精選熱銷款式，優惠限時進行中！ </p><div class="relative max-w-md mx-auto md:mx-0" data-v-e145bf50><span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" data-v-e145bf50> 🔍 </span><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="搜尋你想要的商品..." class="w-full pl-10 pr-4 py-3 rounded-full text-stone-700 shadow-lg focus:ring-2 focus:ring-[#b9a2a6] focus:outline-none" data-v-e145bf50></div></div><div class="hidden md:flex justify-center items-center relative" data-v-e145bf50><img${ssrRenderAttr("src", _imports_0)} alt="購物插畫" class="w-4/5 drop-shadow-xl animate-fadeInUp" draggable="false" data-v-e145bf50></div></div><div class="absolute -top-10 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" data-v-e145bf50></div><div class="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl" data-v-e145bf50></div></section><section class="page-container my-8" data-v-e145bf50><h2 class="text-xl font-bold mb-4" data-v-e145bf50>🔥 熱門前 10 名</h2><div class="flex gap-4 overflow-x-auto pb-2" data-v-e145bf50><!--[-->`);
      ssrRenderList(topProducts.value, (p) => {
        _push(`<div class="min-w-[220px] max-w-[220px] flex-shrink-0 border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer" data-v-e145bf50><img${ssrRenderAttr("src", p.image || "/default-product.png")} alt="商品圖片" class="w-full h-40 object-contain mb-2" data-v-e145bf50><h3 class="text-sm font-semibold truncate" data-v-e145bf50>${ssrInterpolate(p.name || p.name_zh)}</h3><p class="text-xs text-gray-500" data-v-e145bf50>${ssrInterpolate(p.category || "未分類")}</p><p class="text-base font-bold text-[#b9a2a6]" data-v-e145bf50> NT$ ${ssrInterpolate(formatPrice(p.price))}</p><button class="mt-2 w-full bg-[#b9a2a6] text-white text-sm px-2 py-1 rounded hover:opacity-90" data-v-e145bf50> 加入購物車 </button></div>`);
      });
      _push(`<!--]--></div></section><div class="page-container" data-v-e145bf50><h2 class="text-xl font-bold mb-4" data-v-e145bf50>🔥 熱賣商品</h2><main class="product-grid" data-v-e145bf50><!--[-->`);
      ssrRenderList(filteredProducts.value, (p) => {
        _push(ssrRenderComponent(_sfc_main$1, {
          key: p.id,
          product: p,
          onAddToCart: unref(addToCart),
          onShowDetail: ($event) => goDetail(p)
        }, null, _parent));
      });
      _push(`<!--]--></main>`);
      if (pending.value) {
        _push(`<div class="text-center py-6 text-gray-500" data-v-e145bf50>載入中...</div>`);
      } else {
        _push(`<!---->`);
      }
      if (done.value) {
        _push(`<div class="text-center py-6 text-gray-400" data-v-e145bf50>已經到底了</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        cart: unref(cart),
        total: total.value,
        show: showCart.value,
        onIncrease: unref(increaseQuantity),
        onDecrease: unref(decreaseQuantity),
        onCheckout: checkout,
        onClose: ($event) => showCart.value = false
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e145bf50"]]);
export {
  index as default
};
//# sourceMappingURL=index-CK5oAj20.js.map
