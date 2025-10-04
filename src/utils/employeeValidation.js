const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALARY_MIN = 1;
const SALARY_MAX = 1000000;

const normalizeEmail = email => email.trim().toLowerCase();

export const sanitizeEmployeeFields = fields => ({
  firstName: fields.firstName ? fields.firstName.trim() : '',
  lastName: fields.lastName ? fields.lastName.trim() : '',
  email: fields.email ? fields.email.trim() : '',
  hometown: fields.hometown ? fields.hometown.trim() : '',
  salary: fields.salary,
  date: fields.date ? fields.date.trim() : '',
});

export const validateEmployeeFields = (fields, employees = [], options = {}) => {
  const sanitized = sanitizeEmployeeFields(fields);
  const errors = [];

  if (!sanitized.firstName) {
    errors.push('First name is required.');
  }
  if (!sanitized.lastName) {
    errors.push('Last name is required.');
  }
  if (!sanitized.email) {
    errors.push('Email is required.');
  } else if (!EMAIL_REGEX.test(sanitized.email)) {
    errors.push('Email format is invalid.');
  }

  const salaryValue = Number(sanitized.salary);
  if (Number.isNaN(salaryValue)) {
    errors.push('Salary must be a number.');
  } else {
    if (salaryValue < SALARY_MIN) {
      errors.push(`Salary must be at least ${SALARY_MIN}.`);
    }
    if (salaryValue > SALARY_MAX) {
      errors.push(`Salary must not exceed ${SALARY_MAX}.`);
    }
  }

  if (!sanitized.date) {
    errors.push('Start date is required.');
  }

  if (sanitized.email) {
    const normalizedEmail = normalizeEmail(sanitized.email);
    const duplicate = employees.some(employee => {
      if (!employee || !employee.email) {
        return false;
      }

      const isSameEmail = normalizeEmail(employee.email) === normalizedEmail;
      const isSameRecord = options.ignoreEmployeeId
        ? employee.id === options.ignoreEmployeeId
        : false;

      return isSameEmail && !isSameRecord;
    });

    if (duplicate) {
      errors.push('An employee with this email already exists.');
    }
  }

  return {
    errors,
    sanitized: {
      ...sanitized,
      salary: Number.isNaN(salaryValue) ? sanitized.salary : salaryValue,
    },
  };
};
