export interface ContactData extends Record<string, unknown> {
  name: string;
  email: string;
  message: string;
}

export interface FieldError {
  status: boolean;
  error: string;
}

export interface ContactErrors {
  nameError: FieldError;
  emailError: FieldError;
  messageError: FieldError;
}

export const initialErrors: ContactErrors = {
  nameError: { status: false, error: "" },
  emailError: { status: false, error: "" },
  messageError: { status: false, error: "" },
};

function isValidEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export const validateContact = (
  contactData: ContactData
): { success: boolean; newErrors: Partial<ContactErrors> } => {
  let success = true;
  let newErrors: Partial<ContactErrors> = {};
  const { message, email, name } = contactData;

  if (!email) {
    newErrors = {
      ...newErrors,
      emailError: { status: true, error: "Email id can not be Empty" },
    };
    success = false;
  } else if (!isValidEmail(email)) {
    newErrors = {
      ...newErrors,
      emailError: { status: true, error: "Invalid email format." },
    };
    success = false;
  }

  if (!message) {
    newErrors = {
      ...newErrors,
      messageError: {
        status: true,
        error: "Message can not be empty",
      },
    };
    success = false;
  }

  if (!name) {
    newErrors = {
      ...newErrors,
      nameError: {
        status: true,
        error: "Name can not be empty.",
      },
    };
    success = false;
  }

  return { success, newErrors };
};
