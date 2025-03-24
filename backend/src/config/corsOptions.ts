const allowedOrigins =
  process.env.NODE_ENV === "development"
    ? [
        "http://localhost:5173",
        "https://www.hairsalonbookingapp.pawelsobon.pl",
        "https://hairsalonbookingapp.pawelsobon.pl",
      ]
    : [
        "https://www.hairsalonbookingapp.pawelsobon.pl",
        "https://hairsalonbookingapp.pawelsobon.pl",
      ];

export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Unauthorized origin"));
    }
  },
  credentials: true,
};
