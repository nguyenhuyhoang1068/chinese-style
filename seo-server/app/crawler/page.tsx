// app/crawler/page.tsx
import fs from "fs";
import path from "path";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const filePath = path.join(process.cwd(), "seo-server", "content.json");
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));

    return {
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
}

export default function Page() {
    return (
        <div>
            <h1>OG Tags Rendered (for bots)</h1>
        </div>
    );
}
