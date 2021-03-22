// ************************************************
// Budget Website
// ************************************************

// Expenses JS code
class UI {
    constructor() {

        this.expenseFeedback = document.querySelector(".expense-feedback");

        this.expenseAmount = document.getElementById("expense-amount");

        this.expenseForm = document.getElementById("expense-form");
        this.expenseInput = document.getElementById("expense-input");
        this.amountInput = document.getElementById("amount-input");
        this.expenseList = document.getElementById("expense-list");
        this.itemList = [];
        this.itemID = 0;
    }
    showBalance() {
        const expense = this.totalExpense();
        console.log("Expense = " + expense);


        //$('.total-balance').html(totalCart());
        $('.total-expenses').html(expense);

        $('.total-balance').html(ServiceCart.totalCart() - expense);
        return expense;
    }
    // submit expense
    submitExpenseForm() {
        const expenseValue = this.expenseInput.value;
        const amountValue = this.amountInput.value;
        console.log(amountValue);


        if (expenseValue === "" || amountValue === "" || amountValue < 0) {
            this.expenseFeedback.classList.add("showItem");
            this.expenseFeedback.innerHTML = `<p>values cannot be empty or negative</p>`;
            const self = this;
            setTimeout(function () {
                self.expenseFeedback.classList.remove("showItem");
            }, 3000);
        } else {
            let amount = parseInt(amountValue);
            this.expenseInput.value = "";
            this.amountInput.value = "";
            let expense = {
                id: this.itemID,
                title: expenseValue,
                amount: amount
            };
            this.itemID++;
            this.itemList.push(expense);
            this.addExpense(expense);
            this.showBalance();
        }
    }
    // add expense
    addExpense(expense) {
        const div = document.createElement("div");
        div.classList.add("expense");
        div.innerHTML = `<div class="expense-item d-flex justify-content-between align-items-baseline">
         <h6 class="expense-title mb-0 text-uppercase list-item">- ${
           expense.title
         }</h6>
         <h5 class="expense-amount mb-0 list-item">$ ${expense.amount}</h5>
         <!-- icons -->
        <div class="expense-icons list-item">
            <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
             <i class="fas fa-edit"></i>
            </a>
            <a href="#" class="delete-icon" data-id="${expense.id}">
             <i class="fas fa-trash"></i>
            </a>
           </div>
        </div>
     `;
        this.expenseList.appendChild(div);
        this.showBalance();
    }
    //calculate total expense
    totalExpense() {
        let total = 0;
        if (this.itemList.length > 0) {
            total = this.itemList.reduce(function (acc, curr) {
                acc += curr.amount;
                return acc;
            }, 0);
        }
        return total;
    }
    // edit expense
    editExpense(element) {
        let id = parseInt(element.dataset.id);

        let parent = element.parentElement.parentElement.parentElement;
        // remove from dom
        this.expenseList.removeChild(parent);
        //remove from list;
        let expense = this.itemList.filter(function (item) {
            return item.id === id;
        });

        // show value
        this.expenseInput.value = expense[0].title;
        this.amountInput.value = expense[0].amount;
        // delete item
        let tempList = this.itemList.filter(function (expense) {
            return expense.id !== id;
        });

        this.itemList = tempList;
        this.showBalance();
    }
    //delete expense
    deleteExpense(element) {
        let id = parseInt(element.dataset.id);
        console.log(id);
        let parent = element.parentElement.parentElement.parentElement;
        // remove from dom
        this.expenseList.removeChild(parent);

        // delete item
        let tempList = this.itemList.filter(function (expense) {
            return expense.id !== id;
        });

        this.itemList = tempList;
        this.showBalance();
    }
}
//Event listener to trigger all the event
function eventListeners() {

    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");

    //new instance of UI class
    const ui = new UI();

    expenseForm.addEventListener("submit", function (event) {
        event.preventDefault();
        ui.submitExpenseForm();
    });
    expenseList.addEventListener("click", function (event) {
        if (event.target.parentElement.classList.contains("edit-icon")) {
            ui.editExpense(event.target.parentElement);
        } else if (event.target.parentElement.classList.contains("delete-icon")) {
            ui.deleteExpense(event.target.parentElement);
        }
    });
    ui.showBalance();
}

