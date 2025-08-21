import { createCursor } from 'ghost-cursor';
import treeKill from 'tree-kill';
import { PageControllerOptions, PageWithCursor } from './types';
import Turnstile from './turnstile';

export default class CursorPage {

    static async create(params: PageControllerOptions): Promise<PageWithCursor> {
        let solveStatus = params.turnstile;
        params.page.on('close', () => {
            solveStatus = false
        });
        params.browser.on('disconnected', async () => {
            solveStatus = false
            if (params.killProcess === true) {
                if (params.xvfbsession) try { params.xvfbsession?.stop() } catch (err) { }
                if (params.chrome) try { params.chrome.kill() } catch (err) { console.log(err); }
                if (params.chrome.pid) try { treeKill(params.chrome.pid, 'SIGKILL', () => { }) } catch (err) { }
            }
        });
        async function turnstileSolver() {
            while (solveStatus) {
                await Turnstile.check(params.page).catch(() => { });
                await new Promise(r => setTimeout(r, 1000));
            }
            return;
        }
        turnstileSolver();
        if (params.proxy && params.proxy.username && params.proxy.password) {
            await params.page.authenticate({ username: params.proxy.username, password: params.proxy.password });
        }
        await params.page.evaluateOnNewDocument(() => {
            Object.defineProperty(MouseEvent.prototype, 'screenX', {
                get: function () {
                    return this.clientX + window.screenX;
                }
            });
            Object.defineProperty(MouseEvent.prototype, 'screenY', {
                get: function () {
                    return this.clientY + window.screenY;
                }
            });
        });
        const cursor = createCursor(params.page as any);
        const page: PageWithCursor = params.page as PageWithCursor;
        page.realCursor = cursor
        page.realClick = cursor.click
        return page;
    }

}
