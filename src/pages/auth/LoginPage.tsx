import { LoginForm } from "../../components/forms/auth";
import AuthLayout from "../../components/layouts/AuthLayout";

const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
