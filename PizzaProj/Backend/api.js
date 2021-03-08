/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var crypto = require('crypto');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
    //console.log(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);

    var order = {
        version: 3,
        public_key: 'sandbox_i36114102730',
        action: "pay",
        amount: order_info.amount,
        currency: "UAH",
        description: "Замовлення піцци: " + order_info.name +
                     "\nАдреса доставки: " + order_info.home_address +
                     "\nТелефон: " + order_info.phone_number +
                     "\nЗамовлення:\n" + order_info.pizza_info +
                     "\nРазом " + order_info.amount + "грн.",
        order_id: Math.random(),
        //!!!Важливо щоб було 1, бо інакше візьме гроші!!!
        sandbox: 1
    };
    var data = base64(JSON.stringify(order));
    var signature = sha1('sandbox_WwsOjjQLPLAUNUMZeUwpzArLqcctuviHNFbx3hx3' + data + 'sandbox_WwsOjjQLPLAUNUMZeUwpzArLqcctuviHNFbx3hx3');

    res.send({
        data: data,
        signature: signature,
        success: true
    });
};

function base64(str) {
    return new Buffer(str).toString('base64');
}

function sha1(string) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}