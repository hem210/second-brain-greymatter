import { Sidebar } from "../components/Sidebar";
import { Card } from "../components/Card";
import { useSharedContent } from "../hooks/useSharedContent";
import { useParams } from "react-router-dom";



export function SharedBrain() {
  console.log("reached here");
  
  const { shareid } = useParams<{ shareid: string }>();
  const contents = useSharedContent(shareid);

  return<div>
    <Sidebar />
    <div className="bg-custom-gray-200 p-4 min-h-screen ml-72">
      <div className="flex gap-4 flex-wrap">
        {contents.map(({type, link, title, ...rest}) => 
          <Card title={title} link={link} type={type} />
        )}
      </div>
    </div>
  </div>
}