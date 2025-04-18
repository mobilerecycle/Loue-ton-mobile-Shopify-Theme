theme.blog = (function () {
  function blogPost(e) {
    const blogContentInfo = e.querySelector(
      ".blog--item-1 .article-card__info"
    );
    const blogFirstItemImgWrapper = e.querySelector(
      ".blog--item-1 .media.media--landscape"
    );
    if (blogContentInfo && blogFirstItemImgWrapper) {
      blogFirstItemImgWrapper.style.height = `calc(100% - ${blogContentInfo.clientHeight}px)`;
    }
  }
  return blogPost;
})();
