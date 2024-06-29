export interface PatentInfo {
    abstract: string;
    alias: string;
    id: string;
    image: string;
    index: string;
    inventors: string[];
    mapping: any;
    owner: string;
    publication_date: string;
    publication_id: string;
    score: number;
    snippet: string | null;
    title: string;
    type: string;
    www_link: string;
}

export interface Patent {
    citations: any;
    patentInfo: PatentInfo;
    percentages: { [key: string]: number };
    search: string;
    summary: string;
    dateSaved: string;
}

export interface FetchedPatents {
    patents: Patent[];
}
