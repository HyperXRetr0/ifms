import { FiLogOut } from "react-icons/fi";
import * as apiClient from "../api-client";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate } = useMutation(apiClient.logout, {
    onSuccess: async () => {
      toast.success("Sign Out Successful");
      queryClient.invalidateQueries("validateToken");
      sessionStorage.clear();
      navigate("/");
    },
    onError: async () => {
      toast.error("Error Signing Out");
    },
  });
  const onClickHandler = () => {
    mutate();
  };
  return (
    <div onClick={onClickHandler}>
      <FiLogOut
        size={25}
        className="text-white cursor-pointer transition ease-in-out hover:scale-110 delay-150 hover:-translate-y-1"
      />
    </div>
  );
};

export default Logout;
