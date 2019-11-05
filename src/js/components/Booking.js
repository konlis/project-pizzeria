import {
  templates,
  select,
  settings
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
import {
  HourPicker
} from './HourPicker.js';

export class Booking {
  constructor(bookingWidget) {
    const thisBooking = this;

    thisBooking.render(bookingWidget);
    thisBooking.initWidgets();
    thisBooking.getData();
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
    /* NEW: create 'thisBooking.dom.hourPicker' preference and save there element similar to 'select.widgets.hourPicker.wrapper' selector */
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    console.log('hourPicker:', thisBooking.dom.hourPicker);
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
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

  }
  getData() {
    const thisBooking = this;

    const startEndDates = {};
    startEndDates[settings.db.dateStartParamKey] = utils.dateToStr(thisBooking.datePicker.minDate);
    startEndDates[settings.db.dateEndParamKey] = utils.dateToStr(thisBooking.datePicker.maxDate);

    const endDate = {};
    endDate[settings.db.dateEndParamKey] = startEndDates[settings.db.dateEndParamKey];

    const params = {
      booking: utils.queryParams(startEndDates),
      eventsCurrent: settings.db.notRepeatParam + '&' + utils.queryParams(startEndDates),
      eventsRepeat: settings.db.repeatParam + '&' + utils.queryParams(endDate),
    };
    //console.log('getData params', params);

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking,
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat,
    };
    //console.log('getData urls', urls);

    Promise.all([
        fetch(urls.booking),
        fetch(urls.eventsCurrent),
        fetch(urls.eventsRepeat),
      ])
      .then(function ([bookingsResponse, eventsCurrentResponse, eventsRepeatResponse]) {
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }
  parseData(bookings, eventsCurrent) {
    const thisBooking = this;
    console.log('eventsCurrent', eventsCurrent);
    thisBooking.booked = {};
    /* create loop iteral on  object eventsCurrent  */
    for (let element of eventsCurrent) {
      console.log('element', element);
      /* add to object arguments*/
      thisBooking.makeBooked(element.date, element.hour, element.duration, element.table);
    }
    console.log(thisBooking.booked);
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;
    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }
    if (typeof thisBooking.booked[date][hour] == 'undefined') {
      thisBooking.booked[date][hour] = [];
      thisBooking.booked[date][hour].push(table);
    }
  }
}
