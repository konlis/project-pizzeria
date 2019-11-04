import {
  select,
  settings
} from '../settings.js';
import {
  utils
} from '../utils.js';
import {
  BaseWidget
} from './BaseWidget.js';

export class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    //console.log('datepicker input:', thisWidget.dom.input);

    thisWidget.initPlugin();
  }
  initPlugin() {
    const thisWidget = this;
    /* create new properties 'thisWidget.minDate' similar to newDate(thisWidget.value)*/
    thisWidget.minDate = new Date(thisWidget.value);
    //console.log('minDate:', thisWidget.minDate);

    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    //console.log('maxDate:', thisWidget.maxDate);

    /* initiate plugin flatpickr with good opton */
    const options = {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      disable: [
        function (date) {
          return (date.getDay() === 1);
        }
      ],
      locale: {
        'firstDayOfWeek': 1 // start week on Monday
      },
      onChange: function (selectedDates, dateToStr) {
        thisWidget.value = dateToStr;
      }
    };

    flatpickr(thisWidget.dom.input, options); // eslint-disable-line
  }
  parseValue(newValue) {
    return newValue;
  }
  isValid() {
    return true;
  }
  renderValue() {
    console.log();
  }
}
