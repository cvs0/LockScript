import axios from "axios";

const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;

export function registerUser(payload: {
    hashedPassword: string;
    email: string;
  }) {
    return axios
      .post<{ salt: string; vault: string }>(userBase, payload, {
        withCredentials: true,
      })
      .then((res) => res.data);
  }