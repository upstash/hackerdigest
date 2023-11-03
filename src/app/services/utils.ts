import parse from "node-html-parser"

const url = "https://news.ycombinator.com/"

async function fetchArticleTitlesNLinks(articleLimit = 3) {
  try {
    const response = await fetch(url)
    const html = await response.text()
    const root = parse(html)
    const links = root.querySelectorAll(".titleline")
    return links.slice(0, articleLimit).map((link) => {
      const title = link.text
      const href = link.querySelector("a")?.getAttribute("href")
      return { title, href }
    })
  } catch (error) {
    console.error("Error:", error)
  }
}

async function fetchInnerContent(url?: string): Promise<(string | string[]) | null> {
  try {
    if (!url) throw new Error("URL is missing!")
    if (!isValidUrl(url)) throw new Error("URL is not valid")

    const response = await fetch(url)
    const html = await response.text()
    const root = parse(html)
    const paragraphs = root.querySelectorAll("p")

    return chunkString(paragraphs.map((p) => p.innerText).join(" "))
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export type SummarizedArticle = {
  content: string | string[] | null
  title: string
  href: string | undefined
}

export async function getContentsOfArticles(): Promise<SummarizedArticle[] | undefined> {
  const articleLinksAndTitles = await fetchArticleTitlesNLinks()
  if (articleLinksAndTitles) {
    return await Promise.all(
      articleLinksAndTitles.map(async (linksAndTitles) => ({
        content: await fetchInnerContent(linksAndTitles.href),
        title: linksAndTitles.title,
        href: linksAndTitles.href,
      }))
    )
  }
}

function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString)
    return true
  } catch (err) {
    return false
  }
}

function chunkString(inputString: string, chunkSize = 4000) {
  if (inputString.length < chunkSize) return inputString
  else {
    const chunks = []
    for (let i = 0; i < inputString.length; i += chunkSize) {
      chunks.push(inputString.slice(i, i + chunkSize))
    }
    return chunks
  }
}
