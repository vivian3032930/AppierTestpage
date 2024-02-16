

var shoppingCart = (function () {

    cart = [];

    function Item(name, price, count) {
      this.name = name;
      this.price = price;
      this.count = count;
    }

    // Save cart
    function saveCart() {
      localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    // Load cart
    function loadCart() {
      cart = JSON.parse(localStorage.getItem('shoppingCart'));
    }
    if (localStorage.getItem("shoppingCart") != null) {
      loadCart();
    }


    var obj = {};

    // Add to cart
    obj.addItemToCart = function (name, price, count) {
      for (var item in cart) {
        if (cart[item].name === name) {
          cart[item].count++;
          saveCart();
          console.log("add_to_cart",cart[item].name, cart[item].price, cart[item].count);
          appier('event', 'product_added_to_cart', {'product_name': cart[item].name, 'product_id':cart[item].price,'product_count': cart[item].count});
          return;
        }
      }
      var item = new Item(name, price, count);
      cart.push(item);
      console.log("add_to_cart",item.name, item.price, item.count);
      appier('event', 'product_added_to_cart', {'product_name': item.name, 'product_id':item.price,'product_count': item.count});
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
          console.log("remove_from_cart",cart[item].name, cart[item].price, cart[item].count);
          appier('event', 'removed_from_cart', {'product_name': cart[item].name, 'product_id':cart[item].price});
          cart[item].count--;
          if (cart[item].count === 0) {
            console.log("remove_from_cart",cart[item].name, cart[item].price, cart[item].count);
            appier('event', 'removed_from_cart', {'product_name': cart[item].name, 'product_id':cart[item].price});
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
          console.log("remove_from_cart",cart[item].name, cart[item].price, cart[item].count);
          appier('event', 'removed_from_cart', {'product_name': cart[item].name, 'product_id':cart[item].price});
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
        itemCopy.total = Number(item.price * item.count).toFixed(2);
        cartCopy.push(itemCopy)
      }
      return cartCopy;
    }
    return obj;
  })();


  // Add item
  $('.default-btn').click(function (event) {
    // alert('working');
    event.preventDefault();
    var name = $(this).data('name');
    var price = Number($(this).data('price'));
    shoppingCart.addItemToCart(name, price, 1);
    displayCart();
  });

  // Clear items
  $('.clear-cart').click(function () {
    shoppingCart.clearCart();
    displayCart();
  });


  function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "";
    for (var i in cartArray) {
      output += "<tr>"
        + "<td>" + cartArray[i].name + "</td>"
        + "<td>(" + cartArray[i].price + ")</td>"
        + "<td><div class='input-group'>"
        + "<input id='number' type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
        + "</div></td>"
        + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
        + " = "
        + "<td>" + cartArray[i].total + "</td>"
        + "</tr>";
    }
    $('.show-cart').html(output);
    $('.total-cart').html(shoppingCart.totalCart());
    $('.total-count').html(shoppingCart.totalCount());
  }

  // Delete item button

  $('.show-cart').on("click", ".delete-item", function (event) {
    var name = $(this).data('name')
    shoppingCart.removeItemFromCartAll(name);
    displayCart();
  })

  // Item count input
  $('.show-cart').on("change", ".item-count", function (event) {
    var name = $(this).data('name');
    var count = Number($(this).val());
    shoppingCart.setCountForItem(name, count);
    displayCart();
  });
  displayCart();

//////// ui script start /////////
// Tabs Single Page
$('.tab ul.tabs').addClass('active').find('> li:eq(0)').addClass('current');
$('.tab ul.tabs li a').on('click', function (g) {
    var tab = $(this).closest('.tab'), 
    index = $(this).closest('li').index();
    tab.find('ul.tabs > li').removeClass('current');
    $(this).closest('li').addClass('current');
    tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').slideUp();
    tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').slideDown();
    g.preventDefault();
});

// search function
$('#search_field').on('keyup', function() {
  var value = $(this).val();
  var patt = new RegExp(value, "i");

  $('.tab_content').find('.col-lg-3').each(function() {
    var $table = $(this);
    
    if (!($table.find('.featured-item').text().search(patt) >= 0)) {
      $table.not('.featured-item').hide();
    }
    if (($table.find('.col-lg-3').text().search(patt) >= 0)) {
      $(this).show();
      document.getElementById('not_found').style.display = 'none';
    } else {
      document.getElementById("not_found").innerHTML = " Product not found..";
      document.getElementById('not_found').style.display = 'block';
    }
    
  });
  
});

log = function () {
  const username = document.getElementById("user").value;
  const birthday = document.getElementById("birthday").value;
  const email = document.getElementById("email").value;
  const custom_attributes = {
      'email': email,
      'username': username,
      'birthday': birthday
  };
  const valuesWithContent = [];
  for (const field in custom_attributes) {
      if (custom_attributes[field] !== '') {
          // 將有內容的欄位值和對應的標題組成字串，加入到 valuesWithContent 陣列中
          valuesWithContent[field] = custom_attributes[field];
      }
  }
  appier('identify', valuesWithContent);
}


/*
add_to_cart = function (){
  //function Item(name, price, count) {
  //  this.name = name;
  // this.price = price;
  //  this.count = count;
  //}
  const productname = cart[item].name;
  console.log(productname)
  const prouctid = cart[item].name.price;
  console.log(prouctid)
  const count = cart[item].name.count;
  console.log(count)
  // Log a `product_viewed` event with the following parameters: `product_name`, `product_id`, `product_count`
  //appier('event', 'product_added_to_cart', {'product_name': productname, 'product_id':prouctid,'product_count': count});
}
*/