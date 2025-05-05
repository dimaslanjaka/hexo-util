import Permalink from '../lib/permalink';

let permalink: Permalink;

console.log('--- constructor ---');

permalink = new Permalink(':year/:month/:day/:title');
console.log(permalink.rule === ':year/:month/:day/:title');
console.log(permalink.regex.toString() === /^(.+?)\/(.+?)\/(.+?)\/(.+?)$/.toString());
console.log(JSON.stringify(permalink.params) === JSON.stringify(['year', 'month', 'day', 'title']));

permalink = new Permalink(':year_:i_month_:i_day_:title');
console.log(permalink.rule === ':year_:i_month_:i_day_:title');
console.log(permalink.regex.toString() === /^(.+?)_(.+?)_(.+?)_(.+?)$/.toString());
console.log(JSON.stringify(permalink.params) === JSON.stringify(['year', 'i_month', 'i_day', 'title']));

permalink = new Permalink(':year/:month/:day/:title', {
  segments: {
    year: '(\\d{4})',
    month: '(\\d{2})',
    day: '(\\d{2})'
  }
});
console.log(permalink.rule === ':year/:month/:day/:title');
console.log(permalink.regex.toString() === /^(\d{4})\/(\d{2})\/(\d{2})\/(.+?)$/.toString());
console.log(JSON.stringify(permalink.params) === JSON.stringify(['year', 'month', 'day', 'title']));

permalink = new Permalink(':year/:month/:day/:title', {
  segments: {
    year: /(\d{4})/,
    month: /(\d{2})/,
    day: /(\d{2})/
  }
});
console.log(permalink.rule === ':year/:month/:day/:title');
console.log(permalink.regex.toString() === /^(\d{4})\/(\d{2})\/(\d{2})\/(.+?)$/.toString());
console.log(JSON.stringify(permalink.params) === JSON.stringify(['year', 'month', 'day', 'title']));

console.log('--- test() ---');
console.log(permalink.test('2014/01/31/test') === true);
console.log(permalink.test('foweirojwoier') === false);

console.log('--- parse() ---');
console.log(JSON.stringify(permalink.parse('2014/01/31/test')) === JSON.stringify({
  year: '2014',
  month: '01',
  day: '31',
  title: 'test'
}));
console.log(typeof permalink.parse('test') === 'undefined');

console.log('--- stringify() ---');
console.log(permalink.stringify({
  year: '2014',
  month: '01',
  day: '31',
  title: 'test'
}) === '2014/01/31/test');

console.log('--- stringify() - avoid infinite loops ---');
const post = {
  get path() {
    return this.permalink;
  },

  get permalink() {
    const permalink = new Permalink('/:permalink');
    return permalink.stringify(post);
  }
};

try {
  post.path;
  console.log('post.path should have thrown');
} catch (err) {
  console.log(err.message === 'Invalid permalink setting!');
}

try {
  post.permalink;
  console.log('post.permalink should have thrown');
} catch (err) {
  console.log(err.message === 'Invalid permalink setting!');
}

console.log('--- custom rule - :title.html ---');
permalink = new Permalink(':title.html');
console.log(permalink);
console.log(permalink.parse('test.html'));
