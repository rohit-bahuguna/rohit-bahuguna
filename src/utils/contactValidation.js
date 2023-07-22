export const initialErrors = {
    nameError: { status: false, error: "" },
    emailError: { status: false, error: "" },
    messageError: { status: false, error: "" }
}

export const validateContact = (contactData) => {
    let success = true;
    let newErrors = {};
    const { message, email, name } = contactData

    if (!email) {
        newErrors = {
            ...newErrors,
            emailError: { status: true, error: 'Email id can not be Empty' }
        };
        success = false;

    } else if (!isValidEmail(email)) {
        newErrors = {
            ...newErrors,
            emailError: { status: true, error: 'Invalid email format.' }
        };
        success = false;
    }



    if (!message) {

        newErrors = {
            ...newErrors,
            messageError: {
                status: true,
                error: 'Message can not be empty'
            }
        };
        success = false;
    }
    if (!name) {

        newErrors = {
            ...newErrors,
            nameError: {
                status: true,
                error: 'Name can not be empty.'
            }
        };
        success = false;
    }

    return { success, newErrors };
};


function isValidEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

