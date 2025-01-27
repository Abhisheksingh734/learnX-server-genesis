const authPasswordValidator = (pass) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

  return regex.test(pass);
};

const authEmailValidator = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return pattern.test(email);
};

module.exports = { authEmailValidator, authPasswordValidator };
