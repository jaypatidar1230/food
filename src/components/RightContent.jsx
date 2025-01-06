import Category from "./Category";
import Items from "./Items";

function RightContent() {
  return (
    <div className="flex flex-col">
      <Category />
      <Items />
    </div>
  );
}

export default RightContent;
