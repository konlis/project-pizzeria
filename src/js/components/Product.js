import {select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import {AmountWidget} from './AmountWidget.js';

export class Product {
  constructor(id, data) {
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    ////console.log('initOrderForm', thisProduct.initOrderForm);
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
    ////console.log('processOrder:', thisProduct.processOrder);

    ////console.log('new Product:', thisProduct);
  }
  renderInMenu() {
    const thisProduct = this;

    /*generate HTML based on template*/
    const generatedHTML = templates.menuProduct(thisProduct.data);
    ////console.log('generatedHTML:', generatedHTML);
    /*create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    /* find menu container*/
    const menuContainer = document.querySelector(select.containerOf.menu);
    ////console.log('menuContainer:', menuContainer);
    /*add element to menu */
    menuContainer.appendChild(thisProduct.element);
  }
  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    ////console.log('thisProduct.formInputs:', thisProduct.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    ////console.log('thisProduct.cartButton:', thisProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    ////console.log('thisProduct.priceElem:', thisProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    ////console.log('thisProduct.imageWrapper', thisProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    ////console.log('amountWidgetElem:', thisProduct.amountWidgetElem);
  }
  initAccordion() {
    const thisProduct = this;
    ////console.log('thisinitAccordion:', thisProduct);
    /* find the clickable trigger (the element that should react to clicking) */
    //const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable); / zamienione na stałą z metody getelement w kolejnym zadaniu
    const clickableTrigger = thisProduct.accordionTrigger;
    ////console.log('clickableTrigger:', clickableTrigger);
    /* START: click event listener to trigger */
    clickableTrigger.addEventListener('click', function (event) {
      ////console.log('clicked', event);
      /* prevent default action for event */
      event.preventDefault();
      ////console.log(event);
      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle('active');
      ////console.log('thisProduct.element:', thisProduct);
      /* find all active products */
      const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
      ////console.log('activeProducts:', activeProducts);
      /* START LOOP: for each active product */
      for (let activeProduct of activeProducts) {
        ////console.log('activeProduct', activeProduct);
        /* START: if the active product isn't the element of thisProduct */
        if (activeProduct != thisProduct.element) {
          ////console.log('!=activeProduct', activeProduct);
          /* remove class active for the active product */
          activeProduct.classList.remove('active');
          ////console.log('thisProductInactive', activeProduct);
          /* END: if the active product isn't the element of thisProduct */
        }
        /* END LOOP: for each active product */
      }
      /* END: click event listener to trigger */
    });
  }
  initOrderForm() {
    const thisProduct = this;
    ////console.log('initOrderForm', thisProduct);
    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      ////console.log('submit', event);
      thisProduct.processOrder();
      ////console.log('thisProduct.processOrder:', thisProduct.processOrder);
    });
    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function (event) {
        thisProduct.processOrder();
        console.log('change', event);
      });
    }
    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
      ////console.log('click', event);
    });
  }
  processOrder() {
    const thisProduct = this;
    ////console.log('processOrder', thisProduct);
    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    const formData = utils.serializeFormToObject(thisProduct.form);
    ////console.log('formData:', formData);
    /* NEW: set empty table to thisProduct.params */
    thisProduct.params = {};
    /* set variable price to equal thisProduct.data.price */
    let price = thisProduct.data.price;
    ////console.log('price:', price);
    /* START LOOP: for each paramId in thisProduct.data.params */
    for (let paramId in thisProduct.data.params) {
      ////console.log('thisProduct.data.params:', thisProduct.data.params);
      ////console.log('thisProduct.data:', thisProduct.data);
      ////console.log('paramId:', paramId);
      /* save the element in thisProduct.data.params with key paramId as const param */
      const param = thisProduct.data.params[paramId];
      ////console.log('param:', param);
      /* START LOOP: for each optionId in param.options */
      for (let optionId in param.options) {
        ////console.log('optionId', optionId);
        /* save the element in param.options with key optionId as const option */
        const option = param.options[optionId];
        ////console.log('option:', option);
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1; // eslint-disable-line
        ////console.log('optionSelected:', optionSelected);
        /* START IF: if option is selected and option is not default */
        if (optionSelected && !option.default) {
          ////console.log('optionSelected:', optionSelected);
          ////console.log('default:', !option.default);
          /* add price of option to variable price */
          price += option.price;
          ////console.log('thisProduct.priceElem:', thisProduct.priceElem);
          ////console.log('addPrice', price);
          /* END IF: if option is selected and option is not default */
        }
        /* START ELSE IF: if option is not selected and option is default */
        else if (!optionSelected && option.default) {
          ////console.log('not.default:', option.default);
          /* deduct price of option from price */
          price -= option.price;
          ////console.log('deductPrice:', price);
          ////console.log('optionId', optionId);
          /* END ELSE IF: if option is not selected and option is default */
        }
        /* NEW :create const with all images with active class visible*/
        const activeVisibleImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
        ////console.log('activeVisibleImages', activeVisibleImages);
        /* NEW CODE */
        if (!thisProduct.params[paramId]) {
          thisProduct.params[paramId] = {
            label: param.label,
            options: {},
          };
        }
        thisProduct.params[paramId].options[optionId] = option.label;
        /* NEW: START IF ELSE : if selected and have image, add to imageWrapper 'active' class */
        if (optionSelected && activeVisibleImage) {
          /* NEW: add class active */
          activeVisibleImage.classList.add(classNames.menuProduct.imageVisible);
          ////console.log('addVisibleImage:', activeVisibleImage);
        }
        /* NEW: START ELSE: not selected*/
        else {
          if (activeVisibleImage) {
            /*remove calss active*/
            activeVisibleImage.classList.remove(classNames.menuProduct.imageVisible);
            ////console.log('removeVisibleImage:', activeVisibleImage);
            /* NEW: END if*/
          }
          /* NEW: END else not selected*/
        }
        /* END LOOP: for each optionId in param.options */
      }
      /* END LOOP: for each paramId in thisProduct.data.params */
    }
    /* multiply price by amount */
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price;
    ////console.log('parametry', thisProduct.params);
  }
  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('updated', function (event) {
      console.log(event);
      thisProduct.processOrder();
    });
  }
  addToCart() {
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    /* import to app*/
    const event = new CustomEvent('add-to-cart' , {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }
}
