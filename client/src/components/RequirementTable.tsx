import { useEffect, useState } from "react";
import * as apiClient from "../api-client";
import toast from "react-hot-toast";

export type Props = {
  requirementsData: any;
  monthKeys: string[];
};

const RequirementTable = ({ requirementsData, monthKeys }: Props) => {
  const [data, setData] = useState(requirementsData);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);

  useEffect(() => {
    setData(requirementsData);
  }, [requirementsData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    district: string,
    month: string
  ) => {
    const newValue = e.target.value;
    const newData = data.districts.map((d: any) => {
      if (d.district === district) {
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
    setData({ ...data, districts: newData });

    const updatedChange = {
      district,
      month,
      newValue,
    };
    const existingChangeIndex = pendingChanges.findIndex(
      (change) => change.district === district && change.month === month
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
      const payloads = pendingChanges.map(({ district, month, newValue }) => ({
        state: requirementsData.state,
        district,
        product: requirementsData.product,
        month,
        quantity: parseInt(newValue) || 0,
      }));

      console.log("Payloads to be sent:", payloads);

      await Promise.all(
        payloads.map((payload) => apiClient.createRequirements(payload))
      );

      toast.success("Update Successful");
      setPendingChanges([]);
      location.reload();
    } catch (error) {
      console.error("Error updating requirements:", error);
      toast.error("Error updating requirements");
    }
  };

  return (
    <>
      {requirementsData && (
        <div className="flex flex-col items-end">
          <table className="border border-gray-300 w-full mx-auto">
            <thead>
              <tr className="bg-[#F9F9F9]">
                <th className="px-4 py-2 border border-gray-300">Districts</th>
                {monthKeys.map((month, index) => (
                  <th key={index} className="px-4 py-2 border border-gray-300">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.districts.map((districtData: any, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-2 border border-gray-300">
                    {districtData.district}
                  </td>
                  {monthKeys.map((month, idx) => (
                    <td
                      key={idx}
                      className="px-4 py-2 border border-gray-300 hover:bg-gray-100"
                    >
                      <input
                        type="number"
                        value={districtData.monthlyQuantities[month]}
                        onChange={(e) =>
                          handleInputChange(e, districtData.district, month)
                        }
                        className="w-full text-center focus:outline-none"
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
                    <input
                      type="number"
                      value={data.monthTotals[month]}
                      className="w-full text-center focus:outline-none bg-transparent appearance-none"
                      disabled
                    />
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

export default RequirementTable;
