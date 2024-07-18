import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as apiClient from "../../api-client";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { districtFormData } from "../../config/district-input-config";
import { useEffect, useState } from "react";

export type DistrictData = {
  state: string;
  district: string;
};
const District = () => {
  const { mutate } = useMutation(apiClient.createDistrict, {
    onSuccess: async () => {
      toast.success("District Added Successfully");
    },
    onError: async (error: Error) => {
      toast.error(error.message);
    },
  });
  const { register, handleSubmit } = useForm<DistrictData>();
  const onSubmitHandler = handleSubmit((data) => {
    mutate(data);
  });
  const [selectedState, setSelectedState] = useState<string>("");
  const [district, setDistrict] = useState<string[]>([]);
  useEffect(() => {
    if (selectedState) {
      const stateData = districtFormData.find(
        (group) => group.state === selectedState
      );
      if (stateData) {
        setDistrict(stateData.district);
      } else {
        setDistrict([]);
      }
    }
  }, [selectedState]);

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
          <div className="bg-[#F9F9F9] w-3/4 rounded-md flex items-center flex-1 p-2">
            <select
              className="w-full bg-[#F9F9F9] py-2 mx-2 text-[#A0A0A0]"
              value={selectedState}
              {...register("state", { required: "This field is required" })}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">Select State</option>
              {districtFormData.map((group) => (
                <option value={group.state} key={group.state}>
                  {group.state}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-[#F9F9F9] w-3/4 rounded-md flex items-center flex-1 p-2">
            <select
              className="w-full bg-[#F9F9F9] py-2 mx-2 text-[#A0A0A0]"
              {...register("district", { required: "This Field is required" })}
            >
              <option value="">Select District</option>
              {district.map((district) => (
                <option value={district} key={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <button className="bg-[#FF6F59] px-4 py-3 rounded-md text-white my-6 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#FF8775]">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default District;
