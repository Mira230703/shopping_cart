import { ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { useRouter } from 'vue-router';
import { u as useCart, _ as _sfc_main$1$1, a as _sfc_main$2 } from './CartDrawer-BsKmEJV1.mjs';
import { _ as _export_sfc, a as useNuxtApp } from './server.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

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
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "border rounded-lg p-6 shadow-md hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105 flex flex-col" }, _attrs))}><div><img${ssrRenderAttr("src", __props.product.image || "/default-product.png")} alt="\u5546\u54C1\u5716\u7247" class="w-full h-56 object-contain mb-4"><h3 class="text-xl font-semibold">${ssrInterpolate(__props.product.name || __props.product.name_zh)}</h3></div><div class="mt-auto"><p class="text-base text-gray-600 mb-2">${ssrInterpolate(__props.product.category)}</p><p class="text-lg font-bold text-[#b9a2a6] mb-4"> $${ssrInterpolate((_a = __props.product.price) != null ? _a : "\u672A\u5B9A\u50F9")}</p><button class="w-full bg-[#b9a2a6] text-white px-4 py-2 rounded hover:opacity-90"> \u52A0\u5165\u8CFC\u7269\u8ECA </button></div></div>`);
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
    const selectedCategory = ref("\u5168\u90E8");
    ref(["\u5168\u90E8"]);
    const allProducts = ref([]);
    const page = ref(1);
    const totalPages = ref(1);
    const pending = ref(false);
    const done = ref(false);
    const topProducts = ref([]);
    async function loadProducts() {
      var _a;
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
        if ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.length) {
          allProducts.value.push(...res.data);
          totalPages.value = res.pagination.totalPages;
          page.value += 1;
          if (page.value > totalPages.value) done.value = true;
        } else {
          done.value = true;
        }
      } catch (e) {
        console.error("\u8F09\u5165\u5546\u54C1\u5931\u6557:", e);
      } finally {
        pending.value = false;
      }
    }
    async function loadTop10() {
      try {
        const res = await $fetch("/api/products", {
          query: { page: 1, pageSize: 10, q: searchQuery.value, category: selectedCategory.value }
        });
        topProducts.value = ((res == null ? void 0 : res.data) || []).map((p) => ({
          ...p,
          image: p.image || "/default-product.png"
        }));
      } catch (e) {
        console.error("\u8F09\u5165 Top 10 \u5931\u6557:", e);
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 text-stone-800" }, _attrs))} data-v-e145bf50>`);
      _push(ssrRenderComponent(_sfc_main$1$1, {
        modelValue: searchQuery.value,
        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
        "cart-count": unref(cart).length,
        onToggleCart: ($event) => showCart.value = !showCart.value
      }, null, _parent));
      _push(`<section class="relative bg-gradient-to-r from-[#b9a2a6] to-[#d7c5c8] text-white py-16 overflow-hidden" data-v-e145bf50><div class="page-container grid md:grid-cols-2 gap-8 items-center" data-v-e145bf50><div class="text-center md:text-left z-10" data-v-e145bf50><h1 class="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg" data-v-e145bf50> \u627E\u5230\u4F60\u7684\u7406\u60F3\u5546\u54C1 \u{1F6CD}\uFE0F </h1><p class="text-lg md:text-xl mb-6 opacity-90" data-v-e145bf50> \u7CBE\u9078\u71B1\u92B7\u6B3E\u5F0F\uFF0C\u512A\u60E0\u9650\u6642\u9032\u884C\u4E2D\uFF01 </p><div class="relative max-w-md mx-auto md:mx-0" data-v-e145bf50><span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" data-v-e145bf50> \u{1F50D} </span><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="\u641C\u5C0B\u4F60\u60F3\u8981\u7684\u5546\u54C1..." class="w-full pl-10 pr-4 py-3 rounded-full text-stone-700 shadow-lg focus:ring-2 focus:ring-[#b9a2a6] focus:outline-none" data-v-e145bf50></div></div><div class="hidden md:flex justify-center items-center relative" data-v-e145bf50><img${ssrRenderAttr("src", _imports_0)} alt="\u8CFC\u7269\u63D2\u756B" class="w-4/5 drop-shadow-xl animate-fadeInUp" draggable="false" data-v-e145bf50></div></div><div class="absolute -top-10 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" data-v-e145bf50></div><div class="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl" data-v-e145bf50></div></section><section class="page-container my-8" data-v-e145bf50><h2 class="text-xl font-bold mb-4" data-v-e145bf50>\u{1F525} \u71B1\u9580\u524D 10 \u540D</h2><div class="flex gap-4 overflow-x-auto pb-2" data-v-e145bf50><!--[-->`);
      ssrRenderList(topProducts.value, (p) => {
        _push(`<div class="min-w-[220px] max-w-[220px] flex-shrink-0 border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer" data-v-e145bf50><img${ssrRenderAttr("src", p.image || "/default-product.png")} alt="\u5546\u54C1\u5716\u7247" class="w-full h-40 object-contain mb-2" data-v-e145bf50><h3 class="text-sm font-semibold truncate" data-v-e145bf50>${ssrInterpolate(p.name || p.name_zh)}</h3><p class="text-xs text-gray-500" data-v-e145bf50>${ssrInterpolate(p.category || "\u672A\u5206\u985E")}</p><p class="text-base font-bold text-[#b9a2a6]" data-v-e145bf50> NT$ ${ssrInterpolate(formatPrice(p.price))}</p><button class="mt-2 w-full bg-[#b9a2a6] text-white text-sm px-2 py-1 rounded hover:opacity-90" data-v-e145bf50> \u52A0\u5165\u8CFC\u7269\u8ECA </button></div>`);
      });
      _push(`<!--]--></div></section><div class="page-container" data-v-e145bf50><h2 class="text-xl font-bold mb-4" data-v-e145bf50>\u{1F525} \u71B1\u8CE3\u5546\u54C1</h2><main class="product-grid" data-v-e145bf50><!--[-->`);
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
        _push(`<div class="text-center py-6 text-gray-500" data-v-e145bf50>\u8F09\u5165\u4E2D...</div>`);
      } else {
        _push(`<!---->`);
      }
      if (done.value) {
        _push(`<div class="text-center py-6 text-gray-400" data-v-e145bf50>\u5DF2\u7D93\u5230\u5E95\u4E86</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e145bf50"]]);

export { index as default };
//# sourceMappingURL=index-CK5oAj20.mjs.map
