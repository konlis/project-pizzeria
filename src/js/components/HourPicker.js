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

export class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    console.log('hourpicker input:', thisWidget.dom.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    console.log('hourpicker output:', thisWidget.dom.output);

    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input;
  }
  initPlugin() {

    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function (event) {
      thisWidget.value = thisWidget.dom.input.value;
      console.log('listener event:', event);
    });
  }
  parseValue() {
    const toHour = utils.numberToHour(settings.hour.open);
    return toHour;
  }
  isValid() {
    return true;
  }
  renderValue() {
    const thisWidget = this;

    thisWidget.dom.output = thisWidget.value;
  }
}