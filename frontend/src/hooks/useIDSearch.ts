import { useState } from "react";
import { patentbyID } from "@/types/types";

export const useIDSearch = () => {
    const [patentsLoading, setPatentsLoading] = useState<boolean>(false);
    const [patentList, setPatentList] = useState<patentbyID>();

    const search = async (query: string) => {
        setPatentsLoading(true);
        try {
            const formattedSearch = {
                searchQuery: query,
                user: "user",
            };
    
            const response = await fetch('/api/IDsearch', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedSearch),
            });
            
            const data = await response.json();
            setPatentList(data);
        } catch(error) {
            console.log(error);
        } finally {
            setPatentsLoading(false);
        }
        
    };

    return {
        patentsLoading,
        patentList,
        search
    }
};
