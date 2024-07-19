import GetRequirementForm from "./Forms/GetRequirementForm";
import * as apiClient from "../api-client";
import Loader from "../components/Loader";
import { useState, useEffect } from "react";
import RequirementTable from "../components/RequirementTable";
import { useAppContext } from "../contexts/AppContext";

const Requirements = () => {
  const { currentUser, isUserLoading } = useAppContext();
  const [year, setYear] = useState<string>(
    sessionStorage.getItem("year") || ""
  );
  const [product, setProduct] = useState<string>(
    sessionStorage.getItem("product") || ""
  );
  const [monthGroup, setMonthGroup] = useState<string>(
    sessionStorage.getItem("monthGroup") || ""
  );

  const state = currentUser?.state;
  const [requirementsData, setRequirementsData] = useState<any>(null);

  const fetchRequirements = async (
    state: string,
    year: string,
    product: string,
    monthGroup: string
  ) => {
    sessionStorage.setItem("year", year.toString());
    sessionStorage.setItem("product", product.toString());
    sessionStorage.setItem("monthGroup", monthGroup.toString());
    try {
      const data = await apiClient.fetchRequirements({
        state,
        year,
        product,
        monthGroup,
      });
      setRequirementsData(data);
    } catch (error) {
      console.error("Error fetching requirements:", error);
    }
  };

  useEffect(() => {
    if (state && year && product && monthGroup) {
      fetchRequirements(state, year, product, monthGroup);
    }
  }, [state, year, product, monthGroup]);

  if (isUserLoading) {
    return <Loader />;
  }

  let monthKeys: string[] = [];
  if (requirementsData && requirementsData.districts.length > 0) {
    monthKeys = Object.keys(requirementsData.districts[0].monthlyQuantities);
  }

  return (
    <div className="flex flex-col gap-8">
      <GetRequirementForm
        state={state}
        year={year}
        setYear={setYear}
        product={product}
        setProduct={setProduct}
        monthGroup={monthGroup}
        setMonthGroup={setMonthGroup}
      />
      <div className="mx-10">
        {requirementsData ? (
          <RequirementTable
            requirementsData={requirementsData}
            monthKeys={monthKeys}
            fetchRequirements={fetchRequirements}
            state={state}
            monthGroup={monthGroup}
            year={year}
          />
        ) : (
          <p>
            No data available. Please fill out the form to fetch requirements.
          </p>
        )}
      </div>
    </div>
  );
};

export default Requirements;
