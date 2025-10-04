import { ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';

const cart = ref([]);
function useCart() {
  function addToCart(product) {
    const existing = cart.value.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.value.push({ ...product, quantity: 1 });
    }
  }
  function removeFromCart(productId) {
    cart.value = cart.value.filter((item) => item.id !== productId);
  }
  function increaseQuantity(productId) {
    const item = cart.value.find((i) => i.id === productId);
    if (item) item.quantity += 1;
  }
  function decreaseQuantity(productId) {
    const item = cart.value.find((i) => i.id === productId);
    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) removeFromCart(productId);
    }
  }
  function clearCart() {
    cart.value = [];
  }
  return {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
  };
}
const _sfc_main$1 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "Header",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: String, default: "" },
    cartCount: { type: Number, default: 0 }
  },
  emits: ["update:modelValue", "toggle-cart"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const model = computed({
      get: () => props.modelValue,
      set: (val) => emit("update:modelValue", val)
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-between px-6 py-4 bg-white shadow" }, _attrs))}><h1 class="text-xl font-bold">\u{1F6CD}\uFE0F \u5546\u54C1\u5546\u57CE</h1><div class="flex gap-4 items-center"><input id="search"${ssrRenderAttr("value", model.value)} type="text" placeholder="\u641C\u5C0B\u5546\u54C1..." aria-label="\u641C\u5C0B\u5546\u54C1" class="border rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#b9a2a6]"><button class="btn-search relative" aria-label="\u958B\u555F\u8CFC\u7269\u8ECA"> \u{1F6D2} `);
      if (__props.cartCount > 0) {
        _push(`<span class="badge-count">${ssrInterpolate(__props.cartCount)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button></div></header>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "CartDrawer",
  __ssrInlineRender: true,
  props: {
    cart: { type: Array, default: () => [] },
    total: { type: Number, default: 0 },
    show: { type: Boolean, default: false }
  },
  emits: ["close", "increase", "decrease", "checkout", "clear"],
  setup(__props) {
    const formatPrice = (value) => {
      return `NT$${Math.floor(value)}`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<aside${ssrRenderAttrs(mergeProps({ class: "cart-drawer fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-6 overflow-y-auto z-50" }, _attrs))}><div class="flex justify-between items-center mb-4"><h2 class="text-lg font-bold">\u{1F6D2} \u8CFC\u7269\u8ECA</h2><button class="text-stone-500 hover:text-stone-700" aria-label="\u95DC\u9589\u8CFC\u7269\u8ECA"> \u2716 </button></div>`);
        if (__props.cart.length) {
          _push(`<ul class="space-y-3"><!--[-->`);
          ssrRenderList(__props.cart, (item) => {
            _push(`<li class="flex justify-between items-center border-b pb-2"><div><p class="font-semibold">${ssrInterpolate(item.name)}</p><p class="text-sm text-stone-600">${ssrInterpolate(formatPrice(item.price))} \xD7 ${ssrInterpolate(item.quantity)}</p></div><div class="flex items-center gap-2"><button aria-label="\u6E1B\u5C11\u6578\u91CF" class="px-2 py-1 border rounded hover:bg-gray-100"> \u2796 </button><span>${ssrInterpolate(item.quantity)}</span><button aria-label="\u589E\u52A0\u6578\u91CF" class="px-2 py-1 border rounded hover:bg-gray-100"> \u2795 </button></div></li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<p class="text-center text-stone-500 mt-10">\u8CFC\u7269\u8ECA\u662F\u7A7A\u7684</p>`);
        }
        _push(`<div class="absolute bottom-0 left-0 w-full p-4 bg-white border-t"><div class="flex justify-between items-center mb-3"><span class="font-semibold">\u7E3D\u91D1\u984D</span><span class="text-lg font-bold">${ssrInterpolate(formatPrice(__props.total))}</span></div><div class="flex gap-2"><button class="w-1/2 border border-[#b9a2a6] text-[#b9a2a6] rounded px-4 py-2 hover:bg-[#f7f5f6] transition"${ssrIncludeBooleanAttr(!__props.cart.length) ? " disabled" : ""}> \u6E05\u7A7A\u8CFC\u7269\u8ECA </button><button class="w-1/2 bg-[#b9a2a6] text-white rounded px-4 py-2 hover:opacity-90 disabled:opacity-50 transition"${ssrIncludeBooleanAttr(!__props.cart.length) ? " disabled" : ""}> \u7D50\u5E33 </button></div></div></aside>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CartDrawer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main$1 as _, _sfc_main as a, useCart as u };
//# sourceMappingURL=CartDrawer-BsKmEJV1.mjs.map
