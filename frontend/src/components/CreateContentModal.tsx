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

export function CreateContentModal(props: CreateContentModalProps) {
    const {open, onClose} = props;
    const [type, setType] = useState(ContentType.Youtube);
    const linkRef = useRef<HTMLInputElement>();
    const titleRef = useRef<HTMLInputElement>();
    const tagsRef = useRef<HTMLInputElement>();
    
    if(!open) return null;

    async function createcontent() {
        const link = linkRef.current.value;
        const title = titleRef.current.value;
        const tags = tagsRef.current.value;

        const tagsArray = tags.split(',')
        .map(tag => tag.trim())   // remove extra spaces
        .filter(tag => tag);      // remove empty strings

        await axios.post(BACKEND_URL + "/api/v1/content", {
            link,
            title,
            type,
            tags: tagsArray,
        }, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            }
        });
        alert("Content added");
    }

    const onSubmitClick = () => {
        createcontent();
        onClose();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60" onClick={onClose}>
            <div className="bg-white text-black p-4 rounded-lg shadow-lg z-10" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end">
                    <button onClick={onClose} className="cursor-pointer">
                        <CloseIcon size="md" />
                    </button>
                </div>
                <div className="text-black p-2 flex justify-center">
                    Add Content
                </div>
                <Input ref={titleRef} placeholder={"Title"} />
                <Input ref={linkRef} placeholder={"Link"} />
                <Input ref={tagsRef} placeholder={"Tags"} />
                <div className="font-bold flex justify-center pt-2 pb-2">
                    Type
                </div>
                <div className="flex justify-center gap-4 pt-2 pb-2">
                    <Button text="Youtube" variant={type===ContentType.Youtube ? "primary" : "secondary"} onClick={() => {setType(ContentType.Youtube)}} />
                    <Button text="Twitter" variant={type===ContentType.Twitter ? "primary" : "secondary"} onClick={() => {setType(ContentType.Twitter)}} />
                </div>

                <div className="flex justify-center pt-2">
                    <Button variant="primary" text="Submit" onClick={onSubmitClick} loading={false} />
                </div>
            </div>
        </div>
    );
}
