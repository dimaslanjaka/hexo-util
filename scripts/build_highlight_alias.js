const hljs = require('highlight.js');
const fs = require('fs');
const path = require('path');

const languages = hljs.listLanguages();
const result = {
  languages: languages,
  aliases: {}
};

languages.forEach(lang => {
  result.aliases[lang] = lang;

  const aliases = hljs.getLanguage(lang).aliases;

  if (aliases) {
    aliases.forEach(alias => {
      result.aliases[alias] = lang;
    });
  }
});

const outputPaths = [
  'highlight_alias.json',
  'dist/highlight_alias.json'
];

outputPaths.forEach(outputPath => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(result));
});
