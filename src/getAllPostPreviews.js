function importAll(r) {
  return r
    .keys()
    .map((fileName) => ({
      link: fileName.substr(1).replace(/\/index\.mdx$/, ''),
      module: r(fileName),
    }))
}

function dateSortDesc(a, b) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

const importAllPreviews = () => importAll(require.context('./pages/?preview', true, /\.mdx$/))

export default function getAllPostPreviews() {
  return importAllPreviews().sort((a, b) =>
    dateSortDesc(a.module.meta.date, b.module.meta.date)
  )
}

export function getAllPostPreviewsByTag(tag) {
  return importAllPreviews().filter((a) => {
    if (a.module.meta.tags && a.module.meta.tags.includes(tag)) {
      return true
    } 
    return false
  }).sort((a, b) =>
    dateSortDesc(a.module.meta.date, b.module.meta.date)
  )
}

export function getAllPostTags() {
  const tagsSet = new Set()
  importAllPreviews().array.forEach(post => {
    (post.module?.meta?.tags || []).forEach(tag => {
      tagsSet.add(tag)
    })
  });
  return [...tagsSet]
}
