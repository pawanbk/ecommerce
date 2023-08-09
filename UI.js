import Cart from "./Cart.js";

export default class UI extends Cart{
    constructor(){
        super()
        this.productContainer = document.querySelector(".product-content") //product content container
        this.cartItems = document.querySelector(".cart-items-number") // total items in cart
        this.addCartBtns = [] //  all add to cart btns
        this.cartDOM = document.querySelector(".cart") // cart modal
        this.cartOverlay = document.querySelector(".cart-overlay") // overlay
        this.cartContent = document.querySelector(".cart-content") // cart Conatainer
        this.showCartBtn = document.querySelector(".icon-cart") //btn to show cart
        this.hideCartBtn = document.querySelector(".cart-close") //btn to hide cart
        this.cartClearBtn = document.querySelector(".clear-cart")
        this.cartTotalDOM = document.querySelector(".cart-total")
    }

    updateCartValues(){
       this.cartItems.innerHTML = this.totalQty()
       this.cartTotalDOM.innerHTML = `<h1>cart total : $${this.cartTotal()}</h1>`;
    }

    populateProducts(products){
        let results = ""
        products.forEach(product => {
            results +=`
                <!--single-product-->
                    <article class="product">
                        <div class="img-container">
                            <img src=${product.image} alt="product" class="product-img" />
                            <button class="add-to-cart" data-id=${product.id}>
                                <i class="fa fa-shopping-cart"></i>
                                add to cart
                            </button>
                        </div>
                        <h3>${product.title}</h3>
                        <h4>$${product.price}</h4>
                    </article>
                <!--end-single-product-->`
        });
        this.productContainer.innerHTML =results
    }

    load(products){
        this.populateProducts(products)
        this.addToCart()
        this.updateCartValues()  
        this.showCartBtn.addEventListener("click", ()=>{
           this.showCart()
        })
        this.hideCartBtn.addEventListener("click", ()=>{
            this.hideCart()
        })
    }

    addToCart(){
        this.addCartBtns = [...document.querySelectorAll(".add-to-cart")]
        this.addCartBtns.forEach(btn => {
            let id = btn.dataset.id
            let inCart = this.cart.find(item => item.id == id)
            if(inCart){
                btn.innerText = "In cart"
                btn.disabled = true
            }
            btn.addEventListener("click",(event) =>{
                btn.innerText = "In cart"
                btn.disabled = true
                let aItem = JSON.parse(localStorage.getItem("products")).find(item => item.id ==id)
                this.add(aItem)
                this.updateCartValues()
            })
        })
    }

    showCart(){
        this.cartDOM.classList.add("showCart")
        this.cartOverlay.classList.add("visibility")
        this.populateCartItems()
        this.cartLogic()
        this.clearCart()
    }
    clearCart(){
        this.cartClearBtn.addEventListener("click", () =>{
            let ids = this.cart.map(item => item.id)
            ids.forEach(id => {
                this.removeItem(id)
                this.removeCartItemDOM(id)
                this.updateCartValues()
            })
        })
    }
    hideCart(){
        this.cartDOM.classList.remove("showCart")
        this.cartOverlay.classList.remove("visibility")
    }

    populateCartItems(){
        let cartItems = ""
        this.cart.forEach(cartItem => {
            cartItems += `
                    <div class="cart-item" data-id=${cartItem.id}>
                        <img src=${cartItem.image} alt="product">
                        <div>
                            <h4>${cartItem.title}</h4>
                            <h5>$${cartItem.price}</h5>
                            <span class="remove" data-id=${cartItem.id}>remove</span>
                        </div>
                        <div>
                            <i class="fa fa-caret-up" data-id=${cartItem.id}></i>
                            <p class="quantity">${cartItem.amount}</p>
                            <i class="fa fa-caret-down" data-id=${cartItem.id}></i>
                        </div>
                    </div>
                `
        })
        this.cartContent.innerHTML = cartItems

    }
    cartLogic(){
        const cartItemsDOM = document.querySelectorAll(".cart-item")
        cartItemsDOM.forEach(cartItemDOM => {
           
            cartItemDOM.addEventListener("click", event=>{
                let id = event.target.dataset.id
                switch(event.target.className){
                    // remove cartItem
                    case "remove":
                        this.removeItem(id);
                        this.updateCartValues()
                        this.removeCartItemDOM(id)
                        break;
                    case "fa fa-caret-up":
                        this.increaseQty(id)
                        this.updateQtyDOM(this.getQty(id),event.target.nextElementSibling)
                        this.updateCartValues()

                        break;
                    case "fa fa-caret-down":
                        this.decreaseQty(id)
                        this.updateQtyDOM(this.getQty(id),event.target.previousElementSibling)
                        this.updateCartValues()
                        break;
                }
            })
        })
    }

    removeCartItemDOM(id){
        let cartItems = document.querySelectorAll(".cart-item")
        cartItems.forEach(cartItem => {
            if(id == cartItem.dataset.id){
                cartItem.parentElement.removeChild(cartItem)
                this.addCartBtns.forEach((addCartBtn) =>{
                   if(addCartBtn.dataset.id == id){
                        addCartBtn.innerText = "add to cart"
                        addCartBtn.disabled = false
                   }
                })
            }
        })
    }

    updateQtyDOM(qty,qtyDOM){
        qtyDOM.innerHTML = qty
    }

}