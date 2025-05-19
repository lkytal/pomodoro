import { StatusBarAlignment, StatusBarItem, window } from "vscode";

import Pomodoro from "./pomodoro";
import PomodoroStatus from "./pomodoroStatus";

class PomodoroManager {
	// logic properties
	private _pomodoroIndex: number;
	public pomodori: Pomodoro[];

	public get currentPomodoro() {
		return this.pomodori[this._pomodoroIndex];
	}

	public get currentState() {
		switch (this.currentPomodoro.status) {
			case PomodoroStatus.Work:
				return " - work";
			case PomodoroStatus.Rest:
				return " - rest";
			case PomodoroStatus.Paused:
				return " - paused";
			case PomodoroStatus.Break:
					return " - break";
			default:
				return "";
		}
	}

	public get isSessionFinished(): boolean {
		return !this.currentPomodoro;
	}

	// UI properties
	private _statusBarItem: StatusBarItem;

	constructor(public workTime: number = 25, public pauseTime: number = 5) {
		// create status bar item
		if (!this._statusBarItem) {
			this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
			this._statusBarItem.command = "extension.togglePomodoro"; // Set the command for the single item
			this._statusBarItem.show();
		}

		this.reset();
		this.draw();
	}

	// private methods
	private update() {
		// handle launch of the next Pomodoro
		if (this.currentPomodoro.status === PomodoroStatus.Done) {
			this._pomodoroIndex++;

			if (!this.isSessionFinished) {
				this.start();
			}
		}
	}

	private draw() {
		if (this.isSessionFinished) {
			// show text when all Pomodoro sessions are over
			this._statusBarItem.text = "Restart session?";
			this._statusBarItem.tooltip = "Start a new Pomodoro session"; // Update tooltip
			this._statusBarItem.show();

			// show message if user needs a longer break
			if (this.pomodori.length > 1) {
				window.showInformationMessage("Well done! You should now take a longer break.");
			}

			return;
		}

		const seconds = this.currentPomodoro.timer.currentTime % 60;
		const minutes = (this.currentPomodoro.timer.currentTime - seconds) / 60;

		// update status bar (text)
		const timerPart = ((minutes < 10) ? "0" : "") + minutes + ":" + ((seconds < 10) ? "0" : "") + seconds;

		let pomodoroNumberPart = "";
		if (this.pomodori.length > 1) {
			pomodoroNumberPart += " (" + (this._pomodoroIndex + 1) + " out of " + this.pomodori.length + " pomodori)";
		}

		let icon = "";
		let tooltip = "";
		switch (this.currentPomodoro.status) {
			case PomodoroStatus.Work:
				icon = "$(primitive-square)"; // Pause icon
				tooltip = "Pause Pomodoro";
				break;
			case PomodoroStatus.Rest:
				icon = "$(primitive-square)"; // Pause icon
				tooltip = "Pause Pomodoro";
				break;
			case PomodoroStatus.Paused:
				icon = "$(triangle-right)"; // Start icon
				tooltip = "Start Pomodoro";
				break;
			case PomodoroStatus.Break:
				icon = "$(primitive-square)"; // Pause icon
				tooltip = "Pause Pomodoro";
				break;
			default:
				icon = "$(triangle-right)"; // Start icon
				tooltip = "Start Pomodoro";
				break;
		}

		this._statusBarItem.text = `${icon} ${timerPart}${this.currentState}${pomodoroNumberPart}`;
		this._statusBarItem.tooltip = tooltip;

		this._statusBarItem.show();
	}

	// public methods
	public start() {
		// launch a new session if the previous is already finished
		if (this.isSessionFinished) {
			this._pomodoroIndex = 0;
		}

		this.currentPomodoro.start();
		this.currentPomodoro.onTick = () => {
			this.update();
			this.draw();
		};
		this.draw(); // Initial draw to update the UI immediately
	}

	public pause() {
		this.currentPomodoro.pause();

		this.update();
		this.draw();
	}

	public reset() {
		this._pomodoroIndex = 0;
		this.pomodori = [];

		this.pomodori.push(new Pomodoro(this.workTime * 60, this.pauseTime * 60));
		this.draw(); // Draw after reset
	}

	public toggle() {
		if (this.isSessionFinished || this.currentPomodoro.status === PomodoroStatus.None || this.currentPomodoro.status === PomodoroStatus.Paused) {
			this.start();
		} else {
			this.pause();
		}
	}

	public dispose() {
		// stop current Pomodoro
		if (this.currentPomodoro) {
			this.currentPomodoro.dispose();
		}

		// reset UI
		this._statusBarItem.dispose();
	}
}

export default PomodoroManager;
