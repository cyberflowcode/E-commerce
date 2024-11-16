let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');

// Modal elements
let buyNowModal = document.getElementById('buyNowModal');
let modalProductImage = document.getElementById('modalProductImage');
let modalProductName = document.getElementById('modalProductName');
let modalProductPrice = document.getElementById('modalProductPrice');
let modalQuantity = document.getElementById('modalQuantity');
let modalTotalPrice = document.getElementById('modalTotalPrice');
let modalShippingFee = document.getElementById('modalShippingFee');
let placeOrderButton = document.getElementById('placeOrderButton');
let closeModalButton = document.getElementById('closeModalButton');

let products = [];
let cart = [];
// Checkout Modal elements
let checkoutModal = document.getElementById('checkoutModal');
let closeCheckoutModalButton = document.getElementById('closeCheckoutModalButton');
let placeOrderButtonCheckout = document.getElementById('placeOrderButtonCheckout');

// Open Checkout Modal
document.querySelector('.checkOut').addEventListener('click', () => {
    checkoutModal.style.display = 'flex';
});

// Close Checkout Modal
closeCheckoutModalButton.addEventListener('click', () => {
    checkoutModal.style.display = 'none';
    document.getElementById('checkoutName').value = '';
    document.getElementById('checkoutPhone').value = '';
    document.getElementById('checkoutAddress').value = '';
    document.getElementById('paymentMethod').value = '';
});

// Handle order placement validation and feedback for Checkout
placeOrderButtonCheckout.addEventListener('click', () => {
    let customerName = document.getElementById('checkoutName').value;
    let customerAddress = document.getElementById('checkoutAddress').value;
    let customerPhone = document.getElementById('checkoutPhone').value;

    if (customerName && customerPhone.length === 11 && customerAddress) {
        Swal.fire({ icon: 'success', title: 'Order Placed', text: 'Thank sssyou for your order!' })
            .then(() => resetCheckoutModal());
    } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Please fill all required fields and ensure phone number is 11 digits.' });
    }
});

// Reset Checkout modal content after order is placed
const resetCheckoutModal = () => {
    checkoutModal.style.display = 'none';
    document.getElementById('checkoutName').value = '';
    document.getElementById('checkoutPhone').value = '';
    document.getElementById('checkoutAddress').value = '';
    document.getElementById('paymentMethod').value = '';
};

// =------=-=-=-=-=
// 
// 
// Function to update the display of the checkout modal
// Function to update the display of the checkout modal
// Function to update the display of the checkout modal
const updateCheckoutCartDisplay = () => {
    const checkoutListCartHTML = document.querySelector('#checkoutModal .listCart');
    checkoutListCartHTML.innerHTML = ''; // Clear previous cart items

    let totalItems = 0;  // Total quantity of items
    let totalPrice = 0;  // Total price of items in the cart
    let totalShippingFee = 0; // Total shipping fee

    // Loop through each item in the cart
    cart.forEach(item => {
        let product = products.find(prod => prod.id == item.product_id);
        
        if (product) { // Ensure the product exists
            let cartItem = document.createElement('div');
            cartItem.classList.add('item');
            cartItem.innerHTML = `
                <div class="image"><img src="${product.image}" style="width: 50px;"></div>
                <div class="name">${product.name}</div>
                <div class="totalPrice">₱${formatPrice(product.price * item.quantity)}</div>
                <div class="shippingFee" style="width: 100%;">Shipping Fee: ₱${formatPrice(product.shippingfee)}</div>
            `;
            checkoutListCartHTML.appendChild(cartItem);

            // Update totals
            totalItems += item.quantity; // Count total items
            totalPrice += product.price * item.quantity; // Calculate total price
            totalShippingFee += product.shippingfee; // Add shipping fee for the current item
        } else {
            console.error(`Product with ID ${item.product_id} not found.`);
        }
    });

    // Update the total items and total price in the cart-summary
    document.getElementById('totalItemsCheckout').innerText = totalItems; // Display total items
    document.getElementById('totalShippingFeeCheckout').innerText = formatPrice(totalShippingFee); // Display total shipping fee

    // Calculate final total price (total price + total shipping fee)
    const finalTotalPrice = totalPrice + totalShippingFee;
    document.getElementById('finalTotalPriceCheckout').innerText = formatPrice(finalTotalPrice); // Display final total price including shipping
};
// -----------------------------------
// Open Checkout Modal
document.querySelector('.checkOut').addEventListener('click', () => {
    updateCheckoutCartDisplay(); // Update the cart display in the checkout modal
    document.getElementById('checkoutModal').style.display = 'flex'; // Show the checkout modal
});

// Close Checkout Modal
document.getElementById('closeCheckoutModalButton').addEventListener('click', () => {
    document.getElementById('checkoutModal').style.display = 'none'; // Hide the checkout modal
});
// --------------------------------
// 
// Format price without ".00" if it's a whole number
const formatPrice = (price) => {
    return price % 1 === 0 ? price : price.toFixed(2);
};

// Open modal and display selected product details
const openBuyNowModal = (product) => {
    modalProductImage.src = product.image;
    modalProductName.textContent = product.name;
    modalProductPrice.textContent = formatPrice(product.price);
    modalShippingFee.textContent = formatPrice(product.shippingfee); // Update shipping fee from product data
    modalQuantity.value = 1;
    updateTotalPrice(product.price, product.shippingfee, 1);
    buyNowModal.style.display = 'flex';
};

// Update total price in modal based on quantity and shipping
const updateTotalPrice = (price, shippingFee, quantity) => {
    let total = (price * quantity) + shippingFee;
    modalTotalPrice.textContent = formatPrice(total);
};

