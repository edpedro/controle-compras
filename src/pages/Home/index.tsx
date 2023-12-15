import { IoMdAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import MultiFilter from "@/components/MultiFilter";

export default function Home() {
  return (
    <>
      <div className="space-y-1 grid gap-1 grid-cols-1 grid-rows-1">
        <div className="relative">
          <Link to="/register">
            <IoMdAddCircle className="absolute top-2 right-2 h-10 w-10" />
          </Link>
        </div>
        <MultiFilter />
      </div>
    </>
  );
}
