export const LOCAL_STORAGE_KEY = "chat-messages";

export const KEYS = {
  SPOTIFY_CLIENT_ID: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string,
  SPOTIFY_CLIENT_SECRET: process.env
    .NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET as string,

  OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY as string,
  DEEPSEEK_API_KEY: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY as string,
};

export const REDIRECT_URI = "http://localhost:7934/redirect";
