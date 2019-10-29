export class BaseWidget {
  constructor(wrapperElement, initialValue) {
    const thisWidget = this;

    thisWidget.dom.wrapper = wrapperElement;

    const widgetValue = thisWidget.correctValue(initialValue);
    console.log('widgetValue', widgetValue);
  }
  get value () {
    const thisWidget = this;
    return thisWidget.correctValue;
  }
  set value (assignedValue) {
    const thisWidget = this;

    const newValue = thisWidget.parseValue(assignedValue);
    console.log('new value:', newValue);

    if (newValue != thisWidget.correctValue && thisWidget.isValid(newValue)){
      thisWidget.correctValue = newValue;
      thisWidget.announce();
    }
    thisWidget.renderValue();
  }
}
