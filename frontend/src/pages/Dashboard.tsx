import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { CreateContentModal } from "../components/CreateContentModal";
import { Button } from "../components/Button";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Card } from "../components/Card";
import { useContent } from "../hooks/useContent";
import { BACKEND_URL, ContentType } from "../config";
import axios from "axios";
import { SearchModal } from "../components/SearchModal";
import { SearchBar } from "../components/SearchBar";

type Content = {
  _id: string;
  title: string;
  link: string;
  content?: string;
  type: ContentType;
};

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<ContentType | null>(null);

  // --- Content Hook ---
  const contents: Content[] | undefined = useContent();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (contents) {
      setIsLoading(false);
    }
  }, [contents]);

  const filteredContents =
    activeFilter === null
      ? contents || []
      : (contents || []).filter((c) => c.type === activeFilter);

  // --- Share handler ---
  async function sharebrain() {
    const response = await axios.post(
      BACKEND_URL + "/api/v1/brain/share",
      { share: true },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const shareUrl = `http://127.0.0.1:5173/share/${response.data.link}`;
    alert(shareUrl);
  }

  // --- Search handler ---
  function handleSearchClick(query: string) {
    console.log("Search bar query:", query);
    setSearchTerm(query);
    setSearchModalOpen(true);
  }

  // --- Delete handler ---
  async function handleDelete(contentId: string) {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/content`, {
        data: { contentId },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      // Optionally refresh content list or remove from local state if managed here
    } catch (error) {
      console.error("Error deleting content:", error);
      alert("Failed to delete content. Please try again.");
    }
  }

  return (
    <div>
      <Sidebar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      <div className="bg-gray-50 p-6 min-h-screen ml-72">
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
        <SearchModal
          open={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          query={searchTerm}
        />

        {/* 1️⃣ Dashboard Heading */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          My Brain
        </h1>

        {/* 4️⃣ Sticky Header */}
        <div className="sticky top-0 bg-gray-50 z-10 pb-4 flex justify-end items-center gap-4">
          <SearchBar onSearchClick={handleSearchClick} />
          <Button
            startIcon={<ShareIcon size="md" />}
            text="Share Brain"
            variant="secondary"
            onClick={sharebrain}
          />
          <Button
            startIcon={<PlusIcon size="md" />}
            text="Add Content"
            variant="primary"
            onClick={() => setModalOpen(true)}
          />
        </div>

        {/* Loader */}
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : filteredContents.length === 0 ? (
          // 3️⃣ Empty State
          <div className="flex flex-col items-center justify-center w-full h-64 text-gray-500 mt-6">
            <p className="text-lg font-medium">No content found</p>
            <p className="text-sm mt-2">
              Try adding new content or changing your filter.
            </p>
          </div>
        ) : (
          // Content Grid
          <div className="flex gap-4 flex-wrap mt-4">
            {filteredContents.map(({ _id, type, link, content, title }) => (
              <Card
                key={_id}
                title={title}
                link={link}
                text={content}
                type={type}
                onDelete={() => handleDelete(_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
