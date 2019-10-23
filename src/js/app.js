import {
  Product
} from './components/Product.js';
import {
  Cart
} from './components/Cart.js';
import {
  settings,
  select,
  classNames
} from './settings.js';


const app = {
  initMenu: function () {
    const thisApp = this;
    ////console.log('thisApp.data:', thisApp.data);
    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function () {
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method */
        thisApp.initMenu();
      });
  },

  init: function () {
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    ////console.log('classNames:', classNames);
    ////console.log('settings:', settings);
    ////console.log('templates:', templates);

    thisApp.initData();
    thisApp.initPages();
    thisApp.initCart();

  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    /*export to Product*/
    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },

  initPages: function () {
    const thisApp = this;

    thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);

    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links));

    thisApp.activatePage(thisApp.pages[0].id);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();
        console.log('link', link);
        /* TODO: get page id from href */
        const href = clickedElement.getAttribute('href');
        console.log('href', href);
        /* replace href to ' ' */
        const replaceHref = href.replace('#', ' ');
        //console.log('replace', replaceHref);
        /* TODO: activate page */
        thisApp.activatePage(replaceHref);
      });
    }
  },

  activatePage(pageID) {
    const thisApp = this;

    for (let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
    }
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.getAttribute('id') == pageId);
    }
  }
};
app.init();