// Modal quantity input and total price update
modalQuantity.addEventListener('input', () => {
    let price = parseFloat(modalProductPrice.textContent);
    let shippingFee = parseFloat(modalShippingFee.textContent);
    let quantity = parseInt(modalQuantity.value) || 1;
    modalQuantity.value = quantity < 1 ? 1 : quantity;  // Ensure minimum of 1
    updateTotalPrice(price, shippingFee, modalQuantity.value);
});

// Handle order placement validation and feedback
placeOrderButton.addEventListener('click', () => {
    let customerName = document.getElementById('customerName').value;
    let customerAddress = document.getElementById('customerAddress').value;
    let customerPhone = document.getElementById('customerPhone').value;

    if (customerName && customerPhone.length === 11 && customerAddress) {
        Swal.fire({ icon: 'success', title: 'Order Placed', text: 'Thank you for your order!' })
            .then(() => resetModal());
    } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Please fill all required fields and ensure phone number is 11 digits.' });
    }
});

// Reset modal content after order is placed
const resetModal = () => {
    buyNowModal.style.display = 'none';
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';
    modalQuantity.value = 1;
};

// Add products to HTML
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    products.forEach(product => {
        let newProduct = document.createElement('div');
        newProduct.dataset.id = product.id;
        newProduct.classList.add('item');
        newProduct.innerHTML = `
            <img src="${product.image}" alt=""/>
            <h2>${product.name}</h2>
            <div class="price">₱${formatPrice(product.price)}</div>
            <button class="addCart">Add To Cart</button>
            <button class="buyNow">Buy Now</button>
        `;
        listProductHTML.appendChild(newProduct);

        // Add event listener for the "Add to Cart" button
        const addCartButton = newProduct.querySelector('.addCart');
        addCartButton.addEventListener('click', () => {
            addToCart(product.id); // Pass the product ID to add to cart
        });
    });
};

// Add product to cart or update quantity if already in cart
const addToCart = (product_id) => {
    let itemInCart = cart.find(item => item.product_id == product_id);

    if (itemInCart) {
        itemInCart.quantity += 1;  // Increase quantity if the product is already in the cart
    } else {
        cart.push({ product_id, quantity: 1 }); // Add new product with quantity 1
    }
    updateCartDisplay();  // Update the cart display
    saveCartToMemory();   // Save cart to local storage
};

// Remove product from cart
const removeFromCart = (product_id) => {
    cart = cart.filter(item => item.product_id != product_id);
    updateCartDisplay();
    saveCartToMemory();
};

// Update the cart display
const updateCartDisplay = () => {
    listCartHTML.innerHTML = '';  // Clear the cart view first

    let totalItems = 0;  // To hold the total quantity of items
    let totalPrice = 0;  // To hold the total price of items in the cart

    cart.forEach(item => {
        let product = products.find(prod => prod.id == item.product_id);

        let cartItem = document.createElement('div');
        cartItem.classList.add('item');
        cartItem.dataset.id = item.product_id;
        cartItem.innerHTML = `
            <div class="image"><img src="${product.image}"></div>
            <div class="name">${product.name}</div>
            <div class="totalPrice">₱${formatPrice(product.price * item.quantity)}</div>
            <div class="quantity">
                <span class="minus">⟨</span>
                <span style="padding: 5px">${item.quantity}</span>
                <span class="plus">⟩</span>
            </div>
            <button class="remove-item">x</button>
        `;
        listCartHTML.appendChild(cartItem);

        // Update total items and total price
        totalItems += item.quantity;
        totalPrice += product.price * item.quantity;
    });

    // Update the cart icon to reflect the total quantity
    iconCartSpan.innerText = totalItems;

    // Update the total items and total price in the cart-summary
    document.getElementById('totalItems').innerText = totalItems;
    document.getElementById('totalPrice').innerText = formatPrice(totalPrice);
};

// Save cart data to local storage
const saveCartToMemory = () => localStorage.setItem('cart', JSON.stringify(cart));

// Handle cart item quantity change and item removal
listCartHTML.addEventListener('click', (event) => {
    let product_id = event.target.closest('.item')?.dataset.id;

    if (event.target.classList.contains('minus')) {
        updateCartQuantity(product_id, 'decrement');
    } else if (event.target.classList.contains('plus')) {
        updateCartQuantity(product_id, 'increment');
    } else if (event.target.classList.contains('remove-item')) {
        removeFromCart(product_id);
    }
});

// Update cart item quantity
const updateCartQuantity = (product_id, action) => {
    let item = cart.find(item => item.product_id == product_id);
    if (item) {
        item.quantity = action === 'increment' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        updateCartDisplay();
        saveCartToMemory();
    }
};

// Toggle cart view visibility
iconCart.addEventListener('click', () => body.classList.toggle('showCart'));
closeCart.addEventListener('click', () => body.classList.toggle('showCart'));

// Initialize app (fetch products and cart data)
const initApp = () => {
    fetch('products.json') // Assuming you have a products.json file
        .then(response => response.json())
        .then(data => {
            products = data; // Load products from JSON
            addDataToHTML();  // Render products in the UI
            cart = JSON.parse(localStorage.getItem('cart')) || []; // Load cart from localStorage
            updateCartDisplay(); // Update the cart UI
        });
};

// Set up event listeners for 'Buy Now' button and modal close
listProductHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains('buyNow')) {
        let product = products.find(prod => prod.id == event.target.closest('.item').dataset.id);
        openBuyNowModal(product);
    }
});

closeModalButton.addEventListener('click', () => {
    buyNowModal.style.display = 'none'
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';

});


// Initialize application
initApp();
