import content from "../../../content.json";
import Head from "next/head";

export default function CrawlerPage() {
    const { title, description, image, url } = content.openGraph;

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={new URL(image, url).href} />
                <meta property="og:url" content={url} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:type" content="website" />
            </Head>

            <div style={{ padding: 40 }}>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
        </>
    );
}
