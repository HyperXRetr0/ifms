import { monthFormData } from "../../config/month-input-config";
import { productFormData } from "../../config/product-input-config";

type Props = {
  state?: string;
  year: string;
  product?: string;
  monthGroup?: string;
  month?: string;
  setYear: (year: string) => void;
  setProduct?: (product: string) => void;
  setMonthGroup?: (monthGroup: string) => void;
  setMonth?: (month: string) => void;
  isApproval?: boolean;
};

const GetRequirementForm = ({
  state,
  year,
  product,
  monthGroup,
  setYear,
  setProduct,
  setMonthGroup,
  setMonth,
  isApproval,
}: Props) => {
  return (
    <>
      <form className="m-10">
        <div className="flex gap-4 w-full justify-evenly">
          {!isApproval && (
            <input
              className="px-2 py-2 rounded-lg bg-[#F9F9F9] disabled:text-gray-500 disabled:cursor-not-allowed flex-1"
              type="text"
              value={state}
              disabled
            />
          )}

          <select
            className="px-2 py-2 rounded-lg bg-[#F9F9F9] flex-1"
            required
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Select Year</option>
            <option value="2024-2025">2024-2025</option>
          </select>
          {setProduct && (
            <select
              className="px-2 py-2 rounded-lg bg-[#F9F9F9] flex-1"
              required
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            >
              <option value="">Select Product</option>
              {productFormData.map((product) => (
                <option value={product} key={product}>
                  {product}
                </option>
              ))}
            </select>
          )}
          {setMonthGroup && (
            <select
              className="px-2 py-2 rounded-lg bg-[#F9F9F9] flex-1"
              required
              value={monthGroup}
              onChange={(e) => setMonthGroup(e.target.value)}
            >
              <option value="">Select Season</option>
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
            </select>
          )}
          {setMonth && (
            <select
              className="px-2 py-2 rounded-lg bg-[#F9F9F9] flex-1"
              required
              value={monthGroup}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">Select Month</option>
              {monthFormData.map((month) => (
                <option value={month}>{month}</option>
              ))}
            </select>
          )}
        </div>
      </form>
    </>
  );
};

export default GetRequirementForm;
