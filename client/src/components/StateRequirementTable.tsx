import { useEffect, useState } from "react";
import * as apiClient from "../api-client";
import toast from "react-hot-toast";

export type Props = {
  requirementsData: any;
  monthKeys: string[];
};

const StateRequirementTable = ({ requirementsData, monthKeys }: Props) => {
  const [data, setData] = useState(requirementsData);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");

  useEffect(() => {
    setData(requirementsData);
  }, [requirementsData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    state: string,
    month: string
  ) => {
    setSelectedState(state);
    const newValue = e.target.value;
    const newData = data.states.map((d: any) => {
      if (d.state === state) {
        return {
          ...d,
          monthlyQuantities: {
            ...d.monthlyQuantities,
            [month]: newValue,
          },
        };
      }
      return d;
    });
    setData({ ...data, states: newData });

    const updatedChange = {
      state,
      month,
      newValue,
    };
    const existingChangeIndex = pendingChanges.findIndex(
      (change) => change.state === state && change.month === month
    );
    if (existingChangeIndex !== -1) {
      const updatedChanges = [...pendingChanges];
      updatedChanges[existingChangeIndex] = updatedChange;
      setPendingChanges(updatedChanges);
    } else {
      setPendingChanges([...pendingChanges, updatedChange]);
    }
  };

  const handleSubmit = async () => {
    try {
      const payloads = pendingChanges.map(({ month, newValue }) => ({
        state: selectedState,
        product: requirementsData.product,
        month,
        quantity: parseInt(newValue) || 0,
      }));
      await Promise.all(payloads.map(apiClient.saveDataToDac));
      toast.success("Update Successful");
      setPendingChanges([]);
      location.reload();
    } catch (error) {
      console.error("Error updating requirements:", error);
    }
  };

  return (
    <>
      {data && (
        <div>
          <table className="border border-gray-300 w-full mx-auto">
            <thead>
              <tr className="bg-[#F9F9F9]">
                <th className="px-4 py-2 border border-gray-300">States</th>
                {monthKeys.map((month, index) => (
                  <th key={index} className="px-4 py-2 border border-gray-300">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.states.map((stateData: any, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-2 border border-gray-300">
                    {stateData.state}
                  </td>
                  {monthKeys.map((month, idx) => (
                    <td
                      key={idx}
                      className="px-4 py-2 border border-gray-300 hover:bg-gray-100  text-center"
                    >
                      <input
                        type="number"
                        value={stateData.monthlyQuantities[month]}
                        onChange={(e) =>
                          handleInputChange(e, stateData.state, month)
                        }
                        className="w-full text-center focus:outline-none"
                        onWheel={(event) => event.currentTarget.blur()}
                      />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2 border border-gray-300 hover:bg-gray-100">
                  Total
                </td>
                {monthKeys.map((month, idx) => (
                  <td
                    className="px-4 py-2 border border-gray-300 text-center"
                    key={idx}
                  >
                    {data.monthTotals[month]}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <button
            onClick={handleSubmit}
            className="bg-[#FF6F59] px-4 py-3 rounded-md text-white my-6 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#FF8775]"
          >
            Submit
          </button>
        </div>
      )}
    </>
  );
};

export default StateRequirementTable;
