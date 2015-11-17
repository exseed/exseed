export default {
  identity: 'role',
  attributes: {
    name: {
      type: 'string',
      required: true,
    },

    users: {
      model: 'role',
    },

    toJSON() {
      let obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      return obj;
    },
  },
};