import moment from 'moment';
import R from 'ramda';

const parseRSS2 = (entrys) => entrys.map((entry) => {
  const title = entry.title[0];
  const link = entry.link[0];
  const content = entry.description[0];
  const published = moment(entry.pubDate[0]).toDate().getTime();
  const author =  R.path(0)(entry.author);
  const creator = R.path(['dc:creator', 0])(entry);
  return {title, link, content, published, author};
});

const parseATOM = (entrys) => entrys.map((entry) => {
  const title = entry.title[0]._ || entry.title[0];
  const link = entry.link[0].$.href;
  const content = R.path([0, '_'])(entry.content);
  const summary = entry.summary[0]._;
  const published = R.path(0)(entry.published);
  const updated = R.path(0)(entry.updated);
  const author = R.path([0,'name', 0])(entry.author);
  return {title, link, content, summary, published, updated, author};
});

const checkFeedStandard = (feed) => {
  if (feed.rss) {
    return 'RSS2';
  }
  if (feed.feed.entry) {
    return 'ATOM';
  }
};

export const parse = (feed) => {
  switch (checkFeedStandard(feed)) {
  case 'RSS2':
    return parseRSS2(feed.feed.entry);
  case 'ATOM':
    return parseATOM(feed.rss.channel[0].item);
  default:
    return [];
  }
};
