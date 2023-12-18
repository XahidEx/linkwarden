import { Dispatch, SetStateAction, useState } from "react";
import useCollectionStore from "@/store/collections";
import { CollectionIncludingMembersAndLinkCount } from "@/types/global";
import SubmitButton from "@/components/SubmitButton";
import { HexColorPicker } from "react-colorful";
import { toast } from "react-hot-toast";
import TextInput from "@/components/TextInput";

type Props = {
  toggleCollectionModal: Function;
  setCollection: Dispatch<
    SetStateAction<CollectionIncludingMembersAndLinkCount>
  >;
  collection: CollectionIncludingMembersAndLinkCount;
  method: "CREATE" | "UPDATE" | "VIEW_TEAM";
};

export default function CollectionInfo({
  toggleCollectionModal,
  setCollection,
  collection,
  method,
}: Props) {
  const [submitLoader, setSubmitLoader] = useState(false);
  const { updateCollection, addCollection } = useCollectionStore();

  const submit = async () => {
    if (!collection) return null;

    setSubmitLoader(true);

    const load = toast.loading(
      method === "UPDATE" ? "Applying..." : "Creating..."
    );

    let response;

    if (method === "CREATE") response = await addCollection(collection);
    else response = await updateCollection(collection);

    toast.dismiss(load);

    if (response.ok) {
      toast.success(
        `Collection ${method === "UPDATE" ? "Saved!" : "Created!"}`
      );
      toggleCollectionModal();
    } else toast.error(response.data as string);

    setSubmitLoader(false);
  };

  return (
    <div className="flex flex-col gap-3 sm:w-[35rem] w-80">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full">
          <p className="mb-2">Name</p>
          <div className="flex flex-col gap-3">
            <TextInput
              value={collection.name}
              placeholder="e.g. Example Collection"
              onChange={(e) =>
                setCollection({ ...collection, name: e.target.value })
              }
            />
            <div className="color-picker flex justify-between">
              <div className="flex flex-col justify-between items-center w-32">
                <p className="w-full mb-2">Color</p>
                <div style={{ color: collection.color }}>
                  <i className={"bi-folder2"}></i>
                </div>
                <div
                  className="btn btn-ghost btn-xs"
                  onClick={() =>
                    setCollection({ ...collection, color: "#0ea5e9" })
                  }
                >
                  Reset
                </div>
              </div>
              <HexColorPicker
                color={collection.color}
                onChange={(e) => setCollection({ ...collection, color: e })}
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2">Description</p>
          <textarea
            className="w-full h-[11.4rem] resize-none border rounded-md duration-100 bg-base-200 p-2 outline-none border-neutral-content focus:border-sky-300 dark:focus:border-sky-600"
            placeholder="The purpose of this Collection..."
            value={collection.description}
            onChange={(e) =>
              setCollection({
                ...collection,
                description: e.target.value,
              })
            }
          />
        </div>
      </div>

      <SubmitButton
        onClick={submit}
        loading={submitLoader}
        label={method === "CREATE" ? "Add" : "Save"}
        className="mx-auto mt-2"
      />
    </div>
  );
}
