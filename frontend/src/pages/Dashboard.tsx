import { useState } from "react"
import { Sidebar } from "../components/Sidebar";
import { CreateContentModal } from "../components/CreateContentModal";
import { Button } from "../components/Button";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Card } from "../components/Card";
import { useContent } from "../hooks/useContent";
import { BACKEND_URL, ContentType } from "../config";
import axios from "axios";

type Content = {
  id: string,
  title: string,
  link: string,
  type: ContentType
}

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ContentType | null>(null);
  const contents: Content[] = useContent();
  const filteredcontents = activeFilter === null ? contents : contents.filter((c) => c.type === activeFilter)

  async function sharebrain() {
    const response = await axios.post(BACKEND_URL + "/api/v1/brain/share", {
      share: true
    }, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    const shareUrl = `http://127.0.0.1:5173/share/${response.data.link}`;
    alert(shareUrl);

  }
  

  return<div>
    <Sidebar activeFilter={activeFilter} setActiveFilter={setActiveFilter}/>
    <div className="bg-custom-gray-200 p-4 min-h-screen ml-72">
      <CreateContentModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="flex justify-end gap-4 pb-4">
        <Button startIcon={<ShareIcon size="md" />} text="Share Brain" variant="secondary" onClick={sharebrain}/>
        <Button startIcon={<PlusIcon size="md" />} text="Add Content" variant="primary" onClick={() => setModalOpen(true)}/>
      </div >
      <div className="flex gap-4 flex-wrap">
        {filteredcontents.map(({type, link, title}) => 
          <Card title={title} link={link} type={type} />
        )}
      </div>
    </div>
  </div>
}