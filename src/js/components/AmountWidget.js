import {
  settings,
  select
} from '../settings.js';
import {
  BaseWidget
} from './BaseWidget.js';

export class AmountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);

    const thisWidget = this;
    thisWidget.getElements();
    thisWidget.initActions();
    //console.log('AmountWidget', thisWidget);
    //console.log('constructor argument', element);
    //console.log('initActions', thisWidget.initActions);
  }
  getElements() {
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);

  }
  isValid(newValue) {
    return !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax;
  }
  initActions() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function () {
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();

      thisWidget.value = parseInt(thisWidget.dom.input.value) -1;
      //thisWidget.setValue(thisWidget.value - 1);
      //console.log('decreaseValue:', thisWidget.value);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();

      thisWidget.value = parseInt(thisWidget.dom.input.value) +1;
      //thisWidget.setValue(thisWidget.value + 1);
      //console.log('IncreaseValue:', thisWidget.value);
    });
  }
  renderValue() {
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }
}
