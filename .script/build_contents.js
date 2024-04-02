const fs = require('fs')
const grayMatter = require('gray-matter')

const directory_path = './articles'
const json_filepath = './articles.json'

const category_list = {}

const category_names = fs.readdirSync(directory_path)
for (const category_name of category_names) {
  const files = fs.readdirSync(`${directory_path}/${category_name}`)
  const article_names = files.filter((directory_name) => fs.statSync(`${directory_path}/${category_name}/${directory_name}`).isDirectory())
  for (const article_name of article_names) {
    const markdown_filepath = `${directory_path}/${category_name}/${article_name}/${article_name}.md`
    const exist = fs.existsSync(markdown_filepath)
    if (!exist) {
      console.warn(`[WARN] markdown is not exists while markdown_filepath is [${markdown_filepath}]`)
      continue
    }
    const markdown = fs.readFileSync(markdown_filepath)
    const {data} = grayMatter(markdown)
    const title = data.title
    if (title == null) {
      console.warn(`[WARN] title is NULL while parse markdown_filepath [${markdown_filepath}]`)
      continue
    }
    if (Array.isArray(category_list[category_name])) {
      category_list[category_name].push({title})
    } else {
      category_list[category_name] = [{title}]
    }
  }
}

fs.writeFileSync(json_filepath, JSON.stringify(category_list))
