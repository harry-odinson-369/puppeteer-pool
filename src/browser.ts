import { BrowserConnectResult, BrowserLaunchOptions } from "./types";
import puppeteer from "rebrowser-puppeteer-core";
import Xvfb from "./xvfb";

export default class BrowserHelper {
    async connect(params?: BrowserLaunchOptions): Promise<BrowserConnectResult> {
        let xvfbsession: Xvfb | null = null;

        if (process.platform === "linux" && (params?.disableXvfb ?? false) === false) {
            try {
                xvfbsession = new Xvfb({
                    silent: true,
                    xvfb_args: ["-screen", "0", "1920x1080x24", "-ac"],
                });
                xvfbsession.start();
            } catch (err: any) {
                console.log(`You are running on a Linux platform but do not have xvfb installed. The browser can be captured. Please install it with the following command\n\nsudo apt-get install xvfb\n\n${err.message}`);
            }
        }

        let chromeFlags: Array<any> = [];

        if ((params?.ignoreAllFlags ?? false) === true) {
            chromeFlags = [
                ...(params?.args ?? []),
                ...((params?.headless ?? false) !== false ? [`--headless=${params?.headless ?? false}`] : []),
                ...(params?.proxy && params?.proxy.host && params?.proxy.port ? [`--proxy-server=${params?.proxy.host}:${params?.proxy.port}`] : []),
            ];
        } else {
            // Default flags: https://github.com/GoogleChrome/chrome-launcher/blob/main/src/flags.ts
            const flags = (await import("chrome-launcher")).Launcher.defaultFlags();
            // Add AutomationControlled to "disable-features" flag
            const indexDisableFeatures = flags.findIndex((flag) => flag.startsWith('--disable-features'));
            flags[indexDisableFeatures] = `${flags[indexDisableFeatures]},AutomationControlled`;
            // Remove "disable-component-update" flag
            const indexComponentUpdateFlag = flags.findIndex((flag) => flag.startsWith('--disable-component-update'));
            flags.splice(indexComponentUpdateFlag, 1);
            chromeFlags = [
                ...flags,
                ...(params?.args ?? []),
                ...((params?.headless ?? false) !== false ? [`--headless=${params?.headless ?? false}`] : []),
                ...(params?.proxy && params?.proxy.host && params?.proxy.port ? [`--proxy-server=${params?.proxy.host}:${params?.proxy.port}`] : []),
                "--no-sandbox",
                "--disable-dev-shm-usage",
            ];
        }

        const chrome = await (await import("chrome-launcher")).launch({
            ignoreDefaultFlags: true,
            chromeFlags,
            ...(params?.customConfig ?? {}),
        });

        const browser = await puppeteer.connect({
            browserURL: `http://127.0.0.1:${chrome.port}`,
            ...(params?.connectOption ?? {}),
        });

        return {
            browser,
            chrome,
            killProcess: true,
            proxy: params?.proxy,
            xvfbsession: xvfbsession ?? undefined,
        };
    }
}