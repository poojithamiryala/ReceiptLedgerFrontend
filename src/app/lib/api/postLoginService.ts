import axios from "axios";

interface PostLoginPayload {
  name: string | null | undefined;
  email: string | null | undefined;
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

interface PostLoginResponse {
  token: string;
  isNewUser: boolean;
}

export const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const callAfterLoginAPI = async (
  payload: PostLoginPayload
): Promise<PostLoginResponse> => {
  const response = await axios.post(`${BACKEND_API_BASE_URL}/api/after-login`, payload, {
    withCredentials: true, // important if backend sets httpOnly cookie
  });
  return response.data;
};
