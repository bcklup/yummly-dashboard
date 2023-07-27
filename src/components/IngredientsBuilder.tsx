import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { GrDrag } from "react-icons/gr";
import { Ingredients } from "./RecipeModal";
import TextInput from "./TextInput";
import { memo } from "react";
import { FiPlus } from "react-icons/fi";

type Props = {
  ingredients: Ingredients;
  setIngredients: (ingredients: Ingredients) => void;
};

function IngredientsBuilder({ ingredients, setIngredients }: Props) {
  // Function to update list on drop
  const handleDrop = (droppedItem: any) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    const updatedList = [...ingredients];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setIngredients(updatedList);
  };

  const handleIngredientsChange = (
    e: string,
    fieldType: "item" | "quantity",
    index: number
  ) => {
    ingredients[index][fieldType] = e;
    console.log("[Log] ingredients", { ingredients });
    setIngredients(ingredients);
  };

  const handleAdd = () => {
    const updatedList = [...ingredients, { item: "", quantity: "" }];
    setIngredients(updatedList);
  };

  return (
    <div className="mx-3 flex flex-col">
      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="list-container">
          {(provided: any) => (
            <div
              className="flex flex-col gap-1"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {ingredients.map((item, index) => (
                <Draggable
                  key={`${item.item}+${item.quantity}`}
                  draggableId={`${item.item}+${item.quantity}`}
                  index={index}
                >
                  {(provided: any) => (
                    <div
                      className="flex flex-row rounded-xl bg-neutral-200 py-2 pl-1 pr-2 align-middle"
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      <GrDrag className="self-center text-xl text-neutral-600" />
                      <div className="flex flex-row gap-1">
                        <TextInput
                          className="rounded-xl"
                          placeholder="Quantity"
                          defaultValue={item.quantity}
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
                          defaultValue={item.item}
                          containerClassName="flex-[2]"
                          onChange={(e) =>
                            handleIngredientsChange(
                              e.currentTarget?.value,
                              "item",
                              index
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
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
