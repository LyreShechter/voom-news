import "./ArticleHeadline.css";
import moment from "moment";

export function ArticleHeadline({
  title,
  author,
  publishedAt,
  url,
  urlToImage,
}) {
  return (
    <article className="article-headline">
      <h4>
        <a href={url} target="_blank">
          {title}
        </a>
      </h4>
      {/* <img src={urlToImage} /> */}
      <div className="article-headline--about">
        <p>By: {author}</p>
        <p>{moment(publishedAt).format("DD/MM/YYYY")}</p>
      </div>
    </article>
  );
}
