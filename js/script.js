// let restaurantName = "BiteBox"
// // alert("Welcome to " + restaurantName + "!")

// let customerName = prompt("Welcome to " + restaurantName + "!\n\n Whats your name ?");
// alert("Hello " + customerName + "!\n\nWelcome to BiteBox.");
// let exploreMenu = confirm(
//     "Would you like to explore our menu?"
// );

// if (exploreMenu) {

//     alert("Great! Let's explore the BiteBox menu.");

// }

// else {

//     alert("No problem! You can explore the menu anytime.");

// }

// let choice = prompt("Choose a BiteBox category:\n" +
//     "1. Pizza\n" +
//     "2. Burgers\n" +
//     "3. Pasta\n" +
//     "4. Desserts"
// );
// switch (choice) {
//     case "1":
//         alert("You selected Pizza!");
//         break;
//     case "2":
//         alert("You selected Burgers!");
//         break;
//     case "3":
//         alert("You selected Pasta!");
//         break;
//     case "4":
//         alert("You selected Desserts!");
//         break;
//     default:
//         alert("Invalid category selection.");
// }

// for (let i = 1; i <= 3; i++) {
//     let food = prompt("Enter food item " + i)
//     let quantity = prompt("Enter quantity for" + food)
//     console.log(food + " - Quantity : " + quantity);
// }

function calculateItemTotal(price, quantity) {
    return price * quantity;
}
function calculateSubtotal() {
    let subtotal = 0;
    let cartRows = document.querySelectorAll("#shopping-cart tbody tr");
    cartRows.forEach(function (row) {
        let priceText = row.children[1].textContent;
        let price = parseFloat(priceText.replace("₹", ""));
        let quantityText = row.querySelector(".quantity-box span").textContent;
        let quantity = parseInt(quantityText);
        let itemTotal = calculateItemTotal(price, quantity);
        subtotal += itemTotal;
    });
    return subtotal;
}

function calculateDeliveryCharge(subtotal) {
    if (subtotal === 0) {
        return 0;
    }
    return 40;
}

function calculatePackagingCharge(subtotal) {
    if (subtotal === 0) {
        return 0;
    }

    return 20;
}

function calculateDiscount(subtotal) {
    if (subtotal > 500) {
        return subtotal * 0.10;
    }
    return 0;
}

function calculateTotal(subtotal, deliveryCharge, packagingCharge, discount) {
    return subtotal + deliveryCharge + packagingCharge - discount;
}

function updateOrderSummary() {
    let subtotalElement = document.getElementById("subtotal-amount");
    if (!subtotalElement) {
        return;
    }
    let subtotal = calculateSubtotal();
    let deliveryCharge = calculateDeliveryCharge(subtotal);
    let packagingCharge = calculatePackagingCharge(subtotal);
    let discount = calculateDiscount(subtotal);
    let totalAmount = calculateTotal(subtotal, deliveryCharge, packagingCharge, discount);
    document.getElementById("subtotal-amount").textContent = "₹" + subtotal.toFixed(2);
    document.getElementById("delivery-amount").textContent = "₹" + deliveryCharge.toFixed(2);
    document.getElementById("packaging-amount").textContent = "₹" + packagingCharge.toFixed(2);
    document.getElementById("discount-amount").textContent = "-₹" + discount.toFixed(2);
    document.getElementById("total-amount").textContent = "₹" + totalAmount.toFixed(2);
}

updateOrderSummary();


let cart = JSON.parse(
    localStorage.getItem("biteboxCart")
) || []


let menuContainer = document.getElementById("menu-items");
if (menuContainer) {
    menuContainer.addEventListener("click", function (event) {
        let button = event.target.closest("button");
        if (!button) {
            return;
        }
        if (button.textContent.includes("Add to Cart")) {

            let card = button.closest("article");

            addToCart(card);
        }
    }
    );
}

function addToCart(card) {
    let name = card.querySelector("h3").textContent.trim();

    let priceText = card.querySelector(".price").textContent;

    let price = parseFloat(priceText.replace("₹", ""));

    let image = card.querySelector("img").getAttribute("src");

    let cartItem = {
        name: name,
        price: price,
        image: image,
        quantity: 1

    };

    let existingItem =
        cart.find(function (item) {
            return item.name === name;
        });

    if (existingItem) {
        existingItem.quantity++;
    }
    else {
        cart.push(cartItem);
    }

    console.log("Name:", name);
    console.log("Price:", price);
    console.log("Image:", image);
    console.log("Cart:", cart);
    localStorage.setItem(
        "biteboxCart",
        JSON.stringify(cart)
    );
    renderCart();
}

let cartBody = document.querySelector("#shopping-cart tbody");

function renderCart() {

    if (!cartBody) {
        return;
    }

    cartBody.innerHTML = "";

    if (cart.length === 0) {

        let row = document.createElement("tr");


        row.innerHTML = `

        <td colspan="5">

            <div class="empty-cart">

                <h3>
                    Your Cart is Empty
                </h3>

                <p>
                    Add some delicious food
                    from our Menu!
                </p>

            </div>

        </td>

    `;


        cartBody.appendChild(row);

        return;

    }
    cart.forEach(function (item, index) {

        let itemTotal = item.price * item.quantity;
        let row = document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="cart-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <div>

                        <h3>
                            ${item.name}
                        </h3>

                    </div>

                </div>

            </td>


            <td>
                ₹${item.price}
            </td>


            <td>

                <div class="quantity-box">

                    <button
                        class="decrease"
                        data-index="${index}">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        class="increase"
                        data-index="${index}">
                        +
                    </button>

                </div>

            </td>


            <td>
                ₹${itemTotal.toFixed(2)}
            </td>


            <td>

                 <a href="#" class="remove-item" data-index="${index}">

    <img src="assets/icons/delete.png" alt="Delete" width="25">

    </a>

            </td>

        `;


        cartBody.appendChild(row);

    });

}

function increaseQuantity(index) {
    cart[index].quantity++;
    localStorage.setItem(
        "biteboxCart",
        JSON.stringify(cart)
    );
    renderCart();
    updateOrderSummary();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem(
            "biteboxCart",
            JSON.stringify(cart)
        );
    }
    renderCart();
    updateOrderSummary();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("biteboxCart", JSON.stringify(cart));

    renderCart();
    updateOrderSummary();

}

function clearCart() {
    cart = [];
    localStorage.removeItem("biteboxCart");
    renderCart();
    updateOrderSummary();
}

let clearCartButton =
    document.getElementById("clear-cart");


if (clearCartButton) {

    clearCartButton.addEventListener(
        "click",
        function () {

            clearCart();

        }
    );

}

if (cartBody) {
    cartBody.addEventListener("click", function (event) {

        let button = event.target.closest("button");

        if (button) {
            let index = parseInt(button.dataset.index);
            if (button.classList.contains("increase")) {
                increaseQuantity(index);
            }

            if (button.classList.contains("decrease")) {
                decreaseQuantity(index);
            }
        }


        let link = event.target.closest("a");
        if (link && link.classList.contains("remove-item")) {
            event.preventDefault();
            let index = parseInt(link.dataset.index);
            removeFromCart(index);
        }

    });
}



renderCart();


