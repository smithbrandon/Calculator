/*---------Testing Scenarios--------
Test Numbers displaying           complete
Test Operators displaying         in progress
Test AC functionality             complete
Test decimal functionality        complete
Test Add Functionality            complete
Test percent functionality        in progress
--------------------------------------*/

var eqTotal = '';
var num = '';
var register = [];
var opps = [];
var totalDisp = false;
var res = $("#results");
var eq = $("#eq");
var cnt = 0;

$('#decimal').click(function () {
    var re = /\./g;
    var dec = re.test(num);
    if (num.length === 0) {
        num = '0.';
        cnt = 2;
    } else if (!dec) {
        num = num + ".";
        cnt++;
    }
    res.text(checkLen(num));
})

$('#percent').click(function () {
    var total;
    var tmp = opps.pop(opps.length - 1);
    num = num + "%";
    res.text(num);
    if (register.length === 1) {
        total = register[0];
    } else {
        total = getTotal();
    }
    opps = [tmp];
    register = [total, total * (parseFloat(num) / 100)];
})

$('#total').click(function () {
    totalDisp = true;
    if (res.text().indexOf('%') < 0) {
        register.push(parseFloat(res.text()));
    }
    eqTotal += res.text() + '=';
    eq.text(checkEq(eqTotal));
    var total = getTotal();
    register = [];
    opps = [];
    register.push(total);
    res.text(checkLen(total));
})

$('#sqrt').click(function () {
    var total;
    eqTotal = this.textContent + '(' + eqTotal + res.text() + ')';
    eq.text(checkEq(eqTotal));
    if (register.length === 0) {
        total = parseFloat(res.text());
    } else if (!totalDisp) {
        register.push(parseFloat(res.text()));
        total = getTotal();
    } else {
        total = register[0];
    }
    total = Math.sqrt(parseFloat(total));
    register = [];
    res.text(checkLen(total));
})

function clearRegister() {
    register = [];
    opps = [];
    eqTotal = '';
    num = '';
    eq.text('');
    res.text(0);
    cnt = 0;
    totalDisp = false;
}

$('.num').click(function () {
    if (this.id !== 'decimal' && this.id !== 'percent') {
        if (cnt < 12 && !totalDisp) {
            cnt++;
            num = num + this.id;
            res.text(checkLen(num));
        } else if (totalDisp) {
            clearRegister();
            cnt++;
            num = num + this.id;
            res.text(checkLen(num));
        }
    }
})

$('.opp').click(function () {
    var b = this.id;

    if (b !== 'percent' && b !== 'sqrt' && b !== 'total') {
        var oppChar = '';
        var b = this.id;

        //Update equation display
        oppChar = (b === 'multiply') ? 'x' : (b === 'divide') ? '/' : this.textContent;
        eqTotal += res.text() + oppChar;
        eq.text(checkEq(eqTotal));

        //add Previous number to register
        if (totalDisp) {
            totalDisp = false;
            eqTotal = register[0] + oppChar;
            eq.text(checkEq(eqTotal));
        } else {
            register.push(parseFloat(res.text()));
        }
        opps.push(b);
        res.text("0");
        num = '';
        cnt = 0;
    }
});

$('#ac').click(function () {
    clearRegister();
})

function getTotal() {
    totalDisp = true;
    var total = 0;
    for (var i = 0; i < opps.length; i++) {
        total = register.reduce(function (p, c) {
            if (opps[i] === "add") {
                return p + c;
            } else if (opps[i] === "subtract") {
                return p - c;
            } else if (opps[i] === "multiply") {
                return p * c;
            } else if (opps[i] === "divide") {
                return p / c;
            }
        });
    }
    return checkLen(total);
}

function checkLen(val) {
    var len = val.toString().length;
    if (len > 12) {
        var i = 6;
        while (len > 12) {
            val = val.toExponential(i);
            len = val.toString().length;
            i--;
        }
    }
    return val;
}
function checkEq(val) {
    if (val.length > 42) {
        return 'overflow Error';
    } else {
        return val;
    }
}

$(document).keypress(function (e) {
    //figure out shift key....
    var key = e.charCode || e.keyCode;
    if (key >= 48 && key <= 57) {									//Pressed (0123456789)
        var numkey = String.fromCharCode(key);
        $('#' + numkey).click();
    } else if (key === 46) {											//Pressed (.)
        $('#decimal').click();
    } else if (key === 61 || key === 13) {							//pressed (=) 
        $('#total').click();
    } else if (key === 42) {											//pressed (*)
        $('#multiply').click();
    } else if (key === 43) {											//pressed (+)
        $('#add').click();
    } else if (key === 45) {											//pressed (-)
        $('#subtract').click();
    } else if (key == 47) {											//pressed (/)
        $('#divide').click();
    } else if (key == 37) {											//pressed (%)
        $('#percent').click();
    } else if (key == 94) {											//pressed (^)
        $('#sqrt').click();
    } else if (key === 105) {
        $('#instr').click();
    }
});
$(document).keyup(function (e) {
    if (e.keyCode === 27 || e.keyCode === 46) $('#ac').click();   							//Pressed (esc)
});
$('#instr').on('click', function () {
    $('#instr').toggle();
})
$(document).ready(function () {
    res.text(0);

})