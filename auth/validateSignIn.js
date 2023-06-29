import Validator from "validator";
import isEmpty from "is-empty";

const validateSignIn = (data) => {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    // console.log("data.Name=", data.Name)
    data.Name = isEmpty(data.Name) ? "" : data.Name;
    data.UserName = isEmpty(data.UserName) ? "" : data.UserName;
    // console.log("data.Name=", data.Name)
    data.Email = isEmpty(data.Email) ? "" : data.Email;
    data.Password = isEmpty(data.Password) ? "" : data.Password;
    data.RePassword = isEmpty(data.RePassword) ? "" : data.RePassword;

    // Name checks
    if (Validator.isEmpty(data.Name)) {
        // console.log(isEmpty(data.Name))
        errors.Name = "Name field is required";
    }

    // UserName checks
    if (Validator.isEmpty(data.UserName)) {
        // console.log(isEmpty(data.UserName))
        errors.UserName = "UserName field is required";
    }

    // Email checks
    if (Validator.isEmpty(data.Email)) {
        errors.Email = "Email field is required";
    } else if (!Validator.isEmail(data.Email)) {
        errors.Email = "Email is invalid";
    }

    // Password checks
    if (Validator.isEmpty(data.Password)) {
        errors.Password = "Password field is required";
    }
    if (Validator.isEmpty(data.RePassword)) {
        errors.RePassword = "Confirm password field is required";
    }
    if (!Validator.isLength(data.Password, { min: 6, max: 30 })) {
        errors.Password = "Password must be at least 6 characters";
    }
    if (!Validator.equals(data.Password, data.RePassword)) {
        errors.RePassword = "Passwords must match";
    }

    return { errors, isValid: isEmpty(errors) };
};

export default validateSignIn;