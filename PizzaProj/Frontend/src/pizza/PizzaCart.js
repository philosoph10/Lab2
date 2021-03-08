/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var localStorage = require('../LocalStorage');
//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок

    var isInCart = false;
    for(var j = 0; j < Cart.length; j++) {
        if(Cart[j].pizza.id === pizza.id && Cart[j].size === size) {
            isInCart = true;
            Cart[j].quantity++;
        }
    }

    //Приклад реалізації, можна робити будь-яким іншим способом
    if(!isInCart)
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });

    //Оновити вміст кошика на сторінці
    updateCart();
}

$("#clear").click(function(){
    for(var j = Cart.length - 1; j >= 0; j--) {
        removeFromCart(Cart[j]);
    }
});

$("#order-btn").click(function(){
    window.location.href = 'http://localhost:5050/order.html';
});

$("#modify-btn").click(function(){
    window.location.href = 'http://localhost:5050';
});

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    //TODO: треба зробити
    for(var j = 0; j < Cart.length; j++) {
        if(Cart[j] === cart_item) Cart.splice(j, 1);
    }

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...
    var savedOrders = localStorage.get('cart');
    if(savedOrders){
        Cart = savedOrders;
    }

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    var orderCnt = 0;
    for(var j = 0; j < Cart.length; j++) {
        orderCnt += Cart[j].quantity;
    }
    $("#ordered").text(orderCnt);

    var orderSum = 0;
    for(var j = 0; j < Cart.length; j++) {
        if (Cart[j].size === 'big_size')
            orderSum += Cart[j].pizza.big_size.price * Cart[j].quantity;
        else orderSum += Cart[j].pizza.small_size.price * Cart[j].quantity;
    }
    //$("#order-total").text(orderSum + " грн.")
    // !!!
    $("#total-sum").text(orderSum);
    $("#total-sum").trigger('change');

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity -= 1;
            if(cart_item.quantity == 0) removeFromCart(cart_item);

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".remove").click(function(){
            //Збільшуємо кількість замовлених піц
            removeFromCart(cart_item);

            //Оновлюємо відображення
            updateCart();
        });

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
    localStorage.set('cart', Cart);
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;