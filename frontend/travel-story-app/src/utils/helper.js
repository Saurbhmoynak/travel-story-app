export const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  // If name is empty, return an empty string
  if (!name) return "";

  // Split the name into an array of words based on spaces
  const words = name.split(" ");

  // Initialize an empty string to store initials
  let initials = "";

  // Loop through the first two words (if available) and get their first letters
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0]; // Append the first letter of each word to initials
  }

  // Return the initials in lowercase format
  return initials.toLowerCase();
};
