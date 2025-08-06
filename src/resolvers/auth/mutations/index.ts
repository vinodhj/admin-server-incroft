import { signUp } from "./signup";
import { login } from "./login";
import { deleteUser } from "./delete-user";
import { editUser } from "./edit-user";
import { changePassword } from "./change-password";
import { logout } from "./logout";
import { disableUser } from "./disable-user";

export const AuthMutation = {
  signUp,
  login,
  deleteUser,
  disableUser,
  editUser,
  changePassword,
  logout,
};
