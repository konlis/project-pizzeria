

export class BaseWidget {
  constructor(wrapperElement, initialValue) {
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;
    //console.log('wrapper', thisWidget.dom.wrapper);
    thisWidget.correctValue = initialValue;
    //console.log('widgetcorrectValue:', thisWidget.correctValue);
  }
  get value() {
    const thisWidget = this;

    return thisWidget.correctValue;
  }
  set value(assignedValue) {
    const thisWidget = this;

    const newValue = thisWidget.parseValue(assignedValue);
    //console.log('new value:', newValue);

    if (newValue != thisWidget.correctValue && thisWidget.isValid(newValue)) {
      thisWidget.correctValue = newValue;
      thisWidget.announce();
    }
    thisWidget.renderValue();
  }
  parseValue(newValue) {
    return parseInt(newValue);
  }
  isValid(newValue) {
    return !isNaN(newValue);
  }
  renderValue() {
    const thisWidget = this;
    console.log('widget value:', thisWidget.value);
  }
  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    console.log('updated', event);
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}
