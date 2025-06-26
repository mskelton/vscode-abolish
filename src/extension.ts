import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "abolish" is now active!');

    const disposable = vscode.commands.registerCommand('abolish.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from abolish!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log('Your extension "abolish" is now deactivated!');
}