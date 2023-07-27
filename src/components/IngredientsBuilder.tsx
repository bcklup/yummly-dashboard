import { cloneDeep } from "lodash";
import {
  AiFillCloseCircle,
  AiOutlineCaretDown,
  AiOutlineCaretUp,
} from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { Ingredients } from "./RecipeModal";
import TextInput from "./TextInput";

type Props = {
  ingredients: Ingredients;
  setIngredients: (ingredients: Ingredients) => void;
};

function IngredientsBuilder({ ingredients, setIngredients }: Props) {
  // Function to update list on drop
  const handleMove = (index: number, direction: "up" | "down") => () => {
    const updatedList = cloneDeep(ingredients);
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(index, 1);
    // Add dropped item
    updatedList.splice(
      direction === "up" ? index - 1 : index + 1,
      0,
      reorderedItem
    );
    // Update State
    setIngredients(updatedList);
  };

  const handleIngredientsChange = (
    e: string,
    fieldType: "item" | "quantity",
    index: number
  ) => {
    const updatedList = cloneDeep(ingredients);
    updatedList[index][fieldType] = e;
    setIngredients(updatedList);
  };

  const handleAdd = () => {
    const updatedList = cloneDeep(ingredients);
    updatedList.push({ id: updatedList.length, quantity: "", item: "" });
    setIngredients(updatedList);
  };

  const handleDelete = (index: number) => () => {
    const list = [...ingredients];
    list.splice(index, 1);
    setIngredients(list);
  };

  return (
    <div className="mx-3 flex flex-col">
      <div className="flex flex-col gap-1">
        {ingredients.map((item, index) => (
          <div
            key={item.id}
            className="flex flex-row rounded-xl bg-neutral-200 py-2 pl-1 pr-2 align-middle"
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
                disabled={index + 1 >= ingredients.length}
                onClick={handleMove(index, "down")}
                className=" text-neutral-500 disabled:text-neutral-300"
              >
                <AiOutlineCaretDown className="self-center text-2xl" />
              </button>
            </div>
            <div className="flex flex-row gap-1">
              <TextInput
                className="rounded-xl"
                placeholder="Quantity"
                defaultValue={item?.quantity !== "" ? item.quantity : ""}
                containerClassName="flex flex-1"
                onChange={(e) =>
                  handleIngredientsChange(
                    e.currentTarget?.value,
                    "quantity",
                    index
                  )
                }
              />
              <TextInput
                className="rounded-xl"
                placeholder="Item"
                defaultValue={item?.item !== "" ? item.item : ""}
                containerClassName="flex-[2]"
                onChange={(e) =>
                  handleIngredientsChange(e.currentTarget?.value, "item", index)
                }
              />
            </div>
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
          Add Ingredient
        </h6>
      </button>
    </div>
  );
}

export default IngredientsBuilder;
