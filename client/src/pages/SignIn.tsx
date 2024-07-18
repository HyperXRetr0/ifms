import { BsLockFill, BsPersonFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import toast from "react-hot-toast";

export type SignInFormData = {
  username: string;
  password: string;
};

const SignIn = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();
  const { mutate } = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      toast.success("Sign In Successful");
      navigate("/");
      queryClient.invalidateQueries("validateToken");
      queryClient.invalidateQueries("fetchCurrentUser");
    },
    onError: async (error: Error) => {
      toast.error(error.message);
    },
  });
  const onSubmitHandler = handleSubmit((data) => {
    mutate(data);
  });
  return (
    <div className="min-h-screen flex items-center bg-gradient-to-tr from-[#FF6F59] from-55% via-[#FF6F59] via-55% to-[#F8DDD9]">
      <div className="bg-white shadow-lg flex flex-col gap-4 w-[400px] h-[512px] mx-auto rounded-2xl">
        <div className="flex justify-between items-center mx-12 mt-8">
          <Link className="font-bold text-[#FF6F59] text-3xl" to={"/"}>
            iFMS
          </Link>
          <span className="text-[#FF6F59] text-xl font-thin">PORTAL</span>
        </div>
        <form
          className="flex flex-col items-center gap-4 mt-8"
          onSubmit={onSubmitHandler}
        >
          <h2 className="text-[#FF6F59] text-2xl font-semibold mb-4">Login</h2>
          <div className="bg-[#F9F9F9] w-3/4 rounded-md flex flex-row items-center flex-1 p-2">
            <BsPersonFill size={25} className="text-[#CCCCCC] mx-2" />
            <input
              type="text"
              className="w-full bg-[#F9F9F9] py-2 rounded-md mx-2 focus:outline-none text-[#A0A0A0]"
              placeholder="Username"
              {...register("username", { required: "This field is required" })}
            />
            {errors.username && (
              <span className="font-bold text-[#FF6F59]">*</span>
            )}
          </div>

          <div className="bg-[#F9F9F9] w-3/4 rounded-md flex flex-row items-center flex-1 p-2">
            <BsLockFill size={25} className="text-[#CCCCCC] mx-2" />
            <input
              type="password"
              className="w-full bg-[#F9F9F9] py-2 rounded-md mx-2 focus:outline-none text-[#A0A0A0]"
              placeholder="Password"
              {...register("password", { required: "This field is required" })}
            />
            {errors.password && (
              <span className="font-bold text-[#FF6F59]">*</span>
            )}
          </div>

          <button className="bg-[#FF6F59] px-4 py-3 rounded-md text-white my-6 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#FF8775]">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
