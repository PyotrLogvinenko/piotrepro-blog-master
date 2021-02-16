import * as React from 'react'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import { usePlugin } from 'tinacms'
import { useMarkdownForm } from 'next-tinacms-markdown'
import {DiscussionEmbed} from "disqus-react"
import Layout from '../../components/Layout'
import { server } from '../../data'

export default function BlogTemplate(props) {
  const formOptions = {
    label: 'Blog Page',
    fields: [
      {
        label: 'Hero Image',
        name: 'frontmatter.hero_image',
        component: 'image',
        // Generate the frontmatter value based on the filename
        parse: media => `/static/${media.filename}`,

        // Decide the file upload directory for the post
        uploadDir: () => '/public/static/',

        // Generate the src attribute for the preview image.
        previewSrc: fullSrc => fullSrc.replace('/public', ''),
      },
      {
        name: 'frontmatter.title',
        label: 'Title',
        component: 'text',
      },
      {
        name: 'frontmatter.date',
        label: 'Date',
        component: 'date',
      },
      {
        name: 'frontmatter.author',
        label: 'Author',
        component: 'text',
      },
      {
        name: 'frontmatter.keywords',
        label: 'Keywords',
        component: 'text',
      },
      {
        name: 'frontmatter.description',
        label: 'Description',
        component: 'text',
      },
      {
        name: 'markdownBody',
        label: 'Blog Body',
        component: 'markdown',
      },
    ],
  }

  const [post, form] = useMarkdownForm(props.markdownFile, formOptions)
  usePlugin(form)

  function reformatDate(fullDate) {
    const date = new Date(fullDate)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('ru-RU', options);
  }

  const text = post.markdownBody
  const wpm = 225
  const words = text.trim().split(/\s+/).length
  const time = Math.ceil(words / wpm)
  const min = declOfNum(time, ['минута', 'минуты', 'минут']);
  function declOfNum(number, minutes) {  
    return minutes[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];
  }
  

// Disqus service 
  const disqusShortName = 'yourshortname_here' //add yours short name 
  const disqusConfig = {
        identifier: post.frontmatter.id, 
        title: post.frontmatter.title,
        url: `${server}/blog/` + post.frontmatter.id, 
  }
// End of this service  

  return (  
    <Layout siteTitle={props.title + ' – ' + post.frontmatter.title} 
    siteDescription={post.frontmatter.description}
    siteKeywords={post.frontmatter.keywords}
    siteOg_image={post.frontmatter.hero_image}
    >
      <article className="blog">
        <figure className="blog__hero">
          <img
            src={post.frontmatter.hero_image}
            alt={`blog_hero_${post.frontmatter.title}`}
          />
        </figure>
        <div className="blog__info">
          <h1>{post.frontmatter.title}</h1>
          <h3>{reformatDate(post.frontmatter.date)}</h3>
          <em>Читать примерно ~{time} {min}</em>
        </div>
        <div className="blog__body">
          <ReactMarkdown source={post.markdownBody} />
        </div>
        <h2 className="blog__footer">Кто это сделалъ: {post.frontmatter.author}</h2>
        <div className="blog__comment">
                <DiscussionEmbed shortname={disqusShortName} config={disqusConfig} />            
        </div>
      </article>
      
      <style jsx>
        {`

          .blog h1 {
            margin-bottom: 0.7rem;
          }

          .blog__hero {
            min-height: 300px;
            height: 60vh;
            width: 100%;
            margin: 0;
            overflow: hidden;
          }
          .blog__hero img {
            margin-bottom: 0;
            object-fit: cover;
            min-height: 100%;
            min-width: 100%;
            object-position: center;
          }

          .blog__info {
            padding: 0 1.25rem;
            width: 100%;
            max-width: 768px;
            margin: 0 auto;
          }
          .blog__info h1 {
            margin-bottom: 0.66rem;
          }
          .blog__info h3 {
            margin-bottom: 0;
          }

          .blog__body {
            width: 100%;
            padding: 0 1.25rem;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .blog__body a {
            padding-bottom: 1.5rem;
          }
          .blog__body:last-child {
            margin-bottom: 0;
          }
          .blog__body h1 h2 h3 h4 h5 h6 p {
            font-weight: normal;
          }
          .blog__body p {
            color: inherit;
          }
          .blog__body ul {
            list-style: initial;
          }
          .blog__body ul ol {
            margin-left: 1.25rem;
            margin-bottom: 1.25rem;
            padding-left: 1.45rem;
          }

          .blog__footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 1.25rem;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
          }
          .blog__footer h2 {
            margin-bottom: 0;
          }
          .blog__footer a {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .blog__footer a svg {
            width: 20px;
          }
          .blog__comment{
            width: 100%;
            position: relative;
            margin: auto;
            padding: 1rem;
          }

          @media (min-width: 768px) {
            .blog__comment{
              max-width: 800px;
            }
            .blog {
              display: flex;
              flex-direction: column;
            }
            .blog__body {
              max-width: 800px;
              padding: 0 1rem;
            }
            .blog__body span {
              width: 100%;
              margin: 1.5rem auto;
            }
            .blog__body ul ol {
              margin-left: 1.5rem;
              margin-bottom: 1.5rem;
            }
            .blog__hero {
              min-height: 400px;
              height: 25vh;
            }
            .blog__info {
              text-align: left;
              padding: 2rem 0;
            }
            .blog__info h1 {
              max-width: 500px;
              //margin: 0 auto 0.66rem auto;
            }
            .blog__footer {
              padding: 2.25rem;
            }
          }

          @media (min-width: 1440px) {
            .blog__comment{
              max-width: 800px;
            }
            .blog__hero {
              height: 70vh;
            }
            .blog__info {
              padding: 2rem 0;
            }
            .blog__footer {
              padding: 2rem 1rem;
            }
          }
        `}
      </style>
    </Layout>
  )
}

BlogTemplate.getInitialProps = async function(ctx) {
  const { slug } = ctx.query
  const content = await import(`../../posts/${slug}.md`)
  const config = await import(`../../data/config.json`)
  const data = matter(content.default)

  return {
    markdownFile: {
      fileRelativePath: `posts/${slug}.md`,
      frontmatter: data.data,
      markdownBody: data.content,
    },
    title: config.default.title,
  }
}
