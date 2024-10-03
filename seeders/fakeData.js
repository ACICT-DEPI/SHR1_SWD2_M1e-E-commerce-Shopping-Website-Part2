const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");

const generateFakeUser = async () => {
  return {
    firstName: faker.person.firstName().replace(/[^A-Za-z]/g, ""),
    lastName: faker.person.lastName().replace(/[^A-Za-z]/g, ""),
    email: faker.internet.email(),
    phone: Math.floor(Math.random() * 90000000000 + 10000000000).toString(),
    password: "Test#123",
    role: "customer",
    isAccountVerified: false,
    avatar: {
      url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      public_id: null,
    },
  };
};

const generateFakeCategory = async () => {
  return {
    title: faker.lorem.words(5), // Generates a random title with 5 words
    description: faker.lorem.paragraphs(2), // Generates 2 random paragraphs as a description
    avatar: {
      url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      public_id: null,
    },
  };
};

const generateFakeProduct = () => {
  return {
    title: faker.commerce.productName(), // Random product name
    description: faker.lorem.paragraphs(2), // Random description
    excerpt: faker.lorem.sentence(10), // Random excerpt with 10 words
    price: parseFloat(faker.commerce.price()), // Random price
    discount: faker.number.int({ min: 0, max: 100 }), // Random discount
    quantity: faker.number.int({ min: 1, max: 100 }), // Random quantity
    category: "66fee85ac93595bc4e7e4eb3", // Assuming you will set this from an existing category in your database
    rating: parseFloat(faker.number.float({ min: 0, max: 5, precision: 0.1 })), // Random rating
    numReviews: faker.number.int({ min: 0, max: 100 }), // Random number of reviews
    isFeatured: faker.datatype.boolean(), // Random boolean for featured
  };
};

module.exports = {
  generateFakeUser,
  generateFakeCategory,
  generateFakeProduct,
};
