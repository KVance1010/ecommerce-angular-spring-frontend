import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
providedIn: 'root'
})
export class CartService {

cartItems: CartItem[] = [];

totalQuantity: Subject<number> = new Subject<number>();
totalPrice: Subject<number> = new Subject<number>();

constructor() { }

addToCart(theCartItem: CartItem): void {
// check if we already have the item in our cart
let alreadyExistsInCart: boolean = false;
let existingCartItem: CartItem = undefined;
// find the item in the cart based on item id
if (this.cartItems.length > 0) {
existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
// check
alreadyExistsInCart = (existingCartItem !== undefined); }
// increment the quantity
if (alreadyExistsInCart) { existingCartItem.quantity++; }
// add the item to the array
else { this.cartItems.push(theCartItem); }
// compute the cart total price and total quantity
this.computeCartTotals();
}

computeCartTotals(): void{
let totalPriceValue: number = 0;
let totalQuantityValue: number = 0;
for (let currentCartItem of this.cartItems){
totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
totalQuantityValue += currentCartItem.quantity; }
// publish the new values ... all subscribers will recieve the new data
this.totalPrice.next(totalPriceValue);
this.totalQuantity.next(totalQuantityValue); }
}
