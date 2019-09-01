class Timer {
	private _timerId: NodeJS.Timer;
	public get isRunning() {
		return this._timerId != null;
	}

	constructor(public currentTime: number = 0, public interval: number = 1000) {
		this._timerId = null;
	}

	public reset(time: number) {
		this.stop();
		this.currentTime = time;
	}

	public start(callback) {
		if (this._timerId == null) {
			this._timerId = setInterval(() => {
				this.tick();
				callback();
			}, this.interval);
		}
		else {
			console.error("A timer instance is already running...");
		}
	}

	public stop() {
		if (this._timerId != null) {
			clearInterval(this._timerId);
		}

		this._timerId = null;
	}

	private tick() {
		this.currentTime -= this.interval / 1000;
	}
}

export default Timer;
