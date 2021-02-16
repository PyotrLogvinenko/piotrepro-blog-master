import matter from 'gray-matter'
import { useJsonForm } from 'next-tinacms-json'
import { usePlugin } from 'tinacms'

import Layout from '../components/Layout'
import BlogList from '../components/BlogList'

const Index = ({ jsonFile, allBlogs }) => {
  const formOptions = {
    label: 'Site Config',
    fields: [
      {
        label: 'OG-Image',
        name: 'og_image',
        component: 'image',
        // Generate the frontmatter value based on the filename
        parse: media => `/static/${media.filename}`,

        // Decide the file upload directory for the post
        uploadDir: () => '/public/static/',

        // Generate the src attribute for the preview image.
        previewSrc: fullSrc => fullSrc.replace('/public', ''),
      },
      {
        name: 'title',
        label: 'Site Title',
        component: 'text',
      },
      {
        name: 'description',
        label: 'Site Description',
        component: 'text',
      },
      {
        name: 'repositoryUrl',
        label: 'Repository Url',
        component: 'text',
      },
      {
        name: 'keywords',
        label: 'Keywords',
        component: 'text',
      },
    ],
  }
  const [data, form] = useJsonForm(jsonFile, formOptions)
  usePlugin(form)

  return (
    <Layout
      pathname="/"
      siteTitle={data.title}
      siteDescription={data.description}
      siteKeywords={data.keywords}
      siteOg_image={data.og_image}
    >
      <section>
        <BlogList allBlogs={allBlogs} />
      </section>
    </Layout>
  )
}

export default Index

Index.getInitialProps = async function() {
  const content = await import(`../data/config.json`)
  // get all blog data for list
  const posts = (context => {
    const keys = context.keys()
    const values = keys.map(context)
    const data = keys.map((key, index) => {
      // Create slug from filename
      const slug = key
        .replace(/^.*[\\\/]/, '')
        .split('.')
        .slice(0, -1)
        .join('.')
      const value = values[index]
      // Parse yaml metadata & markdownbody in document
      const document = matter(value.default)
      return {
        document,
        slug,
      }
    })
    return data
  })(require.context('../posts', true, /\.md$/))

  return {
    jsonFile: {
      fileRelativePath: `data/config.json`,
      data: content.default,
    },

    allBlogs: posts,
  }
}
