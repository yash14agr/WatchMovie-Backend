import Validator from "validator";
import isEmpty from "is-empty";

const validateLogin = (data) => {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    // data.Email = isEmpty(data.Email) ? "" : data.Email;
    // data.Password = isEmpty(data.Password) ? "" : data.Password;

    // Email checks
    // if (Validator.isEmpty(data.Email)) {
    //     errors.Email = "Email field is required";
    // } else if (!Validator.isEmail(data.Email)) {
    //     errors.Email = "Email is invalid";
    // }

    //Password Check
    // if (Validator.isEmpty(data.Password)) {
    //     errors.Password = "Password field is required";
    // }
    // if (!Validator.isLength(data.Password, { min: 6, max: 30 })) {
    //     errors.Password = "Password must be at least 6 characters";
    // }

    return { errors, isValid: isEmpty(errors) };
};

export default validateLogin;