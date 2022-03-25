
namespace App {
  // Validate
  export interface ValidateInput {
    min?: number;
    max?: number;
    maxLength?: number;
    minLength?: number;
    required?: boolean;
    value: string | number;
  }

  export function validate(objForValidate: ValidateInput) {
    let isValid = true;
    if (objForValidate.required) {
      isValid = isValid && objForValidate.value.toString().trim().length > 0;
    }

    if (objForValidate.minLength != null && typeof objForValidate.value === 'string') {
      isValid = isValid && objForValidate.value.length >= objForValidate.minLength;
    }

    if (objForValidate.maxLength != null && typeof objForValidate.value === 'string') {
      isValid = isValid && objForValidate.value.length <= objForValidate.maxLength;
    }

    if (objForValidate.min != null && typeof objForValidate.value === 'number') {
      isValid = isValid && objForValidate.value >= objForValidate.min;
    }

    if (objForValidate.max != null && typeof objForValidate.value === 'number') {
      isValid = isValid && objForValidate.value <= objForValidate.max;
    }

    return isValid;
  }
};
