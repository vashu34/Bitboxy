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
    renderCart();
    updateOrderSummary();

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




let menuCards = document.querySelectorAll("#menu-items article");
let searchInput = document.getElementById("menu-search");
let searchButton = document.getElementById("search-button");

function searchMenu(searchText) {
    let searchValue = searchText.trim().toLowerCase();

    menuCards.forEach(function (card) {
        let foodName = card.querySelector("h3").textContent.trim().toLowerCase();

        if (foodName.includes(searchValue)) {
            card.style.display = "";
        }
        else {
            card.style.display = "none";
        }
    });

}

if (searchButton) {
    searchButton.addEventListener(
        "click",
        function () {
            searchMenu(
                searchInput.value
            );
        }
    );

}


let categoryCards = document.querySelectorAll("#categories article");

function filterMenu(category) {

    menuCards.forEach(function (card) {
        let cardCategory = card.dataset.category.toLowerCase();

        if (cardCategory === category) {
            card.style.display = "";
        }
        else {
            card.style.display = "none";
        }
    });

}



categoryCards.forEach(
    function (card) {
        card.addEventListener("click", function () {
            let category = card.querySelector("h3").textContent.trim().toLowerCase();
            filterMenu(category);
        }
        );
    }
)

let themeButton = document.getElementById("theme-toggle");


function toggleTheme() {
    document.body.classList.toggle("dark-theme");

    let themeIcon = themeButton.querySelector(".theme-icon");
    let themeText = themeButton.querySelector(".theme-text");

    if (document.body.classList.contains("dark-theme")) {
        themeIcon.textContent = "☾";
        themeText.textContent = "NIGHT MODE";
        localStorage.setItem("biteboxTheme", "dark");
    }
    else {
        themeIcon.textContent = "☀";
        themeText.textContent = "DAY MODE";
        localStorage.setItem("biteboxTheme", "light");

    }
}



function loadTheme() {

    let savedTheme =
        localStorage.getItem(
            "biteboxTheme"
        );


    /* Disable animation while loading */

    document.body.classList.add(
        "theme-loading"
    );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

    }
    else {

        document.body.classList.remove(
            "dark-theme"
        );

    }


    let themeIcon =
        themeButton.querySelector(
            ".theme-icon"
        );


    let themeText =
        themeButton.querySelector(
            ".theme-text"
        );


    if (
        savedTheme === "dark"
    ) {

        if (themeIcon) {

            themeIcon.textContent =
                "☾";

        }


        if (themeText) {

            themeText.textContent =
                "NIGHT MODE";

        }

    }
    else {

        if (themeIcon) {

            themeIcon.textContent =
                "☀";

        }


        if (themeText) {

            themeText.textContent =
                "DAY MODE";

        }

    }


    /* Allow animation again */

    setTimeout(function () {

        document.body.classList.remove(
            "theme-loading"
        );

    }, 50);

}

if (themeButton) {

    themeButton.addEventListener(
        "click",
        function () {

            toggleTheme();

        }
    );

}

renderCart();
updateOrderSummary();

