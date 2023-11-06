import { getAllSummarizedArticles } from "./actions/get-all-summarized-articles"

//Handle empty news state
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
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {articles.map((article, index) => (
              <div
                key={index}
                className="flex flex-col rounded-2xl border border-gray-900 bg-[#0c0d0ccc] p-8"
              >
                <div className="flex w-full justify-between">
                  <h3 className="mb-2 text-lg font-semibold text-[#FBFBFB]">{article?.title}</h3>
                  <span>{article?.postedDate}</span>
                </div>
                <p className="mb-4 text-sm font-medium text-gray-400">{article?.parsedContent}</p>
                <p>Author: {article?.author}</p>
                <p>Num of comments: {article?.numOfComments}</p>
                <p>Score: {article?.score}</p>
                {article?.url && (
                  <a
                    href={article.url}
                    target="_blank"
                    className="border- mt-auto w-fit border-b border-dashed transition delay-75 ease-linear hover:border-solid hover:border-[#00a372] hover:text-[#00a372]"
                  >
                    Go to original article
                  </a>
                )}
                {article?.commentUrl && (
                  <a
                    href={article.commentUrl}
                    target="_blank"
                    className="border- mt-auto w-fit border-b border-dashed transition delay-75 ease-linear hover:border-solid hover:border-[#00a372] hover:text-[#00a372]"
                  >
                    Go to comments
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
