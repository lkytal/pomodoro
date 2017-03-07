'use strict';

import * as vscode from 'vscode';
import PomodoroManager = require('./pomodoroManager');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    let pomodoroManager = new PomodoroManager();

    // list of commands
    let startDisposable = vscode.commands.registerCommand('extension.startPomodoro', () => {
        pomodoroManager.start();
    });

    let stopDisposable = vscode.commands.registerCommand('extension.pausePomodoro', () => {
        pomodoroManager.pause();
    });

    let resetDisposable = vscode.commands.registerCommand('extension.resetPomodoro', () => {
        pomodoroManager.reset();
    });

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(pomodoroManager);
    context.subscriptions.push(startDisposable);
    context.subscriptions.push(stopDisposable);
    context.subscriptions.push(resetDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}