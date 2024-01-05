export type ShortendUrlResponseData = () => {
    id: string;
    urlId: string;
    shortUrl: string;
    longUrl: string;
    createdAt: string;
};

export type UrlData = {
    urlId: string;
    shortUrl: string;
    longUrl: string;
};
