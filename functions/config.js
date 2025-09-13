exports.FEEDS = [
  {
    id: 'cbc-top',
    name: 'CBC Top Stories',
    url: 'https://www.cbc.ca/cmlink/rss-topstories',
    type: 'rss',
    region: { country: 'CA' }
  },
  {
    id: 'global-national',
    name: 'Global News National',
    url: 'https://globalnews.ca/national/feed/',
    type: 'rss',
    region: { country: 'CA' }
  },
  {
    id: 'cbc-nb',
    name: 'CBC New Brunswick',
    url: 'https://www.cbc.ca/cmlink/rss-canada-newbrunswick',
    type: 'rss',
    region: { country: 'CA', province: 'NB' }
  }
];
