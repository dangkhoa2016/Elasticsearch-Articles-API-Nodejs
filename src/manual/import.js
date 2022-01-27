
const { ArticleService } = require('../services');
const { elasticsearch: { client, indexName } } = require('../libs');
const { ElasticsearchService } = require('../services');
const Promise = require('bluebird');
const debug = require('debug')('elasticsearch-articles-api-nodejs:Manual->import');

(async () => {
  const size = 30;
  var pageIndex = 1;
  var isContinue = true;
  var total = 0;

  await ElasticsearchService.initIndex();
  while (isContinue) {

    var articles = await loadArticles(pageIndex, size);

    if (Array.isArray(articles) && articles.length > 0) {
      var body = articles.flatMap((article) => {
        return [
          // v7
          // { index: { _index: indexName, _id: article.id.toString() } }, article
          // v6
          // { index: { _index: indexName, _id: article.id.toString(), _type: '_doc' } }, article
          // v5
          { index: { _index: indexName, _id: article.id.toString(), _type: 'articles' } }, article
        ];
      });

      var result = await client.bulk({ refresh: true, body });
      debug(JSON.stringify(result));

      total += articles.length;
      pageIndex += 1;
    } else {
      isContinue = false;
      debug(`Done: ${total}`);
    }
  }
})();

async function loadArticles(pageIndex, pageSize) {
  if (pageIndex < 1)
    pageIndex = 1;
  var articles = await ArticleService.getAll((pageIndex - 1) * pageSize, pageSize, false);
  if (articles.length > 0)
    return await Promise.map(articles, async (article) => { return await article.as_indexed_json() });
}