import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  getAllUser,
  getCurrentUser,
  postLogin,
  postRegister,
  putUserInfo,
} from "../api/auth";
import type { LoginInput, RegisterPayload, User } from "../types/common";
import { ROUTES } from "../routes/routes";
import { useAuth } from "../contexts/AuthContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (value: LoginInput) => postLogin(value),
    onSuccess: (data) => {
      login(data.access_token);
      navigate(ROUTES.home);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return () => {
    logout();
    navigate(ROUTES.home);
  };
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (value: RegisterPayload) => {
      const data = await postRegister(value);

      return data;
    },
  });
};

export const useCurrentUser = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(token!),
    enabled: !!token,
    retry: 0,
  });
};

export const useUserUpdate = () => {
  return useMutation({
    mutationFn: async ({
      id,
      newInfo,
    }: {
      id: string;
      newInfo: Record<string, any>;
    }) => {
      const data = await putUserInfo({ id, newInfo });

      return data;
    },
  });
};

export const useAllUserEmail = () => {
  return useQuery({
    queryKey: ["allUser"],
    queryFn: () => getAllUser(),
    select: (data) => new Set(data.map((user: User) => user.email)),
  });
};
