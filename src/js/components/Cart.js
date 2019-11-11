import {
  settings,
  select,
  classNames,
  templates
} from '../settings.js';
import {
  CartProduct
} from './CartProduct.js';
import {
  utils
} from '../utils.js';

export class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    ////console.log('products', thisCart.products);
    thisCart.getElements(element);
    thisCart.initActions(element);
    ////console.log('new Cart', thisCart);
  }
  getElements(element) {
    const thisCart = this;


    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
    thisCart.formPhone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.formAddress = thisCart.dom.wrapper.querySelector(select.cart.address);
    //console.log('phone', thisCart.formPhone);
    //console.log('address', thisCart.formAddress);

    for (let key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);

    }
  }
  initActions(element) { // eslint-disable-line
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      ////console.log('Cart Trigger', thisCart.dom.wrapper);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function () {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      console.log('submit form', event);
      thisCart.sendOrder();
    });
  }
  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      totalPrice: thisCart.totalPrice,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      phone: thisCart.formPhone.value,
      address: thisCart.formAddress.value,
      products: []
    };
    console.log('address', payload.address);
    for (let product of thisCart.products) {
      /* push to the products table form getData function*/
      payload.products.push(product.getData());
      console.log('payload products', payload.products);
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    console.log('payload', payload);
    console.log('options', options);

    fetch(url, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }
  remove(cartProduct) {
    const thisCart = this;
    const index = thisCart.products.indexOf(cartProduct);
    //console.log('index of cartProduct', index);
    thisCart.products.splice(index, 1);
    //console.log('removed', removedIndexProduct);
    thisCart.update();
    const removedProduct = thisCart.products;
    cartProduct.dom.wrapper.remove();
    console.log('removedProduct', removedProduct);

  }
  add(menuProduct) {
    const thisCart = this;
    /*generate HTML based on template*/
    const generatedHTML = templates.cartProduct(menuProduct);
    ////console.log('generatedHTML:', generatedHTML);
    /*create element using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    ////console.log('generatedDOM', generatedDOM);
    /*add element to menu */
    thisCart.dom.productList.appendChild(generatedDOM);
    ////console.log('adding product list', generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    ////console.log('thisCart.products', thisCart.products);
    thisCart.update();
  }
  update() {
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (let product of thisCart.products) {
      console.log(product);
      thisCart.subtotalPrice += product.price;
      thisCart.totalNumber += product.amount;
      console.log('cart products', product);
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    console.log('total number', thisCart.totalNumber);
    console.log('subtotal price', thisCart.subtotalPrice);
    console.log('total Price', thisCart.totalPrice);

    for (let key of thisCart.renderTotalsKeys) {
      for (let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }
  }
}
