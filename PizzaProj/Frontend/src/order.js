var serverPost = require('./API');

function postInfo(error, data) {
    if (error) {
        console.error(error.text);
    } else {
        //$(this).html("<p></p>");
        //$(this).text(JSON.stringify(data));
        //$(url).html("<p></p>");
        console.log(JSON.stringify(data));
    }
}

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
    if (!parseAddress(address)) {
        $("#invalid-address").show();
        $("#address-label").css("color", "firebrick");
        dataIsValid = false
    } else {
        $("#invalid-address").hide();
        $("#address-label").css("color", "green")
    }
    if (dataIsValid) {
        let order_info = {
            name: name,
            phone_number: phoneNumber,
            home_address: address
        };
        serverPost.createOrder(order_info, postInfo);
    }
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

function parseAddress(address) {
    if (!address) return false;
    return true;
}