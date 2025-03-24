export const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://api.hairsalonbookingapp.pawelsobon.pl/api";
