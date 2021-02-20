/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){
        //Якщо піка відповідає фільтру
        //pizza_shown.push(pizza);

        //TODO: зробити фільтри
        if(filter in pizza.content) {
            pizza_shown.push(pizza);
        }
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

$("#meat-filter").click(function(){
    filterPizza('meat');
});

$("#pineapple-filter").click(function(){
    filterPizza('pineapple');
});

$("#mushroom-filter").click(function(){
    filterPizza('mushroom');
});

$("#ocean-filter").click(function(){
    filterPizza('ocean');
});

$("#universal-filter").click(function(){
    showPizzaList(Pizza_List);
});

$("#show-cart").click(function(){
    if($("#cart-general").css("display") == "none"){
        $("#cart-general").show();
        $("#cart-general").css("z-index",1);
        $(this).css("top", "2px");
        $(this).text("Hide Cart");
    } else{
        $("#cart-general").hide();
        $(this).css("top", "30px");
        $(this).text("Show Cart");
    }

});

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List)
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;