// app/crawler/page.tsx
import { Metadata } from "next";
import content from "../../../content.json";

export const metadata: Metadata = {
    title: content.openGraph.title,
    description: content.openGraph.description,
    openGraph: {
        title: content.openGraph.title,
        description: content.openGraph.description,
        url: content.openGraph.url,
        images: [
            {
                url: new URL(content.openGraph.image, content.openGraph.url).href,
                width: 1200,
                height: 630,
            },
        ],
        type: "website",
    },
};

export default function Page() {
    return (
        <html>
            <body>
                <h1>SEO page for crawler</h1>
                <p>This page is only for bots.</p>
            </body>
        </html>
    );
}
