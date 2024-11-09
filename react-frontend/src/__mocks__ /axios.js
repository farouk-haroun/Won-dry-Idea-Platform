// __mocks__/axios.js
export default {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    // Add more methods if your tests use other axios functions
  };
  