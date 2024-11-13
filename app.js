let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];
//-----------------------------modal// Variables for the modal elements
// Variables for the modal elements
let buyNowModal = document.getElementById('buyNowModal');
let modalProductImage = document.getElementById('modalProductImage');
let modalProductName = document.getElementById('modalProductName');
let modalProductPrice = document.getElementById('modalProductPrice');
let modalQuantity = document.getElementById('modalQuantity');
let modalTotalPrice = document.getElementById('modalTotalPrice');
let placeOrderButton = document.getElementById('placeOrderButton');
let closeModalButton = document.getElementById('closeModalButton');

const SHIPPING_FEE = 320.00;

// Function to open the modal with product details
const openBuyNowModal = (product) => {
    modalProductImage.src = product.image;
    modalProductName.textContent = product.name;
    modalProductPrice.textContent = product.price.toFixed(2);
    modalQuantity.value = 1;  // Default quantity
    updateTotalPrice(product.price, 1);

    buyNowModal.style.display = 'flex';
};

// Function to update total price in the modal
const updateTotalPrice = (price, quantity) => {
    let total = (price * quantity) + SHIPPING_FEE;
    modalTotalPrice.textContent = total.toFixed(2);
};

// Event listener for quantity input change
modalQuantity.addEventListener('input', () => {
    let price = parseFloat(modalProductPrice.textContent);
    let quantity = parseInt(modalQuantity.value);

    // Check if the quantity is valid (greater than 0)
    if (isNaN(quantity) || quantity <= 0) {
        // Set to 1 if quantity is invalid (empty or less than 1)
        modalQuantity.value = 1;
        quantity = 1;
    }

    // Update the total price
    updateTotalPrice(price, quantity);
});


// Event listener for "Place Order" button
placeOrderButton.addEventListener('click', () => {
    let customerName = document.getElementById('customerName').value;
    let customerAddress = document.getElementById('customerAddress').value;
    let customerPhone = document.getElementById('customerPhone').value;

    if (customerPhone.length !== 10) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Phone Number',
            text: 'Please enter a 10-digit phone number.',
        });
        return; // Stop form submission if validation fails
    }
    if (customerName && customerPhone && customerAddress) {
        Swal.fire({
            icon: 'success',
            title: 'Order Placed',
            text: 'Thank you for your order!',
        }).then(() => {
            // Reset modal form fields
            document.getElementById('customerName').value = '';
            document.getElementById('customerPhone').value = '';
            document.getElementById('customerAddress').value = '';
            
            // Reset quantity to 1 and recalculate total price
            modalQuantity.value = 1;
            let price = parseFloat(modalProductPrice.textContent);
            updateTotalPrice(price, 1);
            
            // Close the modal
            buyNowModal.style.display = 'none';
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please fill all required fields!',
        }).then(() => {
            // Reset quantity to 1 even if there was an error
            modalQuantity.value = 1;
            let price = parseFloat(modalProductPrice.textContent);
            updateTotalPrice(price, 1);
        });
    }
});


// Event listener to close the modal
closeModalButton.addEventListener('click', () => {
    buyNowModal.style.display = 'none';
});

// Event listener for "Buy Now" button
listProductHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains('buyNow')) {
        let id_product = event.target.parentElement.dataset.id;
        let product = products.find(prod => prod.id == id_product);
        if (product) {
            openBuyNowModal(product);
        }
    }
});


//------------------------------------------------- Modal
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const addDataToHTML = () => {
    // Remove data from the HTML first (if any)
    listProductHTML.innerHTML = '';

    // Add new data (products)
    if (products.length > 0) { // If there is product data
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">₱${product.price}</div>
                <button class="addCart">Add To Cart</button>
                <button class="buyNow">Buy Now</button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
};

// Event listener for adding to cart
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }

});
// Remove this duplicate event listener in addCartToHTML function
// listCartHTML.addEventListener('click', (event) => { ... });

// Remove product from the cart
const removeFromCart = (product_id) => {
    // Find the index of the product in the cart
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);

    if (positionItemInCart >= 0) {
        // Remove the product from the cart
        cart.splice(positionItemInCart, 1);
    }

    // Update the cart UI and local storage
    addCartToHTML();
    addCartToMemory();
};


// Add product to cart
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }

    addCartToHTML();
    addCartToMemory();
};

// Store cart data in local storage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Update the cart UI with the current products and quantities
// Update the cart UI with the current products and quantities
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];

            // Create new item element for each product in cart
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            // Add product info (name, image, total price for this product, quantity)
            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">${info.name}</div>
                <div class="totalPrice">₱${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus">—</span>
                    <span>${item.quantity}</span>
                    <span class="plus";">+</span>
                </div>
                <button class="remove-item">X</button>
            `;

            listCartHTML.appendChild(newItem);

            // Calculate the total price of the cart
            totalPrice += info.price * item.quantity;
        });
    }

    // Update the total items and total price in the cart summary
    document.getElementById('totalItems').textContent = totalQuantity;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);

    // Update the cart icon with the total quantity
    iconCartSpan.innerText = totalQuantity;
};


// Cart item quantity change (plus/minus)
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
    
    // Handle remove item from cart
    if (positionClick.classList.contains('remove-item')) {
        let product_id = positionClick.parentElement.dataset.id;
        removeFromCart(product_id);  // Call removeFromCart function
    }
});

// Handle quantity change (plus/minus) in the cart
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity += 1;
                break;
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
};


// Initialize app (fetch products and cart data)
const initApp = () => {
    // Get product data
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();

            // Get cart data from memory
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
};

initApp();
