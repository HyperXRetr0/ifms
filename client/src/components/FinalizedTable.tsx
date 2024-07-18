// FinalizedTable.tsx

import React from "react";

interface Props {
  requirementsData: {
    proposedQuantity: {
      totalQty: number;
      month: string;
      district: string;
      product: string;
    }[];
    finalizedQuantity: {
      totalQty: number;
      month: string;
      district: string;
      product: string;
      finalizedQty: number;
    }[];
  };
}

const FinalizedTable: React.FC<Props> = ({ requirementsData }) => {
  // Extracting districts and products from the data
  const districts = Array.from(
    new Set(requirementsData.proposedQuantity.map((item) => item.district))
  );
  const products = Array.from(
    new Set(requirementsData.proposedQuantity.map((item) => item.product))
  );

  return (
    <div className="finalized-table">
      <table className="border border-gray-300 w-full mx-auto">
        <thead>
          <tr className="bg-[#F9F9F9]">
            <th rowSpan={2} className="px-4 py-2 border border-gray-300">
              Districts
            </th>
            {products.map((product) => (
              <React.Fragment key={product}>
                <th colSpan={2} className="px-4 py-2 border border-gray-300">
                  {product}
                </th>
              </React.Fragment>
            ))}
          </tr>
          <tr className="bg-[#F9F9F9]">
            {products.map((product) => (
              <React.Fragment key={`${product}-headers`}>
                <th className="px-4 py-2 border border-gray-300">
                  Proposed Qty
                </th>
                <th className="px-4 py-2 border border-gray-300">
                  Finalized Qty
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {districts.map((district) => (
            <tr key={district}>
              <td className="px-4 py-2 border border-gray-300 hover:bg-gray-100">
                {district}
              </td>
              {products.map((product) => {
                // Finding proposed and finalized quantities for the current district and product
                const proposedQty = requirementsData.proposedQuantity.find(
                  (item) =>
                    item.district === district && item.product === product
                );
                const finalizedQty = requirementsData.finalizedQuantity.find(
                  (item) =>
                    item.district === district && item.product === product
                );

                return (
                  <React.Fragment key={`${district}-${product}`}>
                    <td className="px-4 py-2 border border-gray-300 hover:bg-gray-100">
                      {proposedQty ? proposedQty.totalQty : "-"}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 hover:bg-gray-100">
                      {finalizedQty
                        ? finalizedQty.finalizedQty.toFixed(2)
                        : "-"}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinalizedTable;
