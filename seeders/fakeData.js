const faker = require("faker");
const bcrypt = require("bcryptjs");

const generateFakeUser = async () => {
  const password = faker.internet.password(10, true);
  const hashedPassword = await bcrypt.hash(password, 10);

  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumberFormat(0),
    password: hashedPassword,
    role: "customer",
    isAccountVerified: false,
    avatar: {
      url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      public_id: null,
    },
  };
};

module.exports = { generateFakeUser };
