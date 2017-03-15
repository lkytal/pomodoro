import { window } from 'vscode';

import PomodoroStatus = require('./pomodoroStatus');
import Timer = require('./timer');

class Pomodoro {
    // properties
    private _status: PomodoroStatus;
    public get status() {
        return this._status;
    }
    public set status(status: PomodoroStatus) {
        this._status = status;
    }

    private _timer: Timer;
    public get timer() {
        return this._timer;
    }

    // events
    public ontick: { (): void };

    constructor(public workTime: number = 25, public pauseTime: number = 5) {
        this._timer = new Timer();
        this.status = PomodoroStatus.None;
    }

    // private methods
    private done() {
        this.stop();
        this.status = PomodoroStatus.Done;
    }

    private resetTimer(status: PomodoroStatus) {
        if (status == PomodoroStatus.Work) {
            this.timer.reset(this.workTime);
        }
        if (status == PomodoroStatus.Rest) {
            this.timer.reset(this.pauseTime);
        }
    }

    // public methods
    public start(status: PomodoroStatus = PomodoroStatus.Work) {
        if (status == PomodoroStatus.Work || status == PomodoroStatus.Rest) {
            if (this.status != PomodoroStatus.Paused)
                this.resetTimer(status);

            this.status = status;

            this._timer.start(() => {
                // stop the timer if no second left
                if (this.timer.currentTime <= 0) {
                    if (this.status == PomodoroStatus.Work) {
                        window.showInformationMessage('Work done! Take a break.');
                        this.start(PomodoroStatus.Rest);
                    }
                    else if (this.status == PomodoroStatus.Rest) {
                        window.showInformationMessage('Pause is over.');
                        this.done();
                    }
                }

                if (this.ontick) {
                    this.ontick();
                }
            });
        }
        else {
            console.error("Start timer error");
        }
    }

    public pause() {
        this.stop();
        this.status = PomodoroStatus.Paused;
    }

    public reset() {
        this.stop();
        this.status = PomodoroStatus.None;
        this._timer.currentTime = this.workTime;
    }

    public stop() {
        this._timer.stop();
    }

    public dispose() {
        this.stop();
        this.status = PomodoroStatus.None;
    }
}

export = Pomodoro;