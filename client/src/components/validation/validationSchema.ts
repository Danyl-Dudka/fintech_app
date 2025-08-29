import * as yup from 'yup';

const registerSchema = yup.object().shape({
    fullname: yup.string().required("Fullname is required").min(3, "Fullname must be at least 3 characters"),
    login: yup.string().required("Login is required").min(5, "Login must be at least 5 characters").max(16, "Login length must not exceed 16 characters"),
    password: yup.string().required("Password is required").min(5, "Password must be at least 5 characters"),
    confirmPassword: yup.string().required('Password confirmation is required').oneOf([yup.ref('password')], 'Password must match'),
});

const transactionSchema = yup.object().shape({
    amount: yup.number().transform((value, originalValue) => (originalValue === "" ? undefined : value)).required("Amount is required!").typeError('Amount must be a number!'),
    description: yup.string().max(60, "Description length must not exceed 60 characters"),
    category: yup.string().required('Please select a category.'),
})

export default registerSchema;
export { transactionSchema };