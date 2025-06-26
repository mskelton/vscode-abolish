# Abolish

Auto correct misspelled words

## Extension Settings

### `abolish.defaultDictionaryEnabled`

_Default: `true`_

Uses a default dictionary of misspelled words that should be auto-corrected.

### `abolish.dictionary`

_Default: `{}`_

A dictionary of misspelled words to correct. If
`abolish.defaultDictionaryEnabled` is `true`, this will be merged with the
default dictionary.

```json
{
  "abolish.dictionary": {
    "hte": "the",
    "mispell": "misspell",
    "mispelled": "misspelled",
    "cosnt": "const",
    "functoin": "function"
  }
}
```

You can also use [Vim Abolish syntax](https://github.com/tpope/vim-abolish):

```json
{
  "abolish.dictionary": {
    "{despa,sepe}rat{e,es,ed,ing,ely,ion,ions,or}": "{despe,sepa}rat{}"
  }
}
```

This will be automatically converted to the following

```json
{
  "desparate": "desperate",
  "desparates": "desperates",
  "desparated": "desperated",
  "desparating": "desperating",
  "desparately": "desperately",
  "desparation": "desperation",
  "desparations": "desperations",
  "desparator": "desperator",
  "seperate": "separate",
  "seperates": "separates",
  "seperated": "separated",
  "seperating": "separating",
  "seperately": "separately",
  "seperation": "separation",
  "seperations": "separations",
  "seperator": "separator"
}
```