document.addEventListener("DOMContentLoaded", function () {
    eventListeners();
});


// Adding Services to calculate
var ServiceCart = (function () {

    cart = [];

    // Constructor
    function Item(name, price, count) {
        this.name = name;
        this.price = price;
        this.count = count;
    }

    // Save cart
    function saveCart() {
        sessionStorage.setItem('ServiceCart', JSON.stringify(cart));

    }

    // Load cart
    function loadCart() {
        cart = JSON.parse(sessionStorage.getItem('ServiceCart'));
    }
    if (sessionStorage.getItem("ServiceCart") != null) {
        loadCart();
    }



    var obj = {};

    // Add to cart
    obj.addItemToCart = function (name, price, count) {
        for (var item in cart) {
            if (cart[item].name === name) {
                cart[item].count++;
                saveCart();
                return;
            }
        }
        var item = new Item(name, price, count);
        cart.push(item);
        saveCart();
    }
    // Set count from item
    obj.setCountForItem = function (name, count) {
        for (var i in cart) {
            if (cart[i].name === name) {
                cart[i].count = count;
                break;
            }
        }
    };
    // Remove item from cart
    obj.removeItemFromCart = function (name) {
        for (var item in cart) {
            if (cart[item].name === name) {
                cart[item].count--;
                if (cart[item].count === 0) {
                    cart.splice(item, 1);
                }
                break;
            }
        }
        saveCart();

    }

    // Remove all items from cart
    obj.removeItemFromCartAll = function (name) {
        for (var item in cart) {
            if (cart[item].name === name) {
                cart.splice(item, 1);
                break;
            }
        }
        saveCart();
    }

    // Clear cart
    obj.clearCart = function () {
        cart = [];
        saveCart();
    }

    // Count cart 
    obj.totalCount = function () {
        var totalCount = 0;
        for (var item in cart) {
            totalCount += cart[item].count;
        }
        return totalCount;
    }

    // Total cart
    obj.totalCart = function () {
        var totalCart = 0;
        for (var item in cart) {
            totalCart += cart[item].price * cart[item].count;
        }
        return Number(totalCart.toFixed(2));
    }

    // List cart
    obj.listCart = function () {
        var cartCopy = [];
        for (i in cart) {
            item = cart[i];
            itemCopy = {};
            for (p in item) {
                itemCopy[p] = item[p];

            }

            cartCopy.push(itemCopy)
        }
        return cartCopy;
    }

    return obj;
})();

// Add item
$('.add-service').click(function (event) {
    // event.preventDefault();
    var name = $(this).data('name');
    var price = Number($(this).data('price'));
    ServiceCart.addItemToCart(name, price, 1);
    displayCart();
});

// Clear items
$('.clear-cart').click(function () {
    ServiceCart.clearCart();
    displayCart();
});

//Display The item
function displayCart() {
    var cartArray = ServiceCart.listCart();
    var ui = new UI();
    var output = "";
    for (var i in cartArray) {
        output += "<tr>" +
            "<td>" + cartArray[i].name + "</td>" +
            "<td> Price- " + cartArray[i].price + "</td>"

            +
            "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button> Remove</td>"

            +
            "</tr>";
    }
    $('.show-cart').html(output);
    $('.total-cart').html(ServiceCart.totalCart());
    $('.total-count').html(ServiceCart.totalCount());

    $('.total-balance').html(ServiceCart.totalCart() - ui.showBalance());


}

// Delete item button

$('.show-cart').on("click", ".delete-item", function (event) {
    var name = $(this).data('name')
    ServiceCart.removeItemFromCartAll(name);
    displayCart();
})


displayCart();