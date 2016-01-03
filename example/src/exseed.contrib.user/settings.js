export default {
  name: 'user',
  bearerToken: {
    expiration: '7 days',
    secret: 'saltForJwtToken',
  },
};