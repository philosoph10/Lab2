function liqpay(data) {

    LiqPayCheckout.init({
        data: data.data,
        signature: data.signature,
        embedTo: "#liqpay",
        mode: "popup" // embed ||popup
    }).on("liqpay.callback", function(data) {
        console.log(data.status);
        console.log(data);
    }).on("liqpay.ready", function(data) {
        // ready
    }).on("liqpay.close", function(data){
        // close
    });
}

module.exports = liqpay;