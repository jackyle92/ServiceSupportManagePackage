const getValueFromEvent = function(event){
    let result;
    if (event.target && event.target.type) {
        if (event.target.type === 'checkbox' || event.target.type === 'toggle') {
            return event.target.checked;
        }
        else if (event.target.type === 'number') {
            return Number(event.target.value);
        } 
        else {
            return event.target.value;
        }
    }
    if (event.detail) {
        if (event.detail.selectedValue) {
            result = event.detail.selectedValue;
        }
        else if (event.detail.value) {
            result = event.detail.value;
        }
        else if (event.detail.selectedValues) {
            result = [];
            event.detail.selectedValues.forEach((item) => {
                result.push(item.value);
            });
        }
    }
    return result;
};

export {
    getValueFromEvent
}