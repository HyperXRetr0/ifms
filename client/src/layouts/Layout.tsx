import { ReactNode } from "react";
import Header from "../components/Header";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
