import { cloneDeep } from "lodash";
import {
  AiFillCloseCircle,
  AiOutlineCaretDown,
  AiOutlineCaretUp,
} from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { Ingredients, Instructions } from "./RecipeModal";
import TextInput from "./TextInput";

type Props = {
  instructions: Instructions;
  setInstructions: (instructions: Instructions) => void;
};

function InstructionsBuilder({ instructions, setInstructions }: Props) {
  // Function to update list on drop
  const handleMove = (index: number, direction: "up" | "down") => () => {
    const updatedList = cloneDeep(instructions);
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(index, 1);
    // Add dropped item
    updatedList.splice(
      direction === "up" ? index - 1 : index + 1,
      0,
      reorderedItem
    );
    // Update State
    setInstructions(updatedList);
  };

  const handleIngredientsChange = (index: number, e: string) => {
    const updatedList = cloneDeep(instructions);
    updatedList[index]["value"] = e;
    setInstructions(updatedList);
  };

  const handleAdd = () => {
    const updatedList = cloneDeep(instructions);
    updatedList.push({ id: updatedList.length, value: "" });
    setInstructions(updatedList);
  };

  const handleDelete = (index: number) => () => {
    const list = [...instructions];
    list.splice(index, 1);
    setInstructions(list);
  };

  return (
    <div className="mx-3 flex flex-col">
      <div className="flex flex-col gap-1">
        {instructions.map((item, index) => (
          <div
            key={item.id}
            className="flex w-full flex-row rounded-xl bg-neutral-200 py-2 pl-1 pr-2 align-middle"
          >
            <div className="flex flex-col justify-center align-middle">
              <button
                type="button"
                disabled={index <= 0}
                onClick={handleMove(index, "up")}
                className=" text-neutral-500 disabled:text-neutral-300"
              >
                <AiOutlineCaretUp className="text-2xl" />
              </button>
              <button
                type="button"
                disabled={index + 1 >= instructions.length}
                onClick={handleMove(index, "down")}
                className=" text-neutral-500 disabled:text-neutral-300"
              >
                <AiOutlineCaretDown className="self-center text-2xl" />
              </button>
            </div>
            <TextInput
              className="rounded-xl"
              placeholder="Instruction"
              containerClassName="flex-[2]"
              defaultValue={item?.value !== "" ? item.value : ""}
              onChange={(e) =>
                handleIngredientsChange(index, e.currentTarget?.value)
              }
            />
            <button type="button" onClick={handleDelete(index)}>
              <AiFillCloseCircle className="ml-1 self-center text-2xl text-neutral-500" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 flex flex-row justify-center rounded-xl bg-neutral-100 py-2 pl-1 pr-2 align-middle"
      >
        <FiPlus className="mr-2 text-xl text-primary-400" />
        <h6 className="text-center font-semibold text-neutral-600">
          Add Instructions
        </h6>
      </button>
    </div>
  );
}

export default InstructionsBuilder;
