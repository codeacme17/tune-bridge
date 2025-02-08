export const login = () => {
  try {
    console.log("login");
    return "login";
  } catch (error) {
    console.error(error);
    return `${error}`;
  }
};
