var serverPost = require('./API');
let googleMap = require('./googleMap');
const liqPay = require('./LiqPay');
const pizzaCart = require('./pizza/PizzaCart');

function postInfo(error, data) {
    if (error) {
        console.error(error.toString());
    } else {
        liqPay(data);
        console.log(JSON.stringify(data));
    }
}

$('#total-sum').change(function() {
    let sum = JSON.parse($('#total-sum').text());
    if(sum === 0) {
        $("#submit-form").prop('disabled', true);
    } else {
        $("#submit-form").prop('disabled', false);
    }
});

$("#submit-form").click(function(){
    let dataIsValid = true;
    let name = $("#name").val();
    if (!parseName(name)) {
        $("#invalid-name").show();
        $("#name-label").css("color", "firebrick");
        dataIsValid = false
    } else {
        $("#invalid-name").hide();
        $("#name-label").css("color", "green")
    }
    let phoneNumber = $("#phone").val();
    if (!parseNumber(phoneNumber)) {
        $("#invalid-number").show();
        $("#phone-label").css("color", "firebrick");
        dataIsValid = false
    } else {
        $("#invalid-number").hide();
        $("#phone-label").css("color", "green")
    }
    let address = $("#address").val();
    googleMap(address, function (err, coord) {
        if (err) {
            $("#invalid-address").show();
            $("#address-label").css("color", "firebrick");
        } else {
            $("#invalid-address").hide();
            $("#address-label").css("color", "green");
            let cart = pizzaCart.getPizzaInCart();
            let pizza_info = [];
            for(let i = 0; i < cart.length; i++) {
                pizza_info.push({
                   quantity: cart[i].quantity,
                   size: cart[i].size == 'small_size' ? 'Мала' : 'Велика',
                   title: cart[i].pizza.title
                });
                //console.log(JSON.stringify(cart[i].size));
            }
            let pizza_string = "";
            for(let i = 0; i < pizza_info.length; i++) {
                pizza_string += '- ' + pizza_info[i].quantity + 'шт. [' + pizza_info[i].size + '] ' +
                    pizza_info[i].title;
                if(i < pizza_info.length - 1) pizza_string += ';';
                pizza_string += '\n';
            }
            if (dataIsValid) {
                let order_info = {
                    name: name,
                    phone_number: phoneNumber,
                    home_address: address,
                    amount: JSON.parse($('#total-sum').text()),
                    pizza_info: pizza_string
                };
                serverPost.createOrder(order_info, postInfo);
            }
        }
    });
});

function parseName(name) {
    if(!name) return false;
    for (let i = 0; i < name.length; i++) {
        if (name[i] >= 'a' && name[i] <= 'z') continue;
        if (name[i] >= 'A' && name[i] <= 'Z') continue;
        if (name[i] >= 'а' && name[i] <= 'я') continue;
        if (name[i] === 'і' || name[i] === 'ї' || name[i] === 'є' || name[i] === 'ґ') continue;
        if (name[i] >= 'А' && name[i] <= 'Я') continue;
        if (name[i] === 'І' || name[i] === 'Ї' || name[i] === 'Є' || name[i] === 'Ґ') continue;
        if (name[i] === ' ' || name[i] === '-' || name[i] == '\'') continue;
        return false;
    }
    return true;
}

function parseNumber(phoneNumber) {
    if (phoneNumber.length < 6 || phoneNumber.length > 15) return false;
    if (phoneNumber[0] !== '0' && phoneNumber[0] !== '+') return false;
    for (let i = 1; i < phoneNumber.length; i++) {
        if (phoneNumber[i] >= '0' && phoneNumber[i] <= '9') continue;
        return false;
    }
    return true;
}