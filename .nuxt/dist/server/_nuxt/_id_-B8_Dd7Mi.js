import { ref, watch, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { useRoute } from "vue-router";
import { u as useCart, _ as _sfc_main$1, a as _sfc_main$2 } from "./CartDrawer-BsKmEJV1.js";
import { a as useNuxtApp } from "../server.mjs";
import "ofetch";
import "#internal/nuxt/paths";
import "/workspaces/shopping_cart/node_modules/hookable/dist/index.mjs";
import "/workspaces/shopping_cart/node_modules/unctx/dist/index.mjs";
import "/workspaces/shopping_cart/node_modules/h3/dist/index.mjs";
import "/workspaces/shopping_cart/node_modules/radix3/dist/index.mjs";
import "/workspaces/shopping_cart/node_modules/defu/dist/defu.mjs";
import "/workspaces/shopping_cart/node_modules/ufo/dist/index.mjs";
const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { cart, increaseQuantity, decreaseQuantity, clearCart } = useCart();
    const showCart = ref(false);
    const searchQuery = ref("");
    const product = ref(null);
    const pending = ref(true);
    const recommended = ref([]);
    async function fetchProduct() {
      try {
        const res = await $fetch(`/api/product/${route.params.id}`);
        product.value = res;
      } catch (e) {
        console.error("取得商品失敗:", e);
        product.value = null;
      } finally {
        pending.value = false;
      }
    }
    async function loadRecommended() {
      try {
        if (!product.value?.name_zh) return;
        const res = await $fetch("/api/recommendations", {
          query: { item: product.value.name_zh }
          // ← 一律傳英文名稱
        });
        recommended.value = res?.recommendations || [];
      } catch (e) {
        if (e?.statusCode === 404) {
          console.warn("沒有找到推薦商品");
          recommended.value = [];
        } else {
          console.error("載入推薦商品失敗:", e);
          recommended.value = [];
        }
      }
    }
    watch(() => route.params.id, async () => {
      pending.value = true;
      product.value = null;
      recommended.value = [];
      await fetchProduct();
      await loadRecommended();
    });
    const total = computed(
      () => cart.value.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0)
    );
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
    function formatPrice(value) {
      return new Intl.NumberFormat("zh-TW", {
        style: "decimal",
        maximumFractionDigits: 0
      }).format(value || 0);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 text-stone-800" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        modelValue: searchQuery.value,
        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
        "cart-count": unref(cart).length,
        onToggleCart: ($event) => showCart.value = !showCart.value
      }, null, _parent));
      _push(`<div class="page-container py-8">`);
      if (pending.value) {
        _push(`<div class="text-center text-gray-500">載入中...</div>`);
      } else if (!product.value) {
        _push(`<div class="text-center text-red-500">找不到商品</div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div class="flex justify-center items-start"><img${ssrRenderAttr("src", product.value.image || "/default-product.png")} alt="商品圖片" class="w-full max-w-md object-contain rounded-lg border shadow"></div><div class="flex flex-col"><h1 class="text-2xl font-bold mb-4">${ssrInterpolate(product.value.name || product.value.name_zh)}</h1><p class="text-gray-600 mb-2">分類：${ssrInterpolate(product.value.category || "未分類")}</p><p class="text-gray-700 leading-relaxed mb-6">${ssrInterpolate(product.value.description || "此商品暫無詳細介紹")}</p><p class="text-xl font-bold text-[#b9a2a6] mb-6"> NT$ ${ssrInterpolate(formatPrice(product.value.price))}</p><button class="bg-[#b9a2a6] text-white px-6 py-3 rounded hover:opacity-90 w-full md:w-auto"> 加入購物車 </button></div></div>`);
      }
      _push(`</div>`);
      if (recommended.value.length) {
        _push(`<section class="page-container my-12"><h2 class="text-xl font-bold mb-4">✨ 推薦商品</h2><div class="flex gap-4 overflow-x-auto pb-2"><!--[-->`);
        ssrRenderList(recommended.value, (p) => {
          _push(`<div class="min-w-[220px] max-w-[220px] flex-shrink-0 border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer"><img${ssrRenderAttr("src", p.image || "/default-product.png")} alt="商品圖片" class="w-full h-40 object-contain mb-2"><h3 class="text-sm font-semibold truncate">${ssrInterpolate(p.name || p.name_zh)}</h3><p class="text-xs text-gray-500">${ssrInterpolate(p.category || "未分類")}</p><p class="text-base font-bold text-[#b9a2a6]"> NT$ ${ssrInterpolate(formatPrice(p.price))}</p><button class="mt-2 w-full bg-[#b9a2a6] text-white text-sm px-2 py-1 rounded hover:opacity-90"> 加入購物車 </button></div>`);
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$2, {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_id_-B8_Dd7Mi.js.map
