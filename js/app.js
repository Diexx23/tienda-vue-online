const { createApp } = Vue;

createApp({

    data() {
        return {
            products: [],
            searchQuery: "",
            cart: [],
            isLoading: true,
            cartVisible: false
        };
    },

    computed: {

        filteredProducts() {
            return this.products.filter(product =>
                product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

    },

    methods: {

        async loadProductsFromJson() {
            try {
                const response = await fetch("data/products.json");

                if (!response.ok) {
                    throw new Error("Error loading products");
                }

                const data = await response.json();
                this.products = data;
                this.isLoading = false;

            } catch (error) {
                console.error(error);
            }
        },

        toggleProductInCart(productId) {
            const index = this.cart.indexOf(productId);

            if (index === -1) {
                this.cart.push(productId);
            } else {
                this.cart.splice(index, 1);
            }
        },

        isProductInCart(productId) {
            return this.cart.includes(productId);
        },

        formatPrice(price) {
            return price.toLocaleString("es-CO");
        },

        toggleCartVisibility() {
            this.cartVisible = !this.cartVisible;
        }

    },

    mounted() {
        this.loadProductsFromJson();
    }

})

.component("product-card", {
    props: ["product", "isInCart"],
    emits: ["toggle-cart"],

    data() {
        return {
            currentImageIndex: 0,
            intervalId: null
        };
    },

    mounted() {
        this.startImageCarousel();
    },

    beforeUnmount() {
        clearInterval(this.intervalId);
    },

    methods: {

        startImageCarousel() {
            this.intervalId = setInterval(() => {
                this.currentImageIndex =
                    (this.currentImageIndex + 1) % this.product.images.length;
            }, 2500);
        }

    },

    template: `
        <div class="bg-white rounded-2xl shadow-md p-4 transition duration-300 hover:shadow-xl hover:-translate-y-1">

            <div class="relative overflow-hidden rounded-lg mb-3">
                <img 
                    :src="product.images[currentImageIndex]"
                    class="w-full h-72 object-cover transition duration-500"
                >
            </div>

            <h2 class="text-lg font-semibold">
                {{ product.name }}
            </h2>

            <p class="text-gray-800 font-bold mb-3">
                $ {{ product.price.toLocaleString('es-CO') }}
            </p>

            <button 
                @click="$emit('toggle-cart', product.id)"
                :class="{
                    'bg-green-600': isInCart,
                    'bg-black': !isInCart
                }"
                class="w-full text-white py-2 rounded-lg transition"
            >
                {{ isInCart ? 'Agregado ✓' : 'Agregar al carrito' }}
            </button>

        </div>
    `
})

.mount("#app");