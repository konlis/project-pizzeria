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
import {
  DatePicker
} from './DatePicker.js';

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
    /* wrapper content change to HTML generated from template */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    element.appendChild(generatedDOM);

    /* create empty object thisBooking.dom */
    thisBooking.dom = {};
    /* save to this object 'wrapper' preference similar to argument*/
    thisBooking.dom.wrapper = element;
    //console.log('dom.wrapper', thisBooking.dom.wrapper);
    /* NEW: create 'thisBooking.dom.datePicker' preference and save there element similar to 'select.widgets.datePicker.wrapper' selector */
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    console.log('datePicker:', thisBooking.dom.datePicker);
    /*  in proprties thisBooking.peopleAmount save one element at selector select.booking.peopleAmount*/
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    //console.log('peopleAmount', thisBooking.dom.peopleAmount);
    /* similarly to 'peopleAmount' find and write element for hoursAmount */
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    //console.log('hoursamount', thisBooking.dom.hoursAmount);
  }
  initWidgets() {
    const thisBooking = this;
    /* write new instance of AmountWidget in thisBooking.peopleAmount and
    thisBooking.hoursAmount properties and give argument (object thisBooking.dom)*/
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);


  }
}
