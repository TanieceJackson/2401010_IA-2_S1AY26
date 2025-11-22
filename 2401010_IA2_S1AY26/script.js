/* Data model */
	var PRODUCTS = [
  	{
    		id: "T001",
    		name: "Blue Floral Tote",
    		price: 2500,
    		img: "../Assets/tote1.jpg",
    		description: "Handmade cotton tote with floral appliqué."
  	},
  	{
    		id: "T002",
    		name: "Beige Blush Tote",
    		price: 3000,
    		img: "../Assets/tote2.jpg",
    		description: "Beige tote with pink and yellow pattern.Has zipper."
  	},
	{
    		id: "T003",
    		name: "Ms.Nancy Tote",
    		price: 2500,
    		img: "../Assets/tote3.jpg",
    		description: "Beige tote with floral interior."
  	},
	{
    		id: "T004",
    		name: "My Dot Tote",
    		price: 2000,
    		img: "../Assets/tote4.jpg",
    		description: "Dotted pattern"
  	},
	{
    		id: "T005",
    		name: "Classy Me Tote",
    		price: 5000,
    		img: "../Assets/tote5.jpg",
    		description: "Classy tote with multiple compartments"
  	},
	{
    		id: "T006",
    		name: "Rainbow Tote",
    		price: 1000,
    		img: "../Assets/tote6.jpg",
    		description: "Tie-Dyed tote."
  	}
	];

/* To help format currency */
	function formatCurrency(amount, currency)
	{
  		return currency + " " + amount.toFixed(2);
	}

/* Safe DOM ready init */
	function onReady(fn)
	{
  		if (document.readyState !== 'loading') fn();
  		else document.addEventListener('DOMContentLoaded', fn);
	}

/* Render products */
	function renderProducts(containerId)
	{
  		var container = document.getElementById(containerId);
  		if(!container) return;
  		var html = "";
  		for(var i=0;i<PRODUCTS.length;i++)
		{
    			var p = PRODUCTS[i];
   			 html += '<div class="card">';
   			 html +=   '<img src="'+p.img+'" alt="'+p.name+'">';
    			html +=   '<h4>'+p.name+'</h4>';
    			html +=   '<p class="text-muted">'+p.description+'</p>';
    			html +=   '<strong>'+formatCurrency(p.price,"JMD")+'</strong>';
    			html +=   '<div style="margin-top:8px;"><button class="btn" data-id="'+p.id+'">Add to cart</button></div>';
    			html += '</div>';
  		}
  		container.innerHTML = html;

  // attach to new buttons
  	var buttons = container.querySelectorAll('button[data-id]');
  	for(var b=0;b<buttons.length;b++)
	{
    		(function(btn)
	{
      		btn.addEventListener('click', function(){ addToCart(btn.getAttribute('data-id')); });
})(buttons[b]);}
	}

/* Cart (localStorage)  */
	function addToCart(productId)
	{
  		try
		{
    			var prod = null;
    			for(var i=0;i<PRODUCTS.length;i++)
			{
      				if(PRODUCTS[i].id === productId){ prod = PRODUCTS[i]; break; }
    			}
    		if(!prod){ alert("Product not found"); return; }

    		var cart = JSON.parse(localStorage.getItem("cart_v1") || "{}");

    		if(cart[productId]) cart[productId].qty += 1;
    		else cart[productId] = { id: prod.id, name: prod.name, price: prod.price, qty: 1 };

    		localStorage.setItem("cart_v1", JSON.stringify(cart));
    		alert(prod.name + " added to cart.");
    		updateCartCount();
  		} 
		catch(err)
		{
    			alert("Error adding to cart: " + (err && err.message ? err.message : err));
  		}
	}

	function updateCartCount()
	{
  		var countEl = document.getElementById("cartCount");
  		if(!countEl) return;
  		var cart = JSON.parse(localStorage.getItem("cart_v1") || "{}");
  		var total = 0;
  		for(var k in cart) if(cart[k].qty) total += cart[k].qty;
  		countEl.textContent = total;
	}

	function renderCart()
	{
  		var cartDiv = document.getElementById("cartContainer");
  		if(!cartDiv) return;
  		var cart = JSON.parse(localStorage.getItem("cart_v1") || "{}");
  		var html = '<table class="cart-table"><tr><th>Item</th><th>Price</th><th>Qty</th><th>Sub</th></tr>';
  		var subtotal = 0;
  		for(var k in cart)
		{
    			var it = cart[k];
    			var sub = it.price * it.qty;
    			subtotal += sub;
    			html += '<tr>';
    			html += '<td>'+it.name+'</td>';
    			html += '<td>JMD '+it.price+'</td>';
    			html += '<td><input type="number" value="'+it.qty+'" min="1" data-id="'+it.id+'"></td>';
    			html += '<td>JMD '+sub.toFixed(2)+'</td>';
    			html += '</tr>';
  		}
  		html += '</table>';

  		var discount = subtotal > 5000 ? subtotal * 0.05 : 0;
  		var tax = subtotal * 0.12;
  		var total = subtotal - discount + tax;

  		html += '<div style="margin-top:10px;">';
  		html += '<p>Subtotal: JMD '+subtotal.toFixed(2)+'</p>';
  		html += '<p>Discount: JMD '+discount.toFixed(2)+'</p>';
  		html += '<p>Tax (12%): JMD '+tax.toFixed(2)+'</p>';
  		html += '<p><strong>Total: JMD '+total.toFixed(2)+'</strong></p>';
  		html += '<div style="margin-top:8px;">';
  		html += '<button class="btn" id="checkoutBtn">Checkout</button> ';
  		html += '<button class="btn secondary" id="clearCartBtn">Clear All</button>';
  		html += '</div></div>';

  		cartDiv.innerHTML = html;

  		var qtyInputs = cartDiv.querySelectorAll('input[type="number"][data-id]');
  		for(var i=0;i<qtyInputs.length;i++)
		{
    			(function(inp)
		{
      			inp.addEventListener('change', function()
		{
        		changeQty(inp.getAttribute('data-id'), inp.value);
      		});
    		})(qtyInputs[i]);
  	}
  	var clearBtn = document.getElementById('clearCartBtn');
  	if(clearBtn) clearBtn.addEventListener('click', clearCart);
  	var checkoutBtn = document.getElementById('checkoutBtn');
  	if(checkoutBtn) checkoutBtn.addEventListener('click', checkout);
	}

	function changeQty(id, qty)
	{
  		var cart = JSON.parse(localStorage.getItem("cart_v1") || "{}");
  		if(cart[id]) cart[id].qty = Math.max(1, parseInt(qty) || 1);
  		localStorage.setItem("cart_v1", JSON.stringify(cart));
  		renderCart();
  		updateCartCount();
	}

	function clearCart()
	{
  		if(confirm("Delete all items in cart?"))
		{
    			localStorage.removeItem("cart_v1");
    			renderCart();
    			updateCartCount();
  		}
	}

	function checkout()
	{
  		var cart = JSON.parse(localStorage.getItem("cart_v1") || "{}");
  		localStorage.setItem("lastCheckout", JSON.stringify(cart));
  /*navigate to checkout page	*/
  	try 
	{ 
		window.location.href = "checkout.html"; } catch(e){ alert("Cannot navigate to checkout: "+e.message); }
	}

