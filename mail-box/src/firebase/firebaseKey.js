export const emailToKey = (email = "") => {
  if (!email) return "";
  return email.replace(/\./g, "_").toLowerCase();
};
