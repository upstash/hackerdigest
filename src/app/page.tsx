import { getAllSummarizedArticles } from "./actions/get-all-summarized-articles"

export default async function Home() {
  const articles = await getAllSummarizedArticles()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#0B0A0A] p-24 text-[#FBFBFB]">
      <div className="w-[1200px]">
        <section className="pb-16 pt-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <h1 className="font- text-6xl font-bold tracking-tight">HackerDigest</h1>
              <p className="mb-12 mt-8 px-2 text-lg text-gray-400">
                Overwhelmed by endless Hacker News feeds? Get the lowdown fast with HackerDigest. We
                serve up the latest in tech, condensed into quick, easy-to-read summaries. Stay in
                the loop without the time sink. 🚀
              </p>
              <a className="button button-1 light text-lg font-semibold" href="#">
                View on Github
              </a>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-8 text-4xl font-bold tracking-tight">News</h2>
          <div className="grid grid-cols-2 gap-4">
            {articles.map((article, index) => (
              <div
                key={index}
                className="flex flex-col rounded-2xl border border-gray-900 bg-[#0c0d0ccc] p-8"
              >
                <h3 className="mb-2 text-lg font-semibold text-[#FBFBFB]">{article?.title}</h3>
                <p className="mb-4 text-sm font-medium text-gray-400">{article?.content}</p>
                {article?.originalLink && (
                  <a
                    href={article.originalLink}
                    className="border- mt-auto w-fit border-b border-dashed transition delay-75 ease-linear hover:border-solid hover:border-[#00a372] hover:text-[#00a372]"
                  >
                    Link to original article
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