/*Login / Register */
	function registerUser()
	{
  		try
	{
    		var uname = (document.getElementById("reg_username") || {}).value || "";
    		var email = (document.getElementById("reg_email") || {}).value || "";
    		var pw = (document.getElementById("reg_password") || {}).value || "";
    		if(!uname.trim() || !email.trim() || !pw){ alert("Please fill all fields."); return; }
    		var users = JSON.parse(localStorage.getItem("users_v1") || "{}");
    		if(users[uname]){ alert("Username already exists."); return; }
    		users[uname] = { username: uname, email: email, password: pw };
    		localStorage.setItem("users_v1", JSON.stringify(users));
    		alert("Registration successful.");
    		var form = document.getElementById("regForm"); if(form) form.reset();
  		} catch(err){
    		alert("Registration error: " + (err && err.message ? err.message : err));
  	}
	}

	function loginUser()
	{
  		try
	{
    		var uname = (document.getElementById("login_username") || {}).value || "";
    		var pw = (document.getElementById("login_password") || {}).value || "";
    		var users = JSON.parse(localStorage.getItem("users_v1") || "{}");
    		if(users[uname] && users[uname].password === pw)
		{
      			localStorage.setItem("activeUser", uname);
      			alert("Login successful. Welcome " + uname);
      			window.location.href = "index.html";
    		} 
		else 
		{
      			alert("Invalid login.");
    		}
  	} 
	catch(err)
		{
    			alert("Login error: " + (err && err.message ? err.message : err));
  		}
	}

/* About filler */
	function fillAbout()
	{
  		var el = document.getElementById("aboutInfo");
  		if(!el) return;
  		var html = "<h3>About - Handmade Tote Bags</h3>";
  		html += "<p>Owner: Taniece Anesia Jackson</p>";
  		html += "<p>Email: <a href='mailto:tanieceajackson@students.utech.edu.jm' tanieceajackson@students.utech.edu.jm</a></p>";
  el.innerHTML = html;
	}

/* Checkout helpers*/
	function renderCheckout()
	{ 
  		var el = document.getElementById('checkoutSummary');
  		if(!el) return;
  		var cart = JSON.parse(localStorage.getItem("lastCheckout") || "{}");
  		var html = "<h4>Checkout summary (saved)</h4>";
  		var subtotal = 0;
  		for(var k in cart){ subtotal += cart[k].price * cart[k].qty; html += "<p>"+cart[k].name+" x"+cart[k].qty+"</p>"; }
  		html += "<p>Subtotal: JMD "+subtotal.toFixed(2)+"</p>";
  		el.innerHTML = html;
	}
	function confirmCheckout()
	{
  		var name = (document.getElementById('shipName') || {}).value || '';
  		var addr = (document.getElementById('shipAddress') || {}).value || '';
  		var pay = parseFloat((document.getElementById('payAmount') || {}).value) || 0;
  		if(!name || !addr || pay <= 0){ alert("Please complete shipping and payment fields."); return; }
  /*simple confirmation*/
  		document.getElementById('checkoutResult').innerHTML = "<p class='center'>Payment of JMD "+pay.toFixed(2)+" received. Thank you, "+name+".</p>";
  /* clear cart*/
  		localStorage.removeItem('cart_v1');
  		updateCartCount();
	}
	function cancelCheckout()
	{
  /*simple reset*/
  		var form = document.getElementById('checkoutForm'); if(form) form.reset();
  		document.getElementById('checkoutResult').innerHTML = "";
	}

/*Init */
	function init()
	{
  		updateCartCount();
  		renderProducts("productList");
  		renderCart();
  		fillAbout();
  /*If on checkout page, attempt to render checkout summary*/
  		renderCheckout();
  /*Attach register/login form handlers if present*/
  		var regForm = document.getElementById('regForm');
  		if(regForm) regForm.addEventListener('submit', function(e){ e.preventDefault(); registerUser(); });

  		var loginForm = document.getElementById('loginForm');
  		if(loginForm) loginForm.addEventListener('submit', function(e){ e.preventDefault(); loginUser(); });
	}

	onReady(init);

