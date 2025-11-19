import * as yup from 'yup';

const registerSchema = yup.object().shape({
    fullname: yup.string().required("Fullname is required").min(2, "Fullname must be at least 2 characters"),
    email: yup.string().email('Invalid email address').required("Email is required"),
    password: yup.string().required("Password is required").min(5, "Password must be at least 5 characters"),
    confirmPassword: yup.string().required('Password confirmation is required').oneOf([yup.ref('password')], 'Password must match'),
});

const transactionSchema = yup.object().shape({
    amount: yup.number().transform((value, originalValue) => (originalValue === "" ? undefined : value)).required("Amount is required!").typeError('Amount must be a number!'),
    description: yup.string().max(60, "Description length must not exceed 60 characters"),
    category: yup.string().required('Please select a category.'),
});

const forgotPasswordSchema = yup.object().shape({
    email: yup.string().required('Email is required!').email('Invalid email address'),
})

const newPasswordSchema = yup.object().shape({
    newPassword: yup.string().required("Password is required").min(5, "Password must be at least 5 characters"),
    confirmNewPassword: yup.string().required('Password confirmation is required').oneOf([yup.ref('newPassword')], 'Password must match'),
});

const codeSchema = yup.object().shape({
    code: yup.string().required('Code is required').length(6, 'Code must be 6 digits')
})

export default registerSchema;
export { transactionSchema };
export { forgotPasswordSchema };
export { newPasswordSchema };
export { codeSchema };