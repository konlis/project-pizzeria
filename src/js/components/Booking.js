import {
  templates,
  select,
  settings,
  classNames
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
    //console.log('datePicker:', thisBooking.dom.datePicker);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    //console.log('hourPicker:', thisBooking.dom.hourPicker);
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    //console.log('peopleAmount', thisBooking.dom.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    //console.log('hoursamount', thisBooking.dom.hoursAmount);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    //console.log('tables', thisBooking.dom.tables);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.formAddress);
    //console.log('adress', thisBooking.dom.address);
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.formPhone);
    thisBooking.dom.bookTableBtn = thisBooking.dom.wrapper.querySelector(select.booking.submitButton);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);
    //console.log('starters', thisBooking.dom.starters);
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);
    //console.log('form', thisBooking.dom.form);
  }
  initWidgets() {
    const thisBooking = this;
    /* write new instance of AmountWidget in thisBooking.peopleAmount and
    thisBooking.hoursAmount properties and give argument (object thisBooking.dom)*/
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
    });
    thisBooking.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisBooking.tableChecked();
      thisBooking.sendBooked();
      console.log('submit form', event);
    });


    /* add eventListener to wrapper with 'updatedDOM' handler*/

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
        fetch(urls.booking), // eslint-disable-line
        fetch(urls.eventsCurrent), // eslint-disable-line
        fetch(urls.eventsRepeat), // eslint-disable-line
      ]) // eslint-disable-line
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
  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;
    //console.log('eventsCurrent', eventsCurrent);
    //console.log('bookings', bookings);
    //console.log('eventsRepeat', eventsRepeat);
    thisBooking.booked = {};

    /* create loop iteral on  object bookings  */
    for (let element of bookings) {
      thisBooking.makeBooked(element.date, element.hour, element.duration, element.table);
      //console.log('elementtable', element.table);
    }
    /* create loop iteral on  object eventsCurrent  */
    for (let element of eventsCurrent) {
      thisBooking.makeBooked(element.date, element.hour, element.duration, element.table);
    }
    /* create loop iteral on  object eventsRepeat  */
    const minDate = thisBooking.datePicker.minDate;
    //console.log('minDate', minDate);
    const maxDate = thisBooking.datePicker.maxDate;
    //console.log('maxDate', maxDate);
    for (let element of eventsRepeat) {
      if (element.repeat == 'daily') {
        for (let eventDate = minDate; eventDate <= maxDate; eventDate = utils.addDays(eventDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(eventDate), element.hour, element.duration, element.table);
        }
      }
    }
    //console.log('booked', thisBooking.booked);
    thisBooking.updateDOM();
  }
  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      //console.log('hourBlock', hourBlock);
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
        //console.log('push to []', thisBooking.booked[date][hourBlock]);
      }
      thisBooking.booked[date][hourBlock].push(table);
      //console.log('push', thisBooking.booked[date][hourBlock].push(table));
      //console.log('table', table);
    }
  }
  updateDOM() {
    const thisBooking = this;
    //console.log('DOM');
    thisBooking.date = thisBooking.datePicker.value;
    //console.log('actualdate', thisBooking.date);
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    //console.log('actualhour', thisBooking.hour);
    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined' ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined') {
      //console.log('zmiana');

      allAvailable = true;
    }
    //console.log('booked', thisBooking.booked);
    //console.log('allAvailable', allAvailable);
    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);

        //console.log('tableId', tableId);
        //console.log('table', table);
        //console.log('thisBooking.dom.tables', thisBooking.dom.tables);
      }
      if (!allAvailable && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
        //console.log('tabale', table);
      }
      /*avaiavble tables*/
      table.addEventListener('click', function (event) {
        console.log('klik', event);

        const bookedTable = table.classList.contains(classNames.booking.tableBooked);

        /*if it is booked remove class temporary booked*/
        if (!bookedTable) {
          table.classList.add(classNames.booking.tableBooked);
          thisBooking.pickedTable = tableId;

        } else {
          console.log('table is already booked, chose another one');
          //table.classList.remove(classNames.booking.tableBooked);
        }
      });
    }
  }
  tableChecked() {
    const thisBooking = this;
    //for (let tableNumber of thisBooking.tableId) {

    //tableNumber.addEventListener('click', function (event) {
    //  console.log('tableNumber', tableNumber);
    //  console.log('click', event);
    //  });
    //  }
    const tableBooked = thisBooking.booked[thisBooking.date][thisBooking.hour].includes(thisBooking.tableId);
    console.log('tableBooked', tableBooked);
    if (!tableBooked) {
      //thisBooking.sendBooked();
    } else {
      window.alert('Sorry, but this table is booked');
    }
  }
  sendBooked() {
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.booking;

    const toSend = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: thisBooking.pickedTable,
      duration: thisBooking.hoursAmount.value,
      people: thisBooking.peopleAmount.value,
      phone: thisBooking.dom.phone.value,
      address: thisBooking.dom.address.value,
      //starters: []
    };

    /*for (let starter of thisBooking.dom.starters) {
      /* push to the starters
      toSend.starters.push(starter);
      //console.log('toSend starter', starter);
    }*/

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend),
    };
    console.log('toSend', toSend);
    //console.log('options', options);

    fetch(url, options)
      .then(function (response) {
        thisBooking.getData();
        return response.json();
      })

      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }
}
