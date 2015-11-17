export default {
  identity: 'role',
  attributes: {
    name: {
      type: 'string',
      required: true,
    },

    users: {
      collection: 'user',
      via: 'role',
    },

    toJSON() {
      let obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      return obj;
    },
  },
};