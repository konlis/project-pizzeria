import {
  templates,
  select
} from '../settings.js';
import {
  AmountWidget
} from './AmountWidget.js';
import {
  utils
} from '../utils.js';

export class Booking {
  constructor(bookingWidget) {
    const thisBooking = this;

    thisBooking.render(bookingWidget);
    thisBooking.initWidgets();
  }
  render(element) {
    const thisBooking = this;
    /* generate HTML with templates.bookingWidget without arguments */
    const generatedHTML = templates.bookingWidget();
    //console.log('HTML', generatedHTML);
    /* create empty object thisBooking.dom */
    thisBooking.dom = {};

    /* save to this object 'wrapper' preference similar to argument*/
    thisBooking.dom.wrapper = element;
    console.log('dom.wrapper', thisBooking.dom.wrapper);
    /* wrapper content change to HTML generated from template */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    element.appendChild(generatedDOM);

    /*  in proprties thisBooking.peopleAmount save one element at selector select.booking.peopleAmount*/
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    console.log('peopleAmount', thisBooking.dom.peopleAmount);
    /* similarly to 'peopleAmount' find and write element for hoursAmount */
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    console.log('hoursamount', thisBooking.dom.hoursAmount);
  }
  initWidgets() {
    const thisBooking = this;
    /* write new instance of AmountWidget in thisBooking.peopleAmount and
    thisBooking.hoursAmount properties and give argument (object thisBooking.dom)*/
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

  }
}
