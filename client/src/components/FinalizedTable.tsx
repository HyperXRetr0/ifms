import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as apiClient from "../api-client";

export type RequirementData = {
  district: string;
  product: string;
  proposedQty: number;
  scaledQty: number;
};

export type Props = {
  requirementsData: RequirementData[];
  fetchRequirements: () => void;
  state: string;
  month: string;
};

const FinalizedTable = ({
  requirementsData,
  fetchRequirements,
  state,
  month,
}: Props) => {
  const [data, setData] = useState(requirementsData);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);
  const [proposedTotals, setProposedTotals] = useState<{
    [key: string]: number;
  }>({});
  const [scaledTotals, setScaledTotals] = useState<{ [key: string]: number }>(
    {}
  );
  const [originalScaledTotals, setOriginalScaledTotals] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    setData(requirementsData);
    calculateTotals(requirementsData);
  }, [requirementsData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    district: string,
    product: string
  ) => {
    const newValue = parseInt(e.target.value, 10) || 0;
    const newData = data.map((item) => {
      if (item.district === district && item.product === product) {
        return {
          ...item,
          scaledQty: newValue,
        };
      }
      return item;
    });

    const newScaledTotals: { [key: string]: number } = { ...scaledTotals };
    const oldScaledQty =
      data.find(
        (item) => item.district === district && item.product === product
      )?.scaledQty || 0;
    newScaledTotals[product] =
      (newScaledTotals[product] || 0) - oldScaledQty + newValue;

    if (newScaledTotals[product] > (originalScaledTotals[product] || 0)) {
      toast.error(
        `Total quantity for ${product} cannot exceed the approved total.`
      );
      return;
    }

    setData(newData);
    setScaledTotals(newScaledTotals);

    const updatedChange = {
      district,
      product,
      newValue,
    };
    const existingChangeIndex = pendingChanges.findIndex(
      (change) => change.district === district && change.product === product
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
      const payloads = pendingChanges.map(
        ({ district, product, newValue }) => ({
          state,
          district,
          product,
          month,
          quantity: parseInt(newValue) || 0,
        })
      );

      console.log("Payloads to be sent:", payloads);

      for (const payload of payloads) {
        await apiClient.updateFinalized(payload);
      }
      await fetchRequirements();
      toast.success("Update Successful");
      setPendingChanges([]);
    } catch (error) {
      console.error("Error updating requirements:", error);
      toast.error("Error updating requirements");
    }
  };

  const calculateTotals = (data: RequirementData[]) => {
    const proposedTotals: { [key: string]: number } = {};
    const scaledTotals: { [key: string]: number } = {};
    const originalScaledTotals: { [key: string]: number } = {};

    data.forEach((item) => {
      if (!proposedTotals[item.product]) {
        proposedTotals[item.product] = 0;
      }
      if (!scaledTotals[item.product]) {
        scaledTotals[item.product] = 0;
      }
      if (!originalScaledTotals[item.product]) {
        originalScaledTotals[item.product] = 0;
      }
      proposedTotals[item.product] += item.proposedQty;
      scaledTotals[item.product] += item.scaledQty;
      originalScaledTotals[item.product] += item.scaledQty;
    });

    setProposedTotals(proposedTotals);
    setScaledTotals(scaledTotals);
    setOriginalScaledTotals(originalScaledTotals);
  };

  const uniqueDistricts = [...new Set(data.map((item) => item.district))];
  const uniqueProducts = [...new Set(data.map((item) => item.product))];

  return (
    <>
      {data && (
        <div className="flex flex-col items-end">
          <table className="border border-gray-300 w-full mx-auto">
            <thead>
              <tr className="bg-[#F9F9F9]">
                <th rowSpan={2} className="px-4 py-2 border border-gray-300">
                  Districts
                </th>
                {uniqueProducts.map((product, index) => (
                  <th
                    key={index}
                    className="px-4 py-2 border border-gray-300"
                    colSpan={2}
                  >
                    {product}
                  </th>
                ))}
              </tr>
              <tr className="bg-[#F9F9F9]">
                {uniqueProducts.map((index) => (
                  <React.Fragment key={index}>
                    <th className="px-4 py-2 border border-gray-300">
                      Proposed
                    </th>
                    <th className="px-4 py-2 border border-gray-300">Final</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {uniqueDistricts.map((district, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border border-gray-300">
                    {district}
                  </td>
                  {uniqueProducts.map((product, idx) => {
                    const item = data.find(
                      (d) => d.district === district && d.product === product
                    );

                    return (
                      <React.Fragment key={idx}>
                        <td className="px-4 py-2 border border-gray-300 hover:bg-gray-100">
                          {item?.proposedQty ?? 0}
                        </td>
                        <td className="px-4 py-2 border border-gray-300 hover:bg-gray-100">
                          <input
                            type="number"
                            value={item?.scaledQty ?? 0}
                            onChange={(e) =>
                              handleInputChange(e, district, product)
                            }
                            className="w-full text-center focus:outline-none"
                          />
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              ))}
              <tr className="bg-[#F9F9F9]">
                <td className="px-4 py-2 border border-gray-300">Total</td>
                {uniqueProducts.map((product, idx) => (
                  <React.Fragment key={idx}>
                    <td className="px-4 py-2 border border-gray-300">
                      {proposedTotals[product] ?? 0}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {scaledTotals[product] ?? 0}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              <tr className="bg-[#F9F9F9]">
                <td className="px-4 py-2 border border-gray-300">
                  Original Scaled
                </td>
                {uniqueProducts.map((product, idx) => (
                  <React.Fragment key={idx}>
                    <td></td>
                    <td className="px-4 py-2 border border-gray-300">
                      {originalScaledTotals[product] ?? 0}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            </tbody>
          </table>
          <button
            className="bg-[#FF6F59] px-4 py-3 rounded-md text-white my-6 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#FF8775]"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}
    </>
  );
};

export default FinalizedTable;
