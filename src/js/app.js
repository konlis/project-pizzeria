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
import {
  Booking
} from './components/Booking.js';

const app = {
  initCarousel: function () {
    const thisApp = this;
    console.log(thisApp);
    const dotArray = [];
    const slides = document.querySelectorAll(select.carousel.slides);
    //console.log('cytaty', slides);
    const dots = document.querySelectorAll(select.carousel.dots);
    //console.log('dots', dots);

    for (let dot of dots) {
      dotArray.push(dot);
      //console.log('dot1', dot);
      dot.addEventListener('click', function (event) {
        event.preventDefault();

        dot.classList.remove(classNames.carousel.dotsActive);

        for (let slide of slides) {
          const slideId =  slide.getAttribute('slide-id');
          const dotId = dot.getAttribute('slide-id');
          if (slideId != dotId) {
            slide.classList.remove(classNames.carousel.slidesActive);
          } else if (slideId == dotId) {
            slide.classList.add(classNames.carousel.slidesActive);
          }
          // console.log('slide', slide);
          // console.log('dot', dot);
        }
      });
    }

    let i = 1;
    const carouseltemArray = [];
    const carouseltems = document.querySelectorAll(select.carousel.slides);
    //console.log('caritems', carouseltems);
    for (let item of carouseltems) {
      carouseltemArray.push(item);
      //console.log('item', item);
    }
    //console.log('car Array', carouseltemArray);

    function changeSlide() {

      document.querySelector('.quotes').src = carouseltemArray[i];
      //console.log('zawartosc tblicy', carouseltemArray[i]);
      for (let item of carouseltemArray) {
        //console.log('item', item);
        item.classList.remove('active');

        item.classList.add('active');
      }
      dotArray[i].click(event);
      //console.log('event', event);
      //console.log('dotArray', dotArray[i]);

      if (i < carouseltemArray.length - 1) {
        i++;
      } else {
        i = 0;
      }
    }

    window.onload = function () {
      setInterval(() => {
        changeSlide();
      }, 4000);
    };
  },




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

    thisApp.initCarousel();
    thisApp.initData();
    thisApp.initPages();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.initCarousel();
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
    thisApp.buttons = Array.from(document.querySelectorAll(select.nav.homeLinks));

    let pagesMatchingHash = [];

    if (window.location.hash.length > 2) {
      const idFromHash = window.location.hash.replace('#/', '');
      //console.log('idFromHash', idFromHash);

      pagesMatchingHash = thisApp.pages.filter(function (page) {
        return page.id == idFromHash;
      });
      //console.log('pagesMatchingHash', pagesMatchingHash);
    }
    thisApp.activatePage(pagesMatchingHash.length ? pagesMatchingHash[0].id : thisApp.pages[0].id);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();
        /* TODO: get page id from href */
        const id = clickedElement.getAttribute('href').replace('#', '');
        /* TODO: activate page */
        thisApp.activatePage(id);
      });
    }

    for (let link of thisApp.buttons) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();
        /* TODO: get page id from href */
        const id = clickedElement.getAttribute('href').replace('#', '');
        /* TODO: activate page */
        thisApp.activatePage(id);
      });
    }
  },

  initBooking: function () {
    const thisApp = this;
    /* find widget container to site reservation with slector (select.containerOf.booking) */
    const bookingWidget = document.querySelector(select.containerOf.booking);
    //console.log('booking', bookingWidget);
    /* create new instance of 'Booking' class giving her  constructor  the container of widget */
    thisApp.booking = new Booking(bookingWidget);
  },

  activatePage(pageId) {
    const thisApp = this;

    for (let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
      //console.log('link', link);
    }
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
      //console.log('page', page);
    }
    window.location.hash = '#/' + pageId;
    //console.log('hash', window.location.hash);
  }


};
app.init();
