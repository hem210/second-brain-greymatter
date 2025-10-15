import { useRef, useState } from "react";
import { CloseIcon } from "../icons/CloseIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { BACKEND_URL, ContentType } from "../config";
import axios from "axios";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateContentModal({ open, onClose }: CreateContentModalProps) {
  const [type, setType] = useState<ContentType>(ContentType.Youtube);
  const linkRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  if (!open) return null;

  async function createContent() {
    const title = titleRef.current?.value || "";
    const tags = tagsRef.current?.value || "";
    const tagsArray = tags
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean);

    await axios.post(`${BACKEND_URL}/api/v1/content`, {
      title,
      type,
      tags: tagsArray,
      ...(type === ContentType.Note
        ? { content: textRef.current?.value || "" }
        : { link: linkRef.current?.value || "" }),
    }, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    alert("Content added");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white text-black rounded-xl shadow-2xl p-6 w-[440px] max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
          <h2 className="text-lg font-semibold">Add Content</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition"
            aria-label="Close modal"
          >
            <CloseIcon size="md" />
          </button>
        </div>

        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Content Type
          </label>
          <div className="flex justify-center flex-wrap gap-3 mb-4">
            <Button
              text="Youtube"
              variant={type === ContentType.Youtube ? "primary" : "secondary"}
              onClick={() => setType(ContentType.Youtube)}
            />
            <Button
              text="Twitter"
              variant={type === ContentType.Twitter ? "primary" : "secondary"}
              onClick={() => setType(ContentType.Twitter)}
            />
            <Button
              text="Note"
              variant={type === ContentType.Note ? "primary" : "secondary"}
              onClick={() => setType(ContentType.Note)}
            />
            <Button
              text="Article"
              variant={type === ContentType.Article ? "primary" : "secondary"}
              onClick={() => setType(ContentType.Article)}
            />
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input ref={titleRef} placeholder="Enter title" type="text" />
          </div>

          {/* Link input for all except Note */}
          {type !== ContentType.Note && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link
              </label>
              <Input ref={linkRef} placeholder="https://..." type="text" />
            </div>
          )}

          {type === ContentType.Note && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <textarea
                ref={textRef}
                placeholder="Write your note here..."
                className="w-full h-40 p-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <Input ref={tagsRef} placeholder="Comma-separated (e.g. tech, ai)" type="text" />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <Button
            variant="primary"
            text="Submit"
            onClick={createContent}
            loading={false}
          />
        </div>
      </div>
    </div>
  );
}
