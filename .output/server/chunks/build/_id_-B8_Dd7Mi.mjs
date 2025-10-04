import { ref, watch, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { u as useCart, _ as _sfc_main$1, a as _sfc_main$2 } from './CartDrawer-BsKmEJV1.mjs';
import { a as useNuxtApp } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

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
        console.error("\u53D6\u5F97\u5546\u54C1\u5931\u6557:", e);
        product.value = null;
      } finally {
        pending.value = false;
      }
    }
    async function loadRecommended() {
      var _a;
      try {
        if (!((_a = product.value) == null ? void 0 : _a.name_zh)) return;
        const res = await $fetch("/api/recommendations", {
          query: { item: product.value.name_zh }
          // ← 一律傳英文名稱
        });
        recommended.value = (res == null ? void 0 : res.recommendations) || [];
      } catch (e) {
        if ((e == null ? void 0 : e.statusCode) === 404) {
          console.warn("\u6C92\u6709\u627E\u5230\u63A8\u85A6\u5546\u54C1");
          recommended.value = [];
        } else {
          console.error("\u8F09\u5165\u63A8\u85A6\u5546\u54C1\u5931\u6557:", e);
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
      var _a, _b, _c, _d;
      try {
        const res = await $fetch("/api/checkout", { method: "POST", body: cart.value });
        (_b = (_a = useNuxtApp().$toast) == null ? void 0 : _a.success) == null ? void 0 : _b.call(_a, res.message || "\u7D50\u5E33\u6210\u529F\uFF01");
        clearCart();
      } catch (err) {
        console.error(err);
        (_d = (_c = useNuxtApp().$toast) == null ? void 0 : _c.error) == null ? void 0 : _d.call(_c, "\u7D50\u5E33\u5931\u6557\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66");
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
        _push(`<div class="text-center text-gray-500">\u8F09\u5165\u4E2D...</div>`);
      } else if (!product.value) {
        _push(`<div class="text-center text-red-500">\u627E\u4E0D\u5230\u5546\u54C1</div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div class="flex justify-center items-start"><img${ssrRenderAttr("src", product.value.image || "/default-product.png")} alt="\u5546\u54C1\u5716\u7247" class="w-full max-w-md object-contain rounded-lg border shadow"></div><div class="flex flex-col"><h1 class="text-2xl font-bold mb-4">${ssrInterpolate(product.value.name || product.value.name_zh)}</h1><p class="text-gray-600 mb-2">\u5206\u985E\uFF1A${ssrInterpolate(product.value.category || "\u672A\u5206\u985E")}</p><p class="text-gray-700 leading-relaxed mb-6">${ssrInterpolate(product.value.description || "\u6B64\u5546\u54C1\u66AB\u7121\u8A73\u7D30\u4ECB\u7D39")}</p><p class="text-xl font-bold text-[#b9a2a6] mb-6"> NT$ ${ssrInterpolate(formatPrice(product.value.price))}</p><button class="bg-[#b9a2a6] text-white px-6 py-3 rounded hover:opacity-90 w-full md:w-auto"> \u52A0\u5165\u8CFC\u7269\u8ECA </button></div></div>`);
      }
      _push(`</div>`);
      if (recommended.value.length) {
        _push(`<section class="page-container my-12"><h2 class="text-xl font-bold mb-4">\u2728 \u63A8\u85A6\u5546\u54C1</h2><div class="flex gap-4 overflow-x-auto pb-2"><!--[-->`);
        ssrRenderList(recommended.value, (p) => {
          _push(`<div class="min-w-[220px] max-w-[220px] flex-shrink-0 border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer"><img${ssrRenderAttr("src", p.image || "/default-product.png")} alt="\u5546\u54C1\u5716\u7247" class="w-full h-40 object-contain mb-2"><h3 class="text-sm font-semibold truncate">${ssrInterpolate(p.name || p.name_zh)}</h3><p class="text-xs text-gray-500">${ssrInterpolate(p.category || "\u672A\u5206\u985E")}</p><p class="text-base font-bold text-[#b9a2a6]"> NT$ ${ssrInterpolate(formatPrice(p.price))}</p><button class="mt-2 w-full bg-[#b9a2a6] text-white text-sm px-2 py-1 rounded hover:opacity-90"> \u52A0\u5165\u8CFC\u7269\u8ECA </button></div>`);
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

export { _sfc_main as default };
//# sourceMappingURL=_id_-B8_Dd7Mi.mjs.map
