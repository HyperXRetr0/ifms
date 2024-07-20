import GetRequirementForm from "./Forms/GetRequirementForm";
import * as apiClient from "../api-client";
import Loader from "../components/Loader";
import { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import FinalizedTable from "../components/FinalizedTable";

const Finalized = () => {
  const { currentUser, isUserLoading } = useAppContext();
  const [year, setYear] = useState<string>(
    sessionStorage.getItem("year") || ""
  );
  const [month, setMonth] = useState<string>(
    sessionStorage.getItem("month") || ""
  );

  const state = currentUser?.state;
  const [requirementsData, setRequirementsData] = useState<any>(null);

  const fetchRequirements = async () => {
    sessionStorage.setItem("year", year.toString());
    sessionStorage.setItem("monthGroup", month.toString());
    try {
      const data = await apiClient.fetchFinalizedRequirements({
        state,
        year,
        monthGroup: month,
      });
      setRequirementsData(data);
    } catch (error) {
      console.error("Error fetching requirements:", error);
    }
  };

  useEffect(() => {
    if (state && year && month) {
      fetchRequirements();
    }
  }, [state, year, month]);

  if (isUserLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-8">
      <GetRequirementForm
        state={state}
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
      />
      <div className="mx-10">
        {requirementsData ? (
          <FinalizedTable
            requirementsData={requirementsData}
            fetchRequirements={fetchRequirements}
            state={state}
            month={month}
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

export default Finalized;
