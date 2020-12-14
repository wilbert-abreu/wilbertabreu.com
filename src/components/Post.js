import Head from 'next/head'
import PageTitle from '@/components/PageTitle'
import tinytime from 'tinytime'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'

const mdxComponents = {
  pre: ({ className, ...props }) => (
    <pre className={`${className} rounded-md bg-gray-800 py-3 px-4 overflow-x-auto`} {...props} />
  ),
  'pre.code': ({ className, ...props }) => (
    <code className={`${className} text-gray-200`} {...props} />
  ),
}

const postDateTemplate = tinytime('{dddd}, {MMMM} {DD}, {YYYY}')

export default function Post({ meta, children, posts }) {
  const router = useRouter()
  const postIndex = posts.findIndex((post) => post.link === router.pathname)
  const previous = posts[postIndex + 1]
  const next = posts[postIndex - 1]

  return (
    <article className="xl:divide-y xl:divide-gray-200">
      <Head>
        <title>{meta.title} – Wilbert Abreu</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@wilbert_abreu" />
        <meta name="twitter:creator" content="@wilbert_abreu" />
        <meta name="twitter:title" content={`${meta.title} – Wilbert Abreu`} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={`https://wilbertabreu.com${meta.image}`} />
        <meta property="og:url" content={`https://wilbertabreu.com${router.pathname}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${meta.title} – Wilbert Abreu`} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={`https://wilbertabreu.com${meta.image}`} />
        <meta name="description" content={meta.description}></meta>
      </Head>
      <header className="pt-6 xl:pb-10">
        <div className="space-y-1 text-center">
          <dl className="space-y-10">
            <div>
              <dt className="sr-only">Published on</dt>
              <dd className="text-base font-medium leading-6 text-gray-500 dark:text-white">
                <time dateTime={meta.date}>{postDateTemplate.render(new Date(meta.date))}</time>
              </dd>
            </div>
          </dl>
          <div>
            <PageTitle>{meta.title}</PageTitle>
          </div>
        </div>
        {meta.tags && 
          <dl className="pt-6 xl:pt-11">
              <dt className="sr-only">Tags</dt>
              <dd>
                <ul className="flex justify-center">
                  <span dangerouslySetInnerHTML={{__html: `Tags:&nbsp;` }}/>

                  {meta.tags.map((tag, index) => (
                      <li key={tag} className="flex items-center">
                        <Link href={`/tag/${encodeURIComponent(tag)}`}>
                          <a className='cursor-pointer' dangerouslySetInnerHTML={{__html: `${index !== 0 ? '&nbsp;': ''}<span class="underline">${tag}</span>${index !== meta.tags.length - 1 ? ',': ''}`}}/>
                        </Link>
                      </li>
                    ))}
                </ul>
              </dd>
            </dl>
          }
      </header>
      <div
        className="pb-16 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:pb-20"
        style={{ gridTemplateRows: 'auto 1fr' }}
      >
        <div className="divide-y divide-gray-200 xl:divide-y-0">
          <dl className="pt-6 pb-10 xl:pt-11 ">
            <dt className="sr-only">Authors</dt>
            <dd>
              <ul className="flex justify-center space-x-8 xl:block sm:space-x-12 xl:space-x-0 xl:space-y-8">
                {meta.authors.map((author) => (
                  <li key={author.twitter} className="flex items-center space-x-2">
                    <img src={author.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <dl className="text-sm font-medium leading-5 whitespace-nowrap">
                      <dt className="sr-only">Name</dt>
                      <dd className="text-gray-900 dark:text-white">{author.name}</dd>
                      <dt className="sr-only">Twitter</dt>
                      <dd>
                        <a
                          href={`https://twitter.com/${author.twitter}`}
                          className="text-teal-500 hover:text-teal-600"
                        >
                          {author.twitter}
                        </a>
                      </dd>
                    </dl>
                  </li>
                ))}
              </ul>
            </dd>
          </dl>
          <dl/>
        </div>
    
        <div className="divide-y divide-gray-200 xl:pb-0 xl:col-span-3 xl:row-span-2">
          <div className="pt-10 pb-8 prose max-w-none dark:text-white">
            <MDXProvider components={mdxComponents}>{children}</MDXProvider>
          </div>
          {meta.discussion && (
            <div className="pt-6 pb-16">
              <p>
                Want to talk about this post?{' '}
                <a href={meta.discussion} className="font-medium text-teal-500 hover:text-teal-600">
                  Discuss this on GitHub &rarr;
                </a>
              </p>
            </div>
          )}
        </div>
        <footer className="text-sm font-medium leading-5 divide-y divide-gray-200 xl:col-start-1 xl:row-start-2">
          {(next || previous) && (
            <div className="py-8 space-y-8">
              {next && (
                <div>
                  <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-white">Next Article</h2>
                  <div className="text-teal-500 hover:text-teal-600">
                    <Link href={next.link}>
                      <a>{next.title}</a>
                    </Link>
                  </div>
                </div>
              )}
              {previous && (
                <div>
                  <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-white">
                    Previous Article
                  </h2>
                  <div className="text-teal-500 hover:text-teal-600">
                    <Link href={previous.link}>
                      <a>{previous.title}</a>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="pt-8">
            <Link href="/">
              <a className="text-teal-500 hover:text-teal-600">&larr; Back to the blog</a>
            </Link>
          </div>
        </footer>
      </div>
    </article>
  )
}
