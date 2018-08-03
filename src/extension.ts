"use strict";

import * as vscode from "vscode";
import PomodoroManager = require("./pomodoroManager");

export function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration("pomodoro");
	const pomodoroManager = new PomodoroManager(config.workTime, config.pauseTime);

	// list of commands
	const startDisposable = vscode.commands.registerCommand("extension.startPomodoro", () => {
		pomodoroManager.start();
	});

	const stopDisposable = vscode.commands.registerCommand("extension.pausePomodoro", () => {
		pomodoroManager.pause();
	});

	const resetDisposable = vscode.commands.registerCommand("extension.resetPomodoro", () => {
		pomodoroManager.reset();
	});

	// Add to a list of disposables which are disposed when this extension is deactivated.
	context.subscriptions.push(pomodoroManager, startDisposable, stopDisposable, resetDisposable);
}

// this method is called when your extension is deactivated
// tslint:disable-next-line:no-empty
export function deactivate() {
}
