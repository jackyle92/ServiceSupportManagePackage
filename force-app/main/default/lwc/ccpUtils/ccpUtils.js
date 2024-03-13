// v1.0.0 - CCP Support (support@crosscloudpartners.com - Cross Cloud Partners) - 6 Feb 2021
// Desc: Create new
// v1.0.1 - Jacky Lee (jacky.lee@crosscloudpartners.com - Cross Cloud Partners) - 30 Apr 2023
// Desc:
// - Add datediff function
// v1.0.2 - Hilbert Nguyen (hilbert.nguyen@crosscloudpartners.com - Cross Cloud Partners) - 15 Dec 2023
// Desc:
// - Add handleKeyDown function
const getValueFromEvent = function (event) {
  let result;
  if (event.target && event.target.type) {
    if (event.target.type === "checkbox" || event.target.type === "toggle") {
      return event.target.checked;
    } else if (event.target.type === "number") {
      return Number(event.target.value);
    } else {
      return event.target.value;
    }
  }
  if (event.detail) {
    if (event.detail.selectedValue) {
      result = event.detail.selectedValue;
    } else if (event.detail.value) {
      result = event.detail.value;
    } else if (event.detail.selectedValues) {
      result = [];
      event.detail.selectedValues.forEach((item) => {
        result.push(item.value);
      });
    }
  }
  return result;
};

const datediff = function (firstDate, secondDate) {
  const dateRemain =
    Math.round((secondDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
  if (dateRemain < 0) return 0;
  else return dateRemain;
};

// Handle Key Down Behaviour
const handleKeyDown = function (event, component) {
  // Escape modal
  if (event.code === "Escape") {
    component.showModal = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  }
};

export { getValueFromEvent, datediff, handleKeyDown };