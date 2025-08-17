import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export function useSharedContent(shareid?: string) {
    const [content, setContent] = useState([]);

    useEffect(() => {
        if (!shareid) return;
        axios.get(BACKEND_URL + "/api/v1/brain/" + shareid, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            }
        })
        .then((response) => {
            setContent(response.data.content);
        })
    }, [shareid])

    return content;
}
