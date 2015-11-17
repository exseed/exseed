export default {
  identity: 'permission',
  attributes: {
    name: {
      type: 'string',
      required: true,
    },

    roles: {
      collection: 'role',
      via: 'permissions',
    },

    toJSON() {
      let obj = this.toObject();
      return obj.name;
    },
  },
};