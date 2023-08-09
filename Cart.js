
export default class Cart {
    constructor(){
        this.cart = localStorage.getItem("cart") ? this.getItems() :[]
    }

    add(aItem){
        let cartItem = {...aItem, "amount":1}
        this.cart = [...this.cart, cartItem]
        return this.save(this.cart)
    }

    getItems(){
        return JSON.parse(localStorage.getItem("cart"))
    }

    save(cart){
        return localStorage.setItem("cart", JSON.stringify(cart))
    }

    removeItem(id){
        this.cart = this.cart.filter(e => e.id != id)
        this.save(this.cart)
    }

    totalQty(){
        let totalItems = 0
        this.cart.forEach(cartItem => {
            totalItems += cartItem.amount
            
        })
        return totalItems
    }
    getQty(id){
        let qty = 0;
        this.cart.forEach(cartItem => {
            if(cartItem.id == id ){
                qty = cartItem.amount
            }
        })
        return qty
    }
    cartTotal(){
        let cartTotal = 0;
        this.cart.forEach(cartItem => {
           cartTotal += (cartItem.amount * cartItem.price)
        })
        return parseFloat(cartTotal).toFixed(2)
    }

    increaseQty(id){
        this.cart.forEach(cartItem => {
            if(cartItem.id == id){
                cartItem.amount += 1;
                this.save(this.cart)
            }
        })
    }

    decreaseQty(id){
        this.cart.forEach(cartItem => {
           if(cartItem.id == id && cartItem.amount > 1){
               cartItem.amount -= 1
               this.save(this.cart)
           }
        })
    }


}