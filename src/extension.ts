import * as vscode from 'vscode'
import { cache } from './cache'
import defaultDictionary from './dictionary.json'
import { expandDictionary } from './expander'

const WHITESPACE_CHARS = [' ', '\t', '\n', '\r']

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('abolish')) {
        cache.clear()
      }
    }),
  )

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.contentChanges.length === 0) {
        return
      }

      const activeEditor = vscode.window.activeTextEditor
      if (!activeEditor || activeEditor.document !== event.document) {
        return
      }

      for (const change of event.contentChanges) {
        if (
          change.text.length === 1 &&
          WHITESPACE_CHARS.includes(change.text)
        ) {
          handleAutoCorrect(activeEditor, change)
        }
      }
    }),
  )
}

function handleAutoCorrect(
  editor: vscode.TextEditor,
  change: vscode.TextDocumentContentChangeEvent,
) {
  const document = editor.document
  const position = change.range.start
  if (position.character === 0) {
    return
  }

  const range = document.getWordRangeAtPosition(position.translate(0, -1))
  if (!range) {
    return
  }

  const word = document.getText(range)
  const correction = getCorrectionForWord(word, document.uri)

  if (correction && correction !== word) {
    editor.edit((editBuilder) => {
      editBuilder.replace(range, correction)
    })
  }
}

function getCorrectionForWord(
  word: string,
  uri: vscode.Uri,
): string | undefined {
  const folder = vscode.workspace.getWorkspaceFolder(uri)
  const dictionary = getDictionary(folder?.uri)

  return dictionary[word]
}

const getDictionary = (uri: vscode.Uri | undefined): Record<string, string> => {
  return cache(uri?.toString() ?? 'global', () => {
    const config = vscode.workspace.getConfiguration('abolish', uri)

    const defaultDictionaryEnabled = config.get<boolean>(
      'defaultDictionaryEnabled',
    )
    const dictionary = config.get<Record<string, string>>('dictionary')

    const result: Record<string, string> = {}

    if (defaultDictionaryEnabled) {
      Object.assign(result, expandDictionary(defaultDictionary))
    }

    if (dictionary) {
      Object.assign(result, expandDictionary(dictionary))
    }

    return result
  })
}

export function deactivate() {
  cache.clear()
}
