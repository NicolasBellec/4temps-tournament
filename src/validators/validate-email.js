// @flow

const validateEmail = (email: string): boolean =>
  // http://emailregex.com/
  // eslint-disable-next-line max-len
  email.search(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  ) !== -1;
export default validateEmail;
