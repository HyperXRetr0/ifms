import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate } = useMutation(apiClient.logout, {
    onSuccess: async () => {
      toast.success("Logout Successful");
      await queryClient.invalidateQueries("validateToken");
    },
    onError: async () => {
      toast.error("Error Logging Out");
    },
  });
  const onClickHandler = () => {
    mutate();
    navigate("/");
  };
  return (
    <button
      className="text-xl border-2 p-3 px-4 hover:bg-[#005AE6] hover:text-[#FFF8F0] text-[#005AE6] bg-[#FFF8F0]"
      onClick={onClickHandler}
    >
      Signout
    </button>
  );
};

export default SignOut;
