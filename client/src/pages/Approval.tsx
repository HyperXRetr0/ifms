import { useEffect, useState } from "react";
import * as apiClient from "../api-client";
import StateRequirementTable from "../components/StateRequirementTable";
import GetRequirementForm from "./Forms/GetRequirementForm";

const Approval = () => {
  const [year, setYear] = useState<string>(
    sessionStorage.getItem("year") || ""
  );
  const [product, setProduct] = useState<string>(
    sessionStorage.getItem("product") || ""
  );
  const [monthGroup, setMonthGroup] = useState<string>(
    sessionStorage.getItem("monthGroup") || ""
  );
  const [requirementsData, setRequirementsData] = useState<any>(null);
  const fetchRequirements = async () => {
    sessionStorage.setItem("year", year.toString());
    sessionStorage.setItem("product", product.toString());
    sessionStorage.setItem("monthGroup", monthGroup.toString());
    try {
      const data = await apiClient.fetchDacApprovedRequirements({
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
    if (year && product && monthGroup) {
      fetchRequirements();
    }
  }, [year, product, monthGroup]);
  let monthKeys: string[] = [];
  if (requirementsData && requirementsData.states.length > 0) {
    monthKeys = Object.keys(requirementsData.states[0].monthlyQuantities);
  }
  return (
    <div className="flex flex-col gap-8">
      <GetRequirementForm
        year={year}
        setYear={setYear}
        product={product}
        setProduct={setProduct}
        monthGroup={monthGroup}
        setMonthGroup={setMonthGroup}
        isApproval={true}
      />
      <div className="mx-10">
        {requirementsData ? (
          <StateRequirementTable
            requirementsData={requirementsData}
            monthKeys={monthKeys}
            fetchRequirements={fetchRequirements}
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

export default Approval;
