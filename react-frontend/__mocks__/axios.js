// __mocks__/axios.js

const axios = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    // Add other methods as needed
  };
  
  export default axios;
  