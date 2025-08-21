import { LaunchedChrome, Options } from "chrome-launcher/dist/chrome-launcher";
import { GhostCursor } from "ghost-cursor"
import { Browser, Page } from "rebrowser-puppeteer-core";
import Xvfb from "./xvfb";

export type BrowserLaunchOptions = {
    args?: Array<string>,
    headless?: boolean,
    customConfig?: Options,
    proxy?: ProxyOptions,
    connectOption?: Record<any, any>,
    disableXvfb?: boolean,
    ignoreAllFlags?: boolean,
}

export type ProxyOptions = {
    host: string;
    port: number;
    username?: string;
    password?: string;
}

export type PageControllerOptions = {
    browser: Browser,
    page: Page,
    proxy?: ProxyOptions,
    turnstile?: boolean,
    xvfbsession?: Xvfb,
    killProcess?: boolean,
    chrome: LaunchedChrome,
};

export type BrowserConnectResult = {
    browser: Browser,
    proxy?: ProxyOptions,
    xvfbsession?: Xvfb,
    killProcess?: boolean,
    chrome: LaunchedChrome,
};

export interface PageWithCursor extends Page {
    realClick: GhostCursor["click"];
    realCursor: GhostCursor,
}