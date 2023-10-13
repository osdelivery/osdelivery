function initPayPalButton() {
  var shipping = 0;
  var itemOptions = document.querySelector("#smart-button-container #item-options");
var quantity = parseInt();
var quantitySelect = document.querySelector("#smart-button-container #quantitySelect");
if (!isNaN(quantity)) {
quantitySelect.style.visibility = "visible";
}
var orderDescription = 'Service';
if(orderDescription === '') {
orderDescription = 'Item';
}
paypal.Buttons({
style: {
  shape: 'rect',
  color: 'black',
  layout: 'vertical',
  label: 'paypal',
  
},
createOrder: function(data, actions) {
  var selectedItemDescription = itemOptions.options[itemOptions.selectedIndex].value;
  var selectedItemPrice = parseFloat(itemOptions.options[itemOptions.selectedIndex].getAttribute("price"));
  var tax = (0 === 0 || false) ? 0 : (selectedItemPrice * (parseFloat(0)/100));
  if(quantitySelect.options.length > 0) {
    quantity = parseInt(quantitySelect.options[quantitySelect.selectedIndex].value);
  } else {
    quantity = 1;
  }

  tax *= quantity;
  tax = Math.round(tax * 100) / 100;
  var priceTotal = quantity * selectedItemPrice + parseFloat(shipping) + tax;
  priceTotal = Math.round(priceTotal * 100) / 100;
  var itemTotalValue = Math.round((selectedItemPrice * quantity) * 100) / 100;

  return actions.order.create({
    purchase_units: [{
      description: orderDescription,
      amount: {
        currency_code: 'USD',
        value: priceTotal,
        breakdown: {
          item_total: {
            currency_code: 'USD',
            value: itemTotalValue,
          },
          shipping: {
            currency_code: 'USD',
            value: shipping,
          },
          tax_total: {
            currency_code: 'USD',
            value: tax,
          }
        }
      },
      items: [{
        name: selectedItemDescription,
        unit_amount: {
          currency_code: 'USD',
          value: selectedItemPrice,
        },
        quantity: quantity
      }]
    }]
  });
},
onApprove: function(data, actions) {
  return actions.order.capture().then(function(orderData) {
    
    // Full available details
    console.log('Capture result\n', orderData);
    // console.log('Capture result\n', JSON.stringify(orderData, null, 2));

    const clientPPname = `${orderData.payer.name.given_name} ${orderData.payer.name.surname}`
        const clientPPemail = orderData.payer.email_address

    // Show a success message within this page, e.g.
    const ppSmartButtonContainer = document.getElementById('smart-button-container');
    const contentBlocDiv = document.getElementById('content-bloc-div');

    ppSmartButtonContainer.innerHTML = '';
    contentBlocDiv.innerHTML = '';


    let page_needed;
    switch (orderData.purchase_units[0]?.amount.value) {
      case '160.00':
        page_needed = "./html/thanks.html"
        break;
      case '210.00':
        page_needed = "./html/thanks.html"
        break;
      default:
        page_needed = "./html/thanks.html"
        break;
    }

    if (orderData.status == 'COMPLETED') {

      $.ajax({
        url: page_needed,
        success: function (data) {
          // Get the paymentProcessedDiv element where the HTML should be inserted
          var paymentProcessedDiv = document.getElementById("payment-processed-div");
          // Insert the HTML into the paymentProcessedDiv element
          paymentProcessedDiv.innerHTML = data;
          return
        }
      })
      .then(() => {
        // Add the names, emails here
        let namesSpans = document.getElementsByClassName('name');
        let emailsSpans = document.getElementsByClassName('email');


        for (let i = 0; i < namesSpans?.length; i++) {
          const name = namesSpans[i];
          name.innerHTML = clientPPname
        }
        for (let i = 0; i < emailsSpans?.length; i++) {
          const email = emailsSpans[i];
          email.innerHTML = clientPPemail
        }

        return
      })
    } else {
      $("#payment-processed-div").load("./html/payment_error.html");
    }
    return

  });
},
onError: function(err) {
  console.log(err);
},
}).render('#paypal-button-container');
}
initPayPalButton();
