"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringService = void 0;
const activity_service_1 = require("./activity.service");
class MonitoringService {
    constructor() {
        this.isRunning = false;
        this.checkInterval = 5 * 60 * 1000;
        this.threshold = 50;
    }
    static getInstance() {
        if (!MonitoringService.instance) {
            MonitoringService.instance = new MonitoringService();
        }
        return MonitoringService.instance;
    }
    async start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        console.log('Starting activity monitoring service...');
        const runCheck = async () => {
            try {
                await activity_service_1.ActivityService.analyzeActivity(5, this.threshold);
            }
            catch (error) {
                console.error('Error in activity monitoring:', error);
            }
            if (this.isRunning) {
                setTimeout(runCheck, this.checkInterval);
            }
        };
        await runCheck();
    }
    stop() {
        this.isRunning = false;
        console.log('Stopping activity monitoring service...');
    }
    setCheckInterval(minutes) {
        this.checkInterval = minutes * 60 * 1000;
    }
    setThreshold(threshold) {
        this.threshold = threshold;
    }
}
exports.MonitoringService = MonitoringService;
//# sourceMappingURL=monitoring.service.js.map