import tinytime from 'tinytime'
import Link from 'next/link'
import Head from 'next/head'
import { getAllPostPreviewsByTag } from '@/getAllPostPreviews'
import { useRouter } from 'next/router'

const postDateTemplate = tinytime('{MMMM} {DD}, {YYYY}')

const title = 'Blog – Wilbert Abreu - Tags'
const description = 'Musings of an life long learner'
const twitterHandle = "@wilbert_abreu"

export default function Tags() {
    const router = useRouter()
    const { tag } = router.query
    const posts = getAllPostPreviewsByTag(tag)

    return (
    <div className="divide-y divide-gray-200">
        <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={twitterHandle} />
        <meta name="twitter:creator" content={twitterHandle} />
        <meta property="og:url" content="https://wilbertabreu.com" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://wilbertabreu.com/profile-pic.jpg"  />
        <title>{title}</title>
        <meta name="description" content={description} />
        </Head>
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-white sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Tag - {tag}
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-white">
            All the latest musings from a life long learner
        </p>
        </div>
        <ul className="divide-y divide-gray-200">
        {posts.map(({ link, module: { default: Component, meta } }) => {
            return (
            <li key={link} className="py-12">
                <article className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-white">
                    <time dateTime={meta.date}>{postDateTemplate.render(new Date(meta.date))}</time>
                    </dd>
                </dl>
                <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-6">
                    <h2 className="text-2xl font-bold leading-8 tracking-tight">
                        <Link href={link}>
                        <a className="text-gray-900 dark:text-white">{meta.title}</a>
                        </Link>
                    </h2>
                    <div className="prose text-gray-500 dark:text-white max-w-none">
                        <Component />
                    </div>
                    </div>
                    <div className="text-base font-medium leading-6">
                    <Link href={link}>
                        <a
                        className="text-teal-500 hover:text-teal-600"
                        aria-label={`Read "${meta.title}"`}
                        >
                        Read more &rarr;
                        </a>
                    </Link>
                    </div>
                </div>
                </article>
            </li>
            )
        })}
        </ul>
    </div>
    )
}