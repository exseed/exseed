export default {
  identity: 'user',
  attributes: {
    email: {
      type: 'string',
      required: true,
    },

    name: {
      type: 'string',
      required: true,
    },

    password: {
      type: 'string',
      required: true,
    },

    role: {
      model: 'role',
    },

    toJSON() {
      let obj = this.toObject();
      delete obj.password;
      return obj;
    },
  },

  // beforeCreate(values, next) {
  //   // if no role is specified, set `user` as default role
  //   if (!values.role) {
  //     exseed.models.role
  //       .find({ name: 'user' })
  //       .then((role) => {
  //         values.role = role.id;
  //         next();
  //       });
  //   }
  // },
};